import { mockRequest } from './request'

/**
 * 交易信息页：筛选字典。
 * 品种 / 省份从 mock 数据里聚合而成；日期范围给一组快捷区间，前端按区间截过滤。
 */
const TRANSACTIONS = [
  { product: '液化天然气', date: '2026-07-16', volume: 22, price: 5530, province: '四川' },
  { product: '液化天然气', date: '2026-07-16', volume: 42, price: 5078, province: '陕西' },
  { product: '液化天然气', date: '2026-07-16', volume: 42, price: 5078, province: '陕西' },
  { product: '液化天然气', date: '2026-07-16', volume: 42, price: 5078, province: '陕西' },
  { product: '液化天然气', date: '2026-07-15', volume: 56, price: 5210, province: '新疆' },
  { product: '液化天然气', date: '2026-07-15', volume: 38, price: 4980, province: '内蒙古' },
  { product: '液化天然气', date: '2026-07-14', volume: 120, price: 4860, province: '江苏' },
  { product: '液化天然气', date: '2026-07-14', volume: 86, price: 4920, province: '广东' },
  { product: '液化天然气', date: '2026-07-13', volume: 64, price: 5040, province: '河北' },
  { product: '液化天然气', date: '2026-07-13', volume: 92, price: 4790, province: '山东' },
  { product: '液化天然气', date: '2026-07-12', volume: 18, price: 5620, province: '四川' },
  { product: '液化天然气', date: '2026-07-12', volume: 30, price: 5180, province: '陕西' },
  { product: '液化天然气', date: '2026-07-10', volume: 24, price: 5340, province: '宁夏' },
  { product: '液化天然气', date: '2026-07-08', volume: 50, price: 4880, province: '河南' },
  { product: '液化天然气', date: '2026-07-06', volume: 70, price: 4760, province: '山西' },
]

const PRODUCT_OPTIONS = ['品种', '液化天然气','管道天然气']
const PROVINCE_OPTIONS = ['省份', '北京', '天津', '上海', '重庆',
'港澳台',
'河北', '山西', '内蒙古',
'辽宁', '吉林', '黑龙江',
'江苏', '浙江', '安徽', '福建', '江西', '山东',
'河南', '湖北', '湖南',
'广东', '广西', '海南',
'四川', '贵州', '云南', '西藏',
'陕西', '甘肃', '青海', '宁夏', '新疆']
// tag:--mockapi 日期范围改成后端时间窗口接口会更准；这里用近 N 天的快捷区间兜底
const RANGE_OPTIONS = [
  { key: '7d', label: '近7天', days: 7 },
  { key: '30d', label: '近30天', days: 30 },
  { key: '90d', label: '近90天', days: 90 },
]

export function getTransactionFilters() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/transaction/filters' })
  return mockRequest({
    productOptions: PRODUCT_OPTIONS,
    provinceOptions: PROVINCE_OPTIONS,
    rangeOptions: RANGE_OPTIONS,
  })
}

export function getTransactions() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/transaction/list' })
  return mockRequest(TRANSACTIONS)
}