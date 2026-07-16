import { COLOR_UP, COLOR_DOWN, COLOR_NEUTRAL } from './constants'

/**
 * 根据涨跌数值返回语义色：正数涨（红）、负数跌（绿）、零不变（中性色）。
 */
export function signColor(value) {
  if (value > 0) return COLOR_UP
  if (value < 0) return COLOR_DOWN
  return COLOR_NEUTRAL
}

/**
 * 格式化百分比涨跌幅，如 1.92 -> "+1.92%"，0 -> "0.00%"。
 */
export function signPercent(value) {
  if (value > 0) return `+${value.toFixed(2)}%`
  if (value < 0) return `${value.toFixed(2)}%`
  return '0.00%'
}

/**
 * 格式化涨跌数值，正数补 + 号，0 保持 "0"。
 */
export function signNumber(value) {
  return value > 0 ? `+${value}` : `${value}`
}

export function getNavBarHeight() {
  // 1. 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight;

  // 2. 获取胶囊按钮信息 (小程序专属API)
  // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  const titleBarHeight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
  // #endif

  // 3. 导航栏总高度 = 状态栏高度 + 标题栏高度
  const navBarHeight = statusBarHeight + titleBarHeight;
  return navBarHeight;
}
