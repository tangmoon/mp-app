import { mockRequest, request } from './request'
import { COLOR_UP, COLOR_DOWN, COLOR_ACCENT, COLOR_ACCENT_ORANGE } from '../utils/constants'

const RED = COLOR_UP
const GREEN = COLOR_DOWN
const BLUE = COLOR_ACCENT
const ORANGE = COLOR_ACCENT_ORANGE

function pts(base, points) {
  return points.map(([x, y]) => ({ x, y: base + y }))
}

/**
 * "价格与指数" tab 的 5 个价格指数（每个指数 variant 不同，见 price.vue 顶部注释）。
 */
export function getPriceIndexData() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/price/index-data' })
  return mockRequest([
    {
      key: 'cylng',
      label: 'CYLNG价格指数(川渝)',
      variant: 'legacy',
      title: '川渝液化天然气价格（CYLNG价格）',
      date: '2026-7-9',
      price: '5502.00',
      changeText: '+33.00',
      pctText: '+0.60',
      color: RED,
      points: pts(0, [
        ['2026-6-10', 6220],
        ['2026-6-12', 6250],
        ['2026-6-14', 6360],
        ['2026-6-16', 6400],
        ['2026-6-18', 6430],
        ['2026-6-20', 6410],
        ['2026-6-22', 6400],
        ['2026-6-24', 6395],
        ['2026-6-26', 6300],
        ['2026-6-28', 6100],
        ['2026-6-30', 5980],
        ['2026-7-2', 5850],
        ['2026-7-4', 5620],
        ['2026-7-6', 5480],
        ['2026-7-7', 5460],
        ['2026-7-8', 5470],
        ['2026-7-9', 5502],
      ]),
      xLabelIndexes: [0, 5, 10, 16],
    },
    {
      key: 'liaochang',
      label: '液厂原料气现货价格',
      variant: 'cards',
      datasets: [
        {
          title: '2026年02液厂原料气现货价格',
          date: '发布时间：2026-03-26',
          blocks: [
            {
              heading: '长庆油气田周边',
              color: '#2E6BFF',
              bg: '#EAF1FF',
              rows: [
                [
                  { label: '加权平均价格', value: '2.049', unit: '元/立方米' },
                  { label: '月环比涨幅', value: '+3.90', unit: '%' },
                  { label: '年同比涨幅', value: '-16.33', unit: '%' },
                ],
                [
                  { label: '绝对值区间', value: '2.000-2.130', unit: '元/立方米' },
                  { label: '公共价格区间', value: '2.077-2.130', unit: '元/立方米' },
                ],
              ],
            },
            {
              heading: '塔里木油气田周边',
              color: '#1B9E5A',
              bg: '#E9F8EF',
              rows: [
                [
                  { label: '加权平均价格', value: '1.863', unit: '元/立方米' },
                  { label: '月环比涨幅', value: '-6.57', unit: '%' },
                  { label: '年同比涨幅', value: '-19.56', unit: '%' },
                ],
                [
                  { label: '绝对值区间', value: '1.883-2.127', unit: '元/立方米' },
                  { label: '公共价格区间', value: '2.202-2.127', unit: '元/立方米' },
                ],
              ],
            },
            {
              heading: '西南油气田周边',
              color: '#E08A3C',
              bg: '#FDEEDD',
              rows: [
                [
                  { label: '加权平均价格', value: '2.104', unit: '元/立方米' },
                  { label: '月环比涨幅', value: '+1.20', unit: '%' },
                  { label: '年同比涨幅', value: '-10.48', unit: '%' },
                ],
                [
                  { label: '绝对值区间', value: '2.050-2.180', unit: '元/立方米' },
                  { label: '公共价格区间', value: '2.100-2.180', unit: '元/立方米' },
                ],
              ],
            },
          ],
          chart: {
            series: [
              {
                color: BLUE,
                points: pts(0, [
                  ['2025-4', 2.24],
                  ['2025-5', 2.25],
                  ['2025-6', 2.27],
                  ['2025-7', 2.28],
                  ['2025-8', 2.28],
                  ['2025-9', 2.27],
                  ['2025-10', 2.1],
                  ['2025-11', 2.15],
                  ['2025-12', 2.0],
                  ['2026-1', 2.13],
                  ['2026-2', 2.09],
                  ['2026-3', 2.342],
                ]),
              },
              {
                color: ORANGE,
                points: pts(0, [
                  ['2025-4', 2.3],
                  ['2025-5', 2.33],
                  ['2025-6', 2.36],
                  ['2025-7', 2.3],
                  ['2025-8', 2.25],
                  ['2025-9', 2.2],
                  ['2025-10', 2.52],
                  ['2025-11', 2.4],
                  ['2025-12', 2.15],
                  ['2026-1', 2.09],
                  ['2026-2', 2.2],
                  ['2026-3', 2.306],
                ]),
              },
              {
                color: GREEN,
                points: pts(0, [
                  ['2025-4', 3.05],
                  ['2025-5', 2.7],
                  ['2025-6', 2.85],
                  ['2025-7', 2.35],
                  ['2025-8', 2.36],
                  ['2025-9', 2.1],
                  ['2025-10', 2.72],
                  ['2025-11', 2.3],
                  ['2025-12', 2.2],
                  ['2026-1', 2.35],
                  ['2026-2', 2.4],
                  ['2026-3', 2.475],
                ]),
              },
            ],
            xLabelIndexes: [0, 4, 8, 11],
          },
        },
      ],
    },
    {
      key: 'pipeline',
      label: '川渝管道气综合价格',
      variant: 'stat',
      datasets: [
        {
          title: '2026年2月川渝管道气综合价格',
          date: '发布时间：2026-2-1',
          blocks: [
            {
              color: BLUE,
              rows: [
                [
                  { label: '川渝综合价格', value: '2.29', unit: '元/立方米' },
                  { label: '月环比幅度', value: '-0.35', unit: '%' },
                  { label: '年同比幅度', value: '+0.26', unit: '%' },
                ],
              ],
            },
          ],
          chart: {
            series: [
              {
                color: BLUE,
                points: pts(0, [
                  ['2024-9', 2.28],
                  ['2024-10', 2.28],
                  ['2024-11', 2.28],
                  ['2024-12', 2.28],
                  ['2025-1', 2.28],
                  ['2025-2', 2.28],
                  ['2025-3', 2.28],
                  ['2025-4', 2.26],
                  ['2025-5', 2.24],
                  ['2025-6', 2.232],
                  ['2025-7', 2.235],
                  ['2025-8', 2.25],
                  ['2025-9', 2.29],
                  ['2025-10', 2.31],
                  ['2025-11', 2.33],
                  ['2025-12', 2.36],
                  ['2026-1', 2.29],
                ]),
              },
            ],
            xLabelIndexes: [0, 6, 12, 16],
          },
        },
      ],
    },
    {
      key: 'spot',
      label: '天然气现货价格',
      variant: 'stat',
      datasets: [
        {
          title: '2026年3月天然气现货价格',
          date: '发布时间：2026年3月',
          blocks: [
            {
              color: BLUE,
              rows: [
                [
                  { label: '川渝价格', value: '2.342', unit: '元/立方米' },
                  { label: '环比涨幅', value: '+10.37', unit: '%' },
                  { label: '同比涨幅', value: '-2.90', unit: '%' },
                ],
              ],
            },
            {
              color: ORANGE,
              rows: [
                [
                  { label: '鄂尔多斯价格', value: '2.306', unit: '元/立方米' },
                  { label: '环比涨幅', value: '+9.24', unit: '%' },
                  { label: '同比涨幅', value: '-7.43', unit: '%' },
                ],
              ],
            },
            {
              color: GREEN,
              rows: [
                [
                  { label: '华北价格', value: '2.475', unit: '元/立方米' },
                  { label: '环比涨幅', value: '+5.20', unit: '%' },
                  { label: '同比涨幅', value: '+12.80', unit: '%' },
                ],
              ],
            },
          ],
          chart: {
            series: [
              {
                color: BLUE,
                points: pts(0, [
                  ['2025-4', 2.24],
                  ['2025-5', 2.25],
                  ['2025-6', 2.27],
                  ['2025-7', 2.28],
                  ['2025-8', 2.28],
                  ['2025-9', 2.27],
                  ['2025-10', 2.1],
                  ['2025-11', 2.15],
                  ['2025-12', 2.0],
                  ['2026-1', 2.13],
                  ['2026-2', 2.09],
                  ['2026-3', 2.342],
                ]),
              },
              {
                color: ORANGE,
                points: pts(0, [
                  ['2025-4', 2.3],
                  ['2025-5', 2.33],
                  ['2025-6', 2.36],
                  ['2025-7', 2.3],
                  ['2025-8', 2.25],
                  ['2025-9', 2.2],
                  ['2025-10', 2.52],
                  ['2025-11', 2.4],
                  ['2025-12', 2.15],
                  ['2026-1', 2.09],
                  ['2026-2', 2.2],
                  ['2026-3', 2.306],
                ]),
              },
              {
                color: GREEN,
                points: pts(0, [
                  ['2025-4', 3.05],
                  ['2025-5', 2.7],
                  ['2025-6', 2.85],
                  ['2025-7', 2.35],
                  ['2025-8', 2.36],
                  ['2025-9', 2.1],
                  ['2025-10', 2.72],
                  ['2025-11', 2.3],
                  ['2025-12', 2.2],
                  ['2026-1', 2.35],
                  ['2026-2', 2.4],
                  ['2026-3', 2.475],
                ]),
              },
            ],
            xLabelIndexes: [0, 4, 8, 11],
          },
        },
      ],
    },
    {
      key: 'regional-lng',
      label: '区域LNG厂站价格',
      variant: 'stat',
      periodTabs: ['月价格', '日价格'],
      datasets: [
        {
          title: '2026年6月区域LNG厂站价格',
          date: '发布时间：2026年6月',
          blocks: [
            {
              color: BLUE,
              rows: [
                [
                  { label: '川渝LNG价格', value: '-', unit: '元/吨' },
                  { label: '环比涨跌', value: '-', unit: '元/吨' },
                  { label: '环比幅度', value: '-', unit: '%' },
                  { label: '同比幅度', value: '-', unit: '%' },
                ],
              ],
            },
            {
              color: ORANGE,
              rows: [
                [
                  { label: '西北LNG价格', value: '5721', unit: '元/吨' },
                  { label: '环比涨跌', value: '+133', unit: '元/吨' },
                  { label: '环比幅度', value: '+2.38', unit: '%' },
                  { label: '同比幅度', value: '+47.18', unit: '%' },
                ],
              ],
            },
            {
              color: GREEN,
              rows: [
                [
                  { label: '环渤海LNG价格', value: '6380', unit: '元/吨' },
                  { label: '环比涨跌', value: '-67', unit: '元/吨' },
                  { label: '环比幅度', value: '-1.04', unit: '%' },
                  { label: '同比幅度', value: '+41.46', unit: '%' },
                ],
              ],
            },
          ],
          chart: {
            series: [
              {
                color: BLUE,
                points: pts(0, [
                  ['2026-1', 4300],
                  ['2026-2', 4320],
                  ['2026-3', 4310],
                  ['2026-4', 4305],
                  ['2026-5', 4300],
                  ['2026-6', 4300],
                ]),
              },
              {
                color: ORANGE,
                points: pts(0, [
                  ['2026-1', 4800],
                  ['2026-2', 4950],
                  ['2026-3', 5100],
                  ['2026-4', 5300],
                  ['2026-5', 5500],
                  ['2026-6', 5721],
                ]),
              },
              {
                color: GREEN,
                points: pts(0, [
                  ['2026-1', 5200],
                  ['2026-2', 5400],
                  ['2026-3', 5650],
                  ['2026-4', 5900],
                  ['2026-5', 6150],
                  ['2026-6', 6380],
                ]),
              },
            ],
            xLabelIndexes: [0, 2, 4, 5],
          },
        },
        {
          title: '2026年7月9日区域LNG厂站价格',
          date: '发布时间：2026-07-09',
          blocks: [
            {
              color: BLUE,
              rows: [
                [
                  { label: '川渝LNG价格', value: '4310', unit: '元/吨' },
                  { label: '环比涨跌', value: '+10', unit: '元/吨' },
                  { label: '环比幅度', value: '+0.23', unit: '%' },
                  { label: '同比幅度', value: '+5.10', unit: '%' },
                ],
              ],
            },
            {
              color: ORANGE,
              rows: [
                [
                  { label: '西北LNG价格', value: '5715', unit: '元/吨' },
                  { label: '环比涨跌', value: '+5', unit: '元/吨' },
                  { label: '环比幅度', value: '+0.09', unit: '%' },
                  { label: '同比幅度', value: '+46.80', unit: '%' },
                ],
              ],
            },
            {
              color: GREEN,
              rows: [
                [
                  { label: '环渤海LNG价格', value: '6375', unit: '元/吨' },
                  { label: '环比涨跌', value: '-5', unit: '元/吨' },
                  { label: '环比幅度', value: '-0.08', unit: '%' },
                  { label: '同比幅度', value: '+40.90', unit: '%' },
                ],
              ],
            },
          ],
          chart: {
            series: [
              {
                color: BLUE,
                points: pts(0, [
                  ['2026-7-2', 4290],
                  ['2026-7-3', 4295],
                  ['2026-7-4', 4300],
                  ['2026-7-5', 4298],
                  ['2026-7-6', 4302],
                  ['2026-7-7', 4305],
                  ['2026-7-8', 4300],
                  ['2026-7-9', 4310],
                ]),
              },
              {
                color: ORANGE,
                points: pts(0, [
                  ['2026-7-2', 5600],
                  ['2026-7-3', 5620],
                  ['2026-7-4', 5650],
                  ['2026-7-5', 5680],
                  ['2026-7-6', 5700],
                  ['2026-7-7', 5710],
                  ['2026-7-8', 5715],
                  ['2026-7-9', 5715],
                ]),
              },
              {
                color: GREEN,
                points: pts(0, [
                  ['2026-7-2', 6300],
                  ['2026-7-3', 6320],
                  ['2026-7-4', 6340],
                  ['2026-7-5', 6350],
                  ['2026-7-6', 6360],
                  ['2026-7-7', 6370],
                  ['2026-7-8', 6375],
                  ['2026-7-9', 6375],
                ]),
              },
            ],
            xLabelIndexes: [0, 3, 5, 7],
          },
        },
      ],
    },
  ])
}

