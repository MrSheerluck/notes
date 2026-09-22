import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type SeriesPage = {
  slug?: FullSlug
  frontmatter?: {
    title?: unknown
  }
}

function targetFromFrontmatter(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  const target = value
    .trim()
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .split("|")[0]
    .split("#")[0]
    .replace(/\.md$/i, "")
    .trim()

  return target.length > 0 ? target : undefined
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/^\/+|\/+$/g, "")
}

function findSeriesPage(value: unknown, allFiles: SeriesPage[]): SeriesPage | undefined {
  const target = targetFromFrontmatter(value)
  if (!target) return undefined

  const targetNormalized = normalized(target)
  const targetSlug = targetNormalized.replace(/[^a-z0-9]+/g, "-")

  return allFiles.find((page) => {
    if (!page.slug) return false

    const slug = normalized(String(page.slug))
    const title = typeof page.frontmatter?.title === "string" ? page.frontmatter.title : ""
    const titleNormalized = normalized(title)
    const titleSlug = titleNormalized.replace(/[^a-z0-9]+/g, "-")

    return (
      slug === targetNormalized ||
      slug.endsWith(`/${targetNormalized}`) ||
      titleNormalized === targetNormalized ||
      titleSlug === targetSlug
    )
  })
}

function pageTitle(page: SeriesPage): string {
  return typeof page.frontmatter?.title === "string" ? page.frontmatter.title : String(page.slug)
}

const SeriesNavigation: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const previous = findSeriesPage(frontmatter.previous ?? frontmatter.prev, allFiles)
  const next = findSeriesPage(frontmatter.next, allFiles)

  if (!previous && !next) return null

  return (
    <nav class="series-navigation" aria-label="Article series navigation">
      <div class="series-navigation-item previous">
        {previous?.slug && (
          <>
            <span class="series-navigation-label">Previous</span>
            <a class="internal internal-link" href={resolveRelative(fileData.slug!, previous.slug)}>
              {pageTitle(previous)}
            </a>
          </>
        )}
      </div>
      <div class="series-navigation-item next">
        {next?.slug && (
          <>
            <span class="series-navigation-label">Next</span>
            <a class="internal internal-link" href={resolveRelative(fileData.slug!, next.slug)}>
              {pageTitle(next)}
            </a>
          </>
        )}
      </div>
    </nav>
  )
}

SeriesNavigation.css = `
.series-navigation {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--lightgray);
}

.series-navigation-item {
  min-width: 0;
}

.series-navigation-item.next {
  text-align: right;
}

.series-navigation-label {
  display: block;
  color: var(--gray);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.series-navigation a {
  display: block;
  margin-top: 0.25rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

@media (max-width: 600px) {
  .series-navigation {
    grid-template-columns: 1fr;
  }

  .series-navigation-item.next {
    text-align: left;
  }
}
`

export default (() => SeriesNavigation) satisfies QuartzComponentConstructor
