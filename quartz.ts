import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import SeriesNavigation from "./quartz/components/SeriesNavigation"
import { componentRegistry } from "./quartz/components/registry"
import { QuartzComponentConstructor } from "./quartz/components/types"
import { withArticleOrder } from "./quartz/components/OrderedArticleExplorer"
import { sortFolderPages } from "./quartz/util/articleOrder"
import { QuartzTransformerPluginInstance } from "./quartz/plugins/types"

componentRegistry.setOptionOverrides("@quartz-community/folder-page", { sort: sortFolderPages })

const mediaNotesOnlyShowUrl: QuartzTransformerPluginInstance = {
  name: "MediaNotesOnlyShowUrl",
  markdownPlugins() {
    return [
      () => {
        return (_tree, file) => {
          const data = file.data as {
            frontmatter?: { type?: unknown }
            noteProperties?: { properties?: Record<string, unknown> }
          }
          if (data.frontmatter?.type !== "media" || !data.noteProperties?.properties) {
            return
          }
          const url = data.noteProperties.properties.url
          data.noteProperties.properties = url === undefined ? {} : { url }
        }
      },
    ]
  },
}

const addSeriesNavigation = (layout: Awaited<ReturnType<typeof loadQuartzLayout>>) => {
  const seriesNavigation = SeriesNavigation()
  const registeredExplorer = componentRegistry.get("@quartz-community/explorer")
  const explorer = registeredExplorer
    ? componentRegistry.instantiate(registeredExplorer.component as QuartzComponentConstructor)
    : undefined
  const orderedExplorer = explorer ? withArticleOrder(explorer) : undefined
  const layouts = [layout.defaults, ...Object.values(layout.byPageType)]
  for (const pageLayout of layouts) {
    pageLayout.left = pageLayout.left?.map((component) =>
      component === explorer ? orderedExplorer! : component,
    )
  }
  layout.defaults.afterBody = [...(layout.defaults.afterBody ?? []), seriesNavigation]
  for (const pageTypeLayout of Object.values(layout.byPageType)) {
    pageTypeLayout.afterBody = [...(pageTypeLayout.afterBody ?? []), seriesNavigation]
  }
  return layout
}

const config = await loadQuartzConfig(undefined, addSeriesNavigation)
config.plugins.transformers.push(mediaNotesOnlyShowUrl)
export default config
const layout = await loadQuartzLayout()
addSeriesNavigation(layout)
export { layout }
