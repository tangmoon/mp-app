// 导入系统工具
import system from '@/utils/system.js'

// 获取导航栏高度方法
getNavBarHeight() {
  // 处理状态栏和标题栏的高度适配
  // 返回计算后的高度值（需带上px单位）
}

/**
 * 获取导航栏高度（状态栏 + 标题栏）
 * @returns {number} 导航栏总高度（像素值）
 */
export const getNavBarHeight = () => {
  try {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync()
    
    // 获取状态栏高度
    const statusBarHeight = systemInfo.statusBarHeight || 0
    
    // 根据不同平台计算标题栏高度
    let titleBarHeight = 0
    
    // #ifdef APP-PLUS
    // APP端标题栏高度
    titleBarHeight = 44
    // #endif
    
    // #ifdef MP-WEIXIN
    // 微信小程序标题栏高度
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    titleBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
    // #endif
    
    // #ifdef H5
    // H5端标题栏高度
    titleBarHeight = 44
    // #endif
    
    // 计算总高度
    const navBarHeight = statusBarHeight + titleBarHeight
    
    console.log('导航栏高度计算:', {
      状态栏高度: statusBarHeight,
      标题栏高度: titleBarHeight,
      总高度: navBarHeight,
      平台: systemInfo.platform
    })
    
    return navBarHeight
    
  } catch (error) {
    console.error('获取导航栏高度失败:', error)
    
    // 降级方案：返回默认高度
    const defaultHeight = 88 // iOS默认高度
    
    console.warn('使用默认导航栏高度:', defaultHeight)
    return defaultHeight
  }
}