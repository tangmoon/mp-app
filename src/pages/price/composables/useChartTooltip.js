import { ref, computed, getCurrentInstance } from 'vue'
import { computeChartLayout, CHART_HEIGHT } from '../../../utils/chart'

/**
 * Tap-to-inspect behavior shared by the compact in-page chart (PriceIndexChart.vue)
 * and the wide, horizontally-scrollable detail-page chart: hit-tests a tap against
 * the same point geometry used to draw the chart's SVG (see computeChartLayout),
 * and returns tooltip data (date/value per series + floating-box position) for the
 * caller to render.
 *
 * series/names/width are expected to be refs/computeds so callers can pass
 * `toRef(props, 'series')`-style reactive sources.
 */
export function useChartTooltip({ series, names, width, imageSelector = '.chart-image' }) {
  const instance = getCurrentInstance()?.proxy
  const activeIndex = ref(-1)
  // boundingClientRect of the chart image as of the last tap - reused by `tooltip`
  // below to convert data-point positions into on-screen pixel coordinates.
  const lastRect = ref(null)

  const layout = computed(() => {
    const list = series.value
    return list && list.length ? computeChartLayout(list, width?.value) : null
  })

  function measureImage() {
    return new Promise((resolve) => {
      // `.in(instance)` is required to reach into a child custom component's own
      // scope (mp-weixin) but its callback never fires when the caller is itself a
      // page root (no meaningful child scope to resolve). Race it against an
      // unscoped query (which defaults to searching the current page) so whichever
      // form applies to this caller is the one that resolves.
      let settled = false
      const finish = (rect) => {
        if (settled || !rect || !rect.width) return
        settled = true
        resolve(rect)
      }
      if (instance) {
        uni.createSelectorQuery().in(instance).select(imageSelector).boundingClientRect(finish).exec()
      }
      uni.createSelectorQuery().select(imageSelector).boundingClientRect(finish).exec()
    })
  }

  async function onTap(e) {
    if (!layout.value) return
    const touch = e.touches && e.touches[0]
    const clientX = touch ? touch.clientX : e.clientX
    if (clientX === undefined) return

    const rect = await measureImage()
    if (!rect || !rect.width) return

    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const targetX = fraction * layout.value.width
    const { pointCount, xAt } = layout.value

    let nearest = 0
    let minDist = Infinity
    for (let i = 0; i < pointCount; i++) {
      const dist = Math.abs(xAt(i) - targetX)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    }
    lastRect.value = rect
    activeIndex.value = nearest
  }

  function closeTooltip() {
    activeIndex.value = -1
  }

  const tooltip = computed(() => {
    if (activeIndex.value < 0 || !layout.value || !lastRect.value) return null
    const i = activeIndex.value
    const { xAt, yAt, width: chartWidth } = layout.value
    const list = series.value
    const nameList = names?.value || []
    const rect = lastRect.value

    const rows = list.map((s, si) => ({
      color: s.color || '#2E6BFF',
      name: nameList[si] || '',
      value: s.points[i].y,
      yPct: (yAt(s.points[i].y) / CHART_HEIGHT) * 100,
    }))

    const pointXPct = (xAt(i) / chartWidth) * 100
    const topYPct = Math.max(4, Math.min(...rows.map((r) => r.yPct)))

    // Wrap-relative percentages: correct for guideline/dots always (they mark a
    // point on the chart itself, so they should scroll along with it), and for the
    // whole tooltip box on the compact, never-scrolled home-page chart.
    const boxXPct = Math.min(85, Math.max(15, pointXPct))

    // Viewport-fixed pixel position for the tooltip box on the wide, horizontally
    // scrollable detail chart - `rect` is viewport-relative (from
    // boundingClientRect) and already bakes in the current scroll offset, so
    // clamping against the actual screen width keeps the box on-screen regardless
    // of where in the (much wider) chart the tapped point happens to be.
    const viewportWidth = uni.getSystemInfoSync().windowWidth
    const boxHalfWidthPx = 150
    const rawLeftPx = rect.left + (pointXPct / 100) * rect.width
    const boxLeftPx = Math.min(viewportWidth - boxHalfWidthPx, Math.max(boxHalfWidthPx, rawLeftPx))
    const boxTopPx = rect.top + (topYPct / 100) * rect.height

    return {
      date: list[0].points[i].x,
      pointXPct,
      boxXPct,
      boxTopPct: topYPct,
      boxLeftPx,
      boxTopPx,
      rows,
    }
  })

  return { tooltip, onTap, closeTooltip }
}
