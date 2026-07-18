import { svg } from './icons'

const DEFAULT_WIDTH = 700
const HEIGHT = 380
const PAD_LEFT = 96
const PAD_RIGHT = 16
const PAD_TOP = 30
const PAD_BOTTOM = 48

function niceBounds(min, max) {
  const range = max - min || Math.abs(max) || 1
  const rough = range / 5
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = Math.ceil(rough / magnitude) * magnitude
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step
  return { min: niceMin, max: niceMax === niceMin ? niceMin + step : niceMax }
}

function fmt(n) {
  const rounded = Math.round(n * 100) / 100
  return Math.abs(rounded) >= 100 ? Math.round(rounded).toLocaleString('en-US') : String(rounded)
}

function buildGrid(min, max, plotW, plotH, width) {
  const gridCount = 5
  let grid = ''
  for (let i = 0; i <= gridCount; i++) {
    const v = min + ((max - min) * i) / gridCount
    const y = PAD_TOP + plotH - (plotH * i) / gridCount
    grid +=
      `<line x1='${PAD_LEFT}' y1='${y}' x2='${width - PAD_RIGHT}' y2='${y}' stroke='#eef0f4' stroke-width='1.5'/>` +
      `<text x='${PAD_LEFT - 12}' y='${y + 6}' font-size='22' text-anchor='end' fill='#8a8d94' font-family='Arial,sans-serif'>${fmt(v)}</text>`
  }
  return grid
}

function buildAxisLabels(width) {
  return (
    `<text x='${PAD_LEFT}' y='18' font-size='22' fill='#c3c6cc' font-family='Arial,sans-serif'>价格</text>` +
    `<text x='${width - PAD_RIGHT}' y='${HEIGHT - 12}' font-size='22' text-anchor='end' fill='#c3c6cc' font-family='Arial,sans-serif'>日期</text>`
  )
}

function buildXLabels(points, xLabelIndexes, xAt) {
  let xLabels = ''
  xLabelIndexes.forEach((i) => {
    const anchor = i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'
    xLabels += `<text x='${xAt(i)}' y='${HEIGHT - 12}' font-size='22' text-anchor='${anchor}' fill='#8a8d94' font-family='Arial,sans-serif'>${points[i].x}</text>`
  })
  return xLabels
}

// Default viewBox size for the compact in-page chart. The detail page (see
// pages/price/detail) passes a wider `width` to computeChartLayout/buildAreaChart/
// buildLineChart to spread points out along a longer x-axis - height is never
// parameterized since only the x-axis needs stretching there.
export const CHART_WIDTH = DEFAULT_WIDTH
export const CHART_HEIGHT = HEIGHT

/**
 * Shared geometry (point pixel positions in the 0..width/0..CHART_HEIGHT viewBox
 * space) used both to draw the SVG and to hit-test taps against the same points -
 * keeps the two in lockstep so tooltips never drift from the rendered line.
 * seriesList: [{ points: [{ x: string, y: number }] }]
 */
export function computeChartLayout(seriesList, width = DEFAULT_WIDTH) {
  const plotW = width - PAD_LEFT - PAD_RIGHT
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM

  const allValues = seriesList.flatMap((s) => s.points.map((p) => p.y))
  const { min, max } = niceBounds(Math.min(...allValues), Math.max(...allValues))
  const pointCount = seriesList[0].points.length

  const xAt = (i) => PAD_LEFT + (plotW * i) / (pointCount - 1)
  const yAt = (v) => PAD_TOP + plotH - ((v - min) / (max - min)) * plotH

  return { min, max, plotW, plotH, pointCount, xAt, yAt, width }
}

/**
 * points: [{ x: string, y: number }]
 * xLabelIndexes: which point indexes get an x-axis label
 * width: viewBox width - widen this (see pages/price/detail) to spread points out
 */
export function buildAreaChart(points, xLabelIndexes = [], width = DEFAULT_WIDTH) {
  const { min, max, plotW, plotH, xAt, yAt } = computeChartLayout([{ points }], width)

  const linePoints = points.map((p, i) => `${xAt(i)},${yAt(p.y)}`).join(' ')
  const areaPoints = `${xAt(0)},${PAD_TOP + plotH} ${linePoints} ${xAt(points.length - 1)},${PAD_TOP + plotH}`

  const markup =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${HEIGHT}'>` +
    `<defs><linearGradient id='fill' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='#2E6BFF' stop-opacity='0.28'/><stop offset='1' stop-color='#2E6BFF' stop-opacity='0.02'/></linearGradient></defs>` +
    buildGrid(min, max, plotW, plotH, width) +
    buildAxisLabels(width) +
    `<polygon points='${areaPoints}' fill='url(#fill)'/>` +
    `<polyline points='${linePoints}' fill='none' stroke='#2E6BFF' stroke-width='4' stroke-linejoin='round' stroke-linecap='round'/>` +
    buildXLabels(points, xLabelIndexes, xAt) +
    `</svg>`

  return svg(markup)
}

/**
 * seriesList: [{ color: string, points: [{ x: string, y: number }] }]
 * All series must share the same point count / x categories.
 * width: viewBox width - widen this (see pages/price/detail) to spread points out
 */
export function buildLineChart(seriesList, xLabelIndexes = [], width = DEFAULT_WIDTH) {
  const { min, max, plotW, plotH, xAt, yAt } = computeChartLayout(seriesList, width)

  const lines = seriesList
    .map((s) => {
      const pts = s.points.map((p, i) => `${xAt(i)},${yAt(p.y)}`).join(' ')
      return `<polyline points='${pts}' fill='none' stroke='${s.color}' stroke-width='4' stroke-linejoin='round' stroke-linecap='round'/>`
    })
    .join('')

  const markup =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${HEIGHT}'>` +
    buildGrid(min, max, plotW, plotH, width) +
    buildAxisLabels(width) +
    lines +
    buildXLabels(seriesList[0].points, xLabelIndexes, xAt) +
    `</svg>`

  return svg(markup)
}
