import { mockRequest } from './request'

/**
 * 询价筛选项：买/卖方向 + 品种分类。真实接口接入后，品种分类大概率是需要维护的
 * 后台字典数据，不再是前端硬编码的固定列表。
 */
export function getInquiryFilters() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/inquiry/filters' })
  return mockRequest({
    sideOptions: ['买', '卖'],
    categoryOptions: ['全部品种', '管道天然气', 'LNG', '硫磺', '汽油', '柴油'],
  })
}
