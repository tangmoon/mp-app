import { COLOR_ACCENT as ACCENT, COLOR_GREY as GREY } from './constants'

export function svg(markup) {
  return `data:image/svg+xml,${encodeURIComponent(markup)}`
}

export const icons = {
  avatar: svg(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='#8A9CFF'/><stop offset='1' stop-color='#5B6BE0'/></linearGradient></defs>` +
      `<circle cx='24' cy='24' r='24' fill='url(#g)'/>` +
      `<circle cx='24' cy='19' r='8' fill='#ffffff'/>` +
      `<path d='M8 42c1-9 8-14 16-14s15 5 16 14z' fill='#ffffff'/>` +
      `</svg>`
  ),
  search: svg(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
      `<circle cx='21' cy='21' r='13' fill='none' stroke='#B0B3BC' stroke-width='3.4'/>` +
      `<line x1='30' y1='30' x2='41' y2='41' stroke='#B0B3BC' stroke-width='3.6' stroke-linecap='round'/>` +
      `</svg>`
  ),
  add: svg(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
      `<circle cx='24' cy='24' r='21' fill='none' stroke='#2E6BFF' stroke-width='3'/>` +
      `<line x1='24' y1='14' x2='24' y2='34' stroke='#2E6BFF' stroke-width='3.2' stroke-linecap='round'/>` +
      `<line x1='14' y1='24' x2='34' y2='24' stroke='#2E6BFF' stroke-width='3.2' stroke-linecap='round'/>` +
      `</svg>`
  ),
  chart: svg(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
      `<rect x='7' y='26' width='9' height='16' rx='2' fill='#2E6BFF'/>` +
      `<rect x='20' y='16' width='9' height='26' rx='2' fill='#2E6BFF'/>` +
      `<rect x='33' y='6' width='9' height='36' rx='2' fill='#2E6BFF'/>` +
      `</svg>`
  ),
  empty: svg(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>` +
      `<ellipse cx='60' cy='104' rx='34' ry='6' fill='#EEF0F4'/>` +
      `<rect x='30' y='14' width='54' height='74' rx='8' fill='#F4F5F7' stroke='#DCDEE3' stroke-width='2'/>` +
      `<line x1='42' y1='34' x2='72' y2='34' stroke='#C3C6CC' stroke-width='4' stroke-linecap='round'/>` +
      `<line x1='42' y1='48' x2='72' y2='48' stroke='#C3C6CC' stroke-width='4' stroke-linecap='round'/>` +
      `<line x1='42' y1='62' x2='60' y2='62' stroke='#C3C6CC' stroke-width='4' stroke-linecap='round'/>` +
      `<circle cx='80' cy='82' r='16' fill='#EAF1FF' stroke='#2E6BFF' stroke-width='4'/>` +
      `<line x1='91' y1='93' x2='100' y2='102' stroke='#2E6BFF' stroke-width='5' stroke-linecap='round'/>` +
      `</svg>`
  ),
}

export function tabIcon(name, active) {
  const c = active ? ACCENT : GREY
  const paths = {
    home: `<path d='M24 5 L43 22 H37 V43 H28 V29 H20 V43 H11 V22 H5 Z' fill='${c}'/>`,
    doc: `<path d='M13 4h16l9 9v31H13z' fill='none' stroke='${c}' stroke-width='2.6' stroke-linejoin='round'/>` +
      `<path d='M29 4v9h9' fill='none' stroke='${c}' stroke-width='2.6' stroke-linejoin='round'/>` +
      `<line x1='18' y1='25' x2='33' y2='25' stroke='${c}' stroke-width='2.6' stroke-linecap='round'/>` +
      `<line x1='18' y1='33' x2='33' y2='33' stroke='${c}' stroke-width='2.6' stroke-linecap='round'/>`,
    exchange: `<path d='M6 17h30M28 9l8 8-8 8' fill='none' stroke='${c}' stroke-width='2.8' stroke-linecap='round' stroke-linejoin='round'/>` +
      `<path d='M42 31H12M20 23l-8 8 8 8' fill='none' stroke='${c}' stroke-width='2.8' stroke-linecap='round' stroke-linejoin='round'/>`,
    price: `<circle cx='24' cy='24' r='19' fill='none' stroke='${c}' stroke-width='2.6'/>` +
      `<text x='24' y='32' font-size='21' text-anchor='middle' fill='${c}' font-family='Arial,sans-serif'>¥</text>`,
    inquiry: `<rect x='8' y='6' width='23' height='29' rx='2.5' fill='none' stroke='${c}' stroke-width='2.6'/>` +
      `<line x1='14' y1='15' x2='25' y2='15' stroke='${c}' stroke-width='2.3' stroke-linecap='round'/>` +
      `<line x1='14' y1='22' x2='25' y2='22' stroke='${c}' stroke-width='2.3' stroke-linecap='round'/>` +
      `<circle cx='31' cy='33' r='7.5' fill='#ffffff' stroke='${c}' stroke-width='2.6'/>` +
      `<line x1='36.2' y1='38.2' x2='42' y2='44' stroke='${c}' stroke-width='2.6' stroke-linecap='round'/>`,
    map: `<path d='M24 4c-8.3 0-15 6.5-15 14.6C9 29 24 45 24 45s15-16 15-26.4C39 10.5 32.3 4 24 4z' fill='none' stroke='${c}' stroke-width='2.6' stroke-linejoin='round'/>` +
      `<circle cx='24' cy='18.5' r='5.5' fill='none' stroke='${c}' stroke-width='2.6'/>`,
  }
  return svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>${paths[name]}</svg>`)
}
