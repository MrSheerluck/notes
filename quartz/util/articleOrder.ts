import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabeticalFolderFirst } from "../components/PageList"
import { isFolderPath } from "./path"

type OrderedArticle = { slug?: string; order?: unknown }

// Keep this function self-contained: Explorer serializes it for use in the browser.
export function compareArticleOrder(a: OrderedArticle, b: OrderedArticle): number {
  const aSlug = a.slug ?? ""
  const bSlug = b.slug ?? ""
  if (
    !aSlug.startsWith("articles/") ||
    !bSlug.startsWith("articles/") ||
    aSlug.slice(0, aSlug.lastIndexOf("/")) !== bSlug.slice(0, bSlug.lastIndexOf("/"))
  ) {
    return 0
  }

  const aOrder = typeof a.order === "number" && Number.isFinite(a.order) ? a.order : Infinity
  const bOrder = typeof b.order === "number" && Number.isFinite(b.order) ? b.order : Infinity
  return aOrder === bOrder ? 0 : aOrder - bOrder
}

const defaultSort = byDateAndAlphabeticalFolderFirst()

export function sortFolderPages(a: QuartzPluginData, b: QuartzPluginData): number {
  if (!isFolderPath(a.slug ?? "") && !isFolderPath(b.slug ?? "")) {
    const order = compareArticleOrder(
      { slug: a.slug, order: a.frontmatter?.order },
      { slug: b.slug, order: b.frontmatter?.order },
    )
    if (order !== 0) return order
  }
  return defaultSort(a, b)
}
