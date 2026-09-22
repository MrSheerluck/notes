import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import SeriesNavigation from "./quartz/components/SeriesNavigation"

const addSeriesNavigation = (layout: Awaited<ReturnType<typeof loadQuartzLayout>>) => {
  const seriesNavigation = SeriesNavigation()
  layout.defaults.afterBody = [...(layout.defaults.afterBody ?? []), seriesNavigation]
  for (const pageTypeLayout of Object.values(layout.byPageType)) {
    pageTypeLayout.afterBody = [...(pageTypeLayout.afterBody ?? []), seriesNavigation]
  }
  return layout
}

const config = await loadQuartzConfig(undefined, addSeriesNavigation)
export default config
const layout = await loadQuartzLayout()
addSeriesNavigation(layout)
export { layout }
