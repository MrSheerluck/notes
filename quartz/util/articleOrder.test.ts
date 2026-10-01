import assert from "node:assert/strict"
import { test } from "node:test"
import { Explorer, ExplorerOptions } from "@quartz-community/explorer"
import { VNode } from "preact"
import { withArticleOrder } from "../components/OrderedArticleExplorer"
import { QuartzComponentProps } from "../components/types"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug } from "./path"
import { sortFolderPages } from "./articleOrder"

function page(slug: string, title: string, order?: unknown, modified = "2026-09-01") {
  return {
    slug: slug as FullSlug,
    frontmatter: { title, order },
    dates: {
      created: new Date(modified),
      modified: new Date(modified),
      published: new Date(modified),
    },
    defaultDateType: "modified",
  } satisfies QuartzPluginData
}

const lessons = [
  page("articles/rust/ownership", "Ownership", 3, "2026-09-30"),
  page("articles/rust/variables", "Variables", 1, "2026-09-01"),
  page("articles/rust/control-flow", "Control flow", 2, "2026-09-20"),
  page("articles/rust/extra", "Additional reading"),
]

test("article folder listings follow lesson order despite dates and titles", () => {
  assert.deepEqual(
    [...lessons].sort(sortFolderPages).map((p) => p.frontmatter.title),
    ["Variables", "Control flow", "Ownership", "Additional reading"],
  )
})

test("other sections retain date sorting and folders stay first", () => {
  const notes = [page("notes/older", "Older", 1), page("notes/newer", "Newer", 9, "2026-09-30")]
  assert.equal([...notes].sort(sortFolderPages)[0].frontmatter.title, "Newer")
  const folder = page("articles/rust/index", "Rust")
  assert.equal(sortFolderPages(folder, lessons[0]), -1)
})

test("Explorer's serialized sorter runs without server closures and matches lesson order", () => {
  const original = Explorer()
  const explorer = withArticleOrder(original)
  assert.equal(explorer.afterDOMLoaded, original.afterDOMLoaded)
  const vnode = explorer({
    allFiles: lessons,
    cfg: { locale: "en-US" },
  } as unknown as QuartzComponentProps) as VNode<Record<string, string>>
  const options = JSON.parse(vnode.props["data-data-fns"])
  // Reconstruct the function exactly as Explorer does after loading ContentIndex.
  const sort = new Function("a", "b", `return (${options.sortFn})(a, b)`) as NonNullable<
    ExplorerOptions["sortFn"]
  >
  const nodes = lessons.map((p) => ({
    isFolder: false,
    children: [],
    displayName: p.frontmatter.title,
    data: { slug: p.slug, title: p.frontmatter.title },
  }))
  assert.deepEqual(
    nodes.sort(sort).map((n) => n.displayName),
    ["Variables", "Control flow", "Ownership", "Additional reading"],
  )
  const folder = {
    isFolder: true,
    children: [],
    displayName: "Rust",
    data: { slug: "articles/rust/index" },
  }
  assert.equal(sort(folder, nodes[0]), -1)
  assert.ok(
    sort(
      { isFolder: false, children: [], displayName: "Alpha", data: { slug: "notes/alpha" } },
      { isFolder: false, children: [], displayName: "Zulu", data: { slug: "notes/zulu" } },
    ) < 0,
  )
})