/**
 * LNG液厂报价 tab。
 */
export function getPlantQuotes() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/price/plant-quotes' })
  return mockRequest([
    { name: '保德华仑', price: 5310, pct: 1.92, change: 100 },
    { name: '荣鸿盛锐', price: 5360, pct: 1.9, change: 100 },
    { name: '陕西杨凌', price: 5540, pct: 1.84, change: 100 },
    { name: '蒙新能源', price: 5490, pct: 1.67, change: 90 },
    { name: '榆林圆恒', price: 5360, pct: 1.52, change: 80 },
    { name: '新彭楠', price: 5490, pct: 1.48, change: 80 },
    { name: '湖北晋控', price: 5810, pct: 1.4, change: 80 },
    { name: '侯马益通', price: 5270, pct: 1.35, change: 70 },
    { name: '山西阳光', price: 5240, pct: 1.22, change: 60 },
  ])
}

export function getPlantQuotesPage(options = {}) {
  //return request({ url: '/api/client/price', method: 'POST', data, ...options })
  return request({ url: '/api/quote/page', method: 'POST', data: options })
}


// 生成200条模拟数据
/**
 * LNG接收站报价 tab。
 */
export function getStationQuotes() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/price/station-quotes' })
  return mockRequest([
    { name: '国网洋浦中海油', price: 7000, pct: 0, change: 0 },
    { name: '中海油莆田（湖北）', price: 6300, pct: 0, change: 0 },
    { name: '中海油莆田（江西）', price: 6300, pct: 0, change: 0 },
    { name: '广东大鹏', price: 7000, pct: 0, change: 0 },
    { name: '国网迭福中海油', price: 6400, pct: 0, change: 0 },
    { name: '国网粤东中海油（福建）', price: 6300, pct: 0, change: 0 },
    { name: '国网粤东中海油（江西）', price: 6300, pct: 0, change: 0 },
    { name: '国网粤东中海油（湖北）', price: 6300, pct: 0, change: 0 },
    { name: '国网粤东中海油（湖南）', price: 6300, pct: 0, change: 0 },
  ])
}
