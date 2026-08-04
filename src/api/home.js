import { mockRequest , request} from './request'
import { COLOR_UP, COLOR_DOWN } from '../utils/constants'

/**
 * 首页顶部轮播 + 下方自动翻滚的公告条。
 */
export function getHomeBanners() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/home/banners' })
  return mockRequest({
    banners: [
      { title: '关于征求国家管网集团创新服务产品意见及建议的公告', bg: '#3B4AA8' },
      { title: '长江资讯服务全面升级，助力企业高效决策', bg: '#2F5FA8' },
      { title: '液化天然气行业动态一览', bg: '#4A3E9E' },
    ],
    peekItems: [
      { title: '地缘冲突搅动全球能源上游市场', date: '7/2 15:35' },
      { title: '国内液化天然气到岸价小幅上涨', date: '7/3 09:12' },
      { title: '长江资讯上线智能问答助手，服务全面升级', date: '7/4 16:40' },
    ],
  })
}


export function getHomeNews(){
  return request({ url: '/api/home/news', method: 'GET'})
}
/**
 * 首页资讯列表（市场动态/交易公告/交易快报/成交信息 共用同一份列表，靠 tag 过滤）。
 */
export function getHomeNewsFeed() {
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/home/news-feed' })
  return mockRequest([
    {
      tag: '交易公告',
      type: '1',
      tagColor: '#2E6BFF',
      title:
        '关于开展中国石油化工股份有限公司天然气分公司蒙陕天然气销售中心液化天然气（零散气）竞价交易的公告',
      date: '2026-07-08',
    },
    {
      tag: '交易快报',
      type: '2',
      tagColor: '#2E6BFF',
      title: '中晟国金LPG贸易20260708',
      date: '2026-07-08',
    },
    {
      tag: '资讯报告',
      type: '3',
      tagColor: '#FF9F40',
      title: '全国液化天然气市场日报（20260623）',
      date: '2026-06-23',
    },
    {
      tag: '天然气价格',
      type: '4',
      tagColor: '#FF9F40',
      title: '川渝液化天然气价格【CYLNG价格】',
      date: '2026-07-08',
    },
    
  ])
}

/**
 * 首页"商品指数"两行横向卡片。
 */
export function getMarketIndices() {
  const RED = COLOR_UP
  const GREEN = COLOR_DOWN
  // tag:--mockapi 替换为真实接口，例如：return request({ url: '/home/market-indices' })
  return mockRequest([
    [
      { date: '2026-07-08', name: 'CYLNG', value: '5469', change: '+3', pct: '+0.05%', color: RED },
      { date: '2026-07-08', name: '上期原油', value: '467.20', change: '+27.8', pct: '+6.33%', color: RED },
      { date: '2026-07-08', name: '美元兑人民币', value: '6.8077', change: '+0.0023', pct: '+0.03%', color: RED },
      { date: '2026-07-08', name: '欧元兑人民币', value: '7.7688', change: '-0.0142', pct: '-0.18%', color: GREEN },
      { date: '2026-07-08', name: '人民币兑日元', value: '20.635', change: '+0.082', pct: '+0.40%', color: RED },
      { date: '2026-07-08', name: '甲醇期货', value: '2456', change: '-12', pct: '-0.49%', color: GREEN },
    ],
    [
      { date: '2026-07-07', name: 'WTI', value: '72.41', change: '+3.86', pct: '+5.63%', color: RED },
      { date: '2026-07-07', name: 'Brent', value: '74.16', change: '+2.17', pct: '+3.01%', color: RED },
      { date: '2026-07-07', name: 'JKM', value: '16.175', change: '+0.11', pct: '+0.68%', color: RED },
      { date: '2026-07-07', name: 'TTF', value: '14.7', change: '-0.025', pct: '-0.17%', color: GREEN },
      { date: '2026-07-07', name: 'NBP', value: '82.35', change: '-0.62', pct: '-0.75%', color: GREEN },
      { date: '2026-07-07', name: '华东LNG到岸价', value: '4520', change: '+35', pct: '+0.78%', color: RED },
    ],
  ])
}

export function getSelfMerk(type) {
  return mockRequest(
    [
      { name: '保德华仑', price: 5310, pct: 1.92, change: 100 },
    { name: '荣鸿盛锐', price: 5360, pct: 1.9, change: 100 },
    { name: '陕西杨凌', price: 5540, pct: 1.84, change: 100 },
    { name: '蒙新能源', price: 5490, pct: 1.67, change: 90 },
    { name: '榆林圆恒', price: 5360, pct: 1.52, change: 80 },
    { name: '新彭楠', price: 5490, pct: 1.48, change: 80 },
    { name: '湖北晋控', price: 5810, pct: 1.4, change: 80 },
    { name: '侯马益通', price: 5270, pct: 1.35, change: 70 },
    { name: '山西阳光', price: 5240, pct: 1.22, change: 60 },
    ]
  );
}

