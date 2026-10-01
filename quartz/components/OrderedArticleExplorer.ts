import { VNode } from "preact"
import { QuartzComponent } from "./types"
import { compareArticleOrder } from "../util/articleOrder"

// ContentIndex omits frontmatter, so embed the published pages' lesson numbers
// in Explorer's existing serialized sorter rather than altering its index format.
export function withArticleOrder(explorer: QuartzComponent): QuartzComponent {
  const orderedExplorer: QuartzComponent = (props) => {
    const rendered = explorer(props) as VNode<Record<string, unknown>>
    const dataFns = rendered.props["data-data-fns"]
    if (typeof dataFns !== "string") return rendered

    const options = JSON.parse(dataFns)
    const orders = Object.fromEntries(
      props.allFiles
        .filter(
          (page) =>
            page.slug?.startsWith("articles/") &&
            typeof page.frontmatter?.order === "number" &&
            Number.isFinite(page.frontmatter.order),
        )
        .map((page) => [page.slug, page.frontmatter?.order]),
    )
    options.sortFn = `function (a, b) {
      if (!a.isFolder && !b.isFolder) {
        const orders = ${JSON.stringify(orders)};
        const compare = ${compareArticleOrder.toString()};
        const order = compare(
          { slug: a.data?.slug, order: orders[a.data?.slug] },
          { slug: b.data?.slug, order: orders[b.data?.slug] }
        );
        if (order !== 0) return order;
      }
      return (${options.sortFn})(a, b);
    }`
    rendered.props["data-data-fns"] = JSON.stringify(options)
    return rendered
  }
  return Object.assign(orderedExplorer, explorer)
}
