<template>
  <view class="page">
    <!-- 搜索区 -->
    <view class="search-row">
      <image class="avatar" :src="icons.avatar" mode="aspectFit" />
      <view class="search-box">
        <image class="search-icon" :src="icons.search" mode="aspectFit" />
        <input class="search-input" placeholder="输入关键字" placeholder-class="search-placeholder" />
        <text class="divider">|</text>
        <text class="search-btn">搜索</text>
      </view>
      <view class="ai-btn">AI</view>
    </view>

    <!-- 分类 Tab -->
    <view class="tabs">
      <view
        v-for="(tab, i) in tabs"
        :key="tab"
        class="tab-item"
        @click="activeTab = i"
      >
        <text :class="['tab-text', activeTab === i && 'tab-text_active']">{{ tab }}</text>
        <view :class="['tab-underline', activeTab === i && 'tab-underline_active']" />
      </view>
    </view>

    <!-- 轮播 Banner -->
    <view class="banner-area">
      <view class="banner-wrap">
        <swiper
          class="banner-swiper"
          :autoplay="true"
          :interval="4000"
          :duration="400"
          circular
          @change="onBannerChange"
        >
          <swiper-item v-for="(b, i) in banners" :key="i">
            <view class="banner-slide" :style="{ background: b.bg }">
              <text class="banner-title">{{ b.title }}</text>
            </view>
          </swiper-item>
        </swiper>

        <view class="banner-dots">
          <view
            v-for="(b, i) in banners"
            :key="i"
            :class="['dot', currentBanner === i && 'dot_active']"
          />
        </view>

        <view class="banner-caption">
          <text class="banner-caption-text">{{ banners[currentBanner].title }}</text>
        </view>
      </view>

      <!-- 上下自动翻滚的公告牌 -->
      <view class="peek-card">
        <swiper
          class="peek-swiper"
          vertical
          circular
          :autoplay="true"
          :interval="2600"
          :duration="500"
        >
          <swiper-item v-for="(p, i) in peekItems" :key="i" class="peek-swiper-item">
            <text class="peek-title">{{ p.title }}</text>
            <text class="peek-date">{{ p.date }}</text>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 资讯列表 -->
    <view class="news-list">
      <view class="news-item" v-for="(n, i) in filteredNews" :key="i">
        <view class="news-header">
          <text class="tag" :style="{ background: n.tagColor }">{{ n.tag }}</text>
          <text class="news-title">{{ n.title }}</text>
        </view>
        <view class="news-footer">
          <text class="news-date">{{ n.date }}</text>
          <text class="news-more" @click="onMoreTap(n)">查看更多 ></text>
        </view>
      </view>
    </view>

    <!-- 商品指数 -->
    <view class="index-section">
      <text class="section-title">商品指数</text>
      <scroll-view
        class="index-scroll"
        v-for="(row, r) in indexRows"
        :key="r"
        scroll-x
        :show-scrollbar="false"
        enhanced
      >
        <view class="index-row">
          <view class="index-card" v-for="(item, i) in row" :key="i">
            <text class="index-date">{{ item.date }}</text>
            <text class="index-name">{{ item.name }}</text>
            <text class="index-value" :style="{ color: item.color }">{{ item.value }}</text>
            <text class="index-change" :style="{ color: item.color }">{{ item.change }} {{ item.pct }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 自选 -->
    <view class="favorite-section">
      <view class="favorite-tabs">
        <text
          v-for="(t, i) in favoriteTabs"
          :key="t"
          :class="['favorite-tab', activeFavoriteTab === i && 'favorite-tab_active']"
          @click="activeFavoriteTab = i"
        >
          {{ t }}
        </text>
      </view>
      <view class="favorite-empty" @click="onAddFavorite">
        <image class="favorite-add-icon" :src="icons.add" mode="aspectFit" />
        <text class="favorite-empty-text">暂无自选，点击添加</text>
      </view>
    </view>

    <!-- 页脚 -->
    <view class="footer">
      <text class="footer-line">重庆能源大数据中心有限公司　版权所有</text>
      <text class="footer-line">主办单位：重庆能源大数据中心有限公司</text>
      <text class="footer-line">合作单位：山东清能咨询服务有限公司</text>
      <text class="footer-line">联系电话：023-62898061</text>
    </view>

    <!-- 登录提示条 -->
    <view class="login-banner">
      <text class="login-text">请点击登录，以便为您提供更好的服务</text>
      <view class="login-btn" @click="onLogin">点击登录</view>
    </view>

    <!-- 底部 TabBar -->
    <view class="tabbar">
      <view
        v-for="(t, i) in tabbarItems"
        :key="t.label"
        class="tabbar-item"
        @click="activeTabbar = i"
      >
        <image class="tabbar-icon" :src="tabIcon(t.icon, activeTabbar === i)" mode="aspectFit" />
        <text :class="['tabbar-label', activeTabbar === i && 'tabbar-label_active']">{{ t.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const ACCENT = '#2E6BFF'
const GREY = '#9A9DA6'

function svg(markup) {
  return `data:image/svg+xml,${encodeURIComponent(markup)}`
}

const icons = {
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
}

function tabIcon(name, active) {
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

const tabs = ['市场动态', '交易公告', '交易快报', '成交信息']
const activeTab = ref(0)

const banners = [
  { title: '关于征求国家管网集团创新服务产品意见及建议的公告', bg: '#3B4AA8' },
  { title: '长江资讯服务全面升级，助力企业高效决策', bg: '#2F5FA8' },
  { title: '液化天然气行业动态一览', bg: '#4A3E9E' },
]
const currentBanner = ref(0)
function onBannerChange(e) {
  currentBanner.value = e.detail.current
}

const peekItems = [
  { title: '地缘冲突搅动全球能源上游市场', date: '7/2 15:35' },
  { title: '国内液化天然气到岸价小幅上涨', date: '7/3 09:12' },
  { title: '长江资讯上线智能问答助手，服务全面升级', date: '7/4 16:40' },
]

const TAG_BLUE = '#2E6BFF'
const TAG_ORANGE = '#FF9F40'

const newsList = [
  {
    tag: '交易公告',
    tagColor: TAG_BLUE,
    title:
      '关于开展中国石油化工股份有限公司天然气分公司蒙陕天然气销售中心液化天然气（零散气）竞价交易的公告',
    date: '2026-07-08',
  },
  {
    tag: '交易快报',
    tagColor: TAG_BLUE,
    title: '中晟国金LPG贸易20260708',
    date: '2026-07-08',
  },
  {
    tag: '资讯报告',
    tagColor: TAG_ORANGE,
    title: '全国液化天然气市场日报（20260623）',
    date: '2026-06-23',
  },
  {
    tag: '天然气价格',
    tagColor: TAG_ORANGE,
    title: '川渝液化天然气价格【CYLNG价格】',
    date: '2026-07-08',
  },
  {
    tag: '交易公告',
    tagColor: TAG_BLUE,
    title: '商品化天然气交易中心关于近期市场交易安排的通知',
    date: '2026-07-07',
  },
]

const filteredNews = computed(() => {
  if (activeTab.value === 0) return newsList
  const tagName = tabs[activeTab.value]
  return newsList.filter((n) => n.tag === tagName)
})

function onMoreTap(n) {
  uni.showToast({ title: `查看：${n.tag}`, icon: 'none' })
}

function onLogin() {
  uni.showToast({ title: '前往登录', icon: 'none' })
}

const RED = '#E4392B'
const GREEN = '#1B9E5A'

const indexRows = [
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
]

const favoriteTabs = ['LNG液厂自选', '接收站自选']
const activeFavoriteTab = ref(0)

function onAddFavorite() {
  uni.showToast({ title: '添加自选', icon: 'none' })
}

const activeTabbar = ref(0)
const tabbarItems = [
  { label: '首页', icon: 'home' },
  { label: '资讯', icon: 'doc' },
  { label: '交易', icon: 'exchange' },
  { label: '价格', icon: 'price' },
  { label: '询价', icon: 'inquiry' },
  { label: '地图', icon: 'map' },
]
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 210rpx;
  box-sizing: border-box;
}

/* 搜索区 */
.search-row {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}
.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.search-box {
  flex: 1;
  height: 72rpx;
  background: #f4f5f7;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.search-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.search-placeholder {
  color: #a9acb4;
}
.divider {
  color: #dcdee3;
  font-size: 26rpx;
  margin: 0 16rpx;
}
.search-btn {
  color: #6b7078;
  font-size: 28rpx;
  flex-shrink: 0;
}
.ai-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6f8bff, #2e4fe0);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Tabs */
.tabs {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx 24rpx;
  gap: 48rpx;
}
.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab-text {
  font-size: 30rpx;
  color: #666;
  font-weight: 400;
}
.tab-text_active {
  color: #1a1a1a;
  font-weight: 700;
}
.tab-underline {
  margin-top: 12rpx;
  width: 40rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background: transparent;
}
.tab-underline_active {
  background: #2e6bff;
}

/* Banner */
.banner-area {
  position: relative;
  padding: 0 24rpx;
}
.peek-card {
  margin-top: 20rpx;
  height: 76rpx;
  background: #eef2fb;
  border-radius: 12rpx;
  overflow: hidden;
}
.peek-swiper {
  width: 100%;
  height: 100%;
}
.peek-swiper-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.peek-title {
  font-size: 26rpx;
  color: #6b7078;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 16rpx;
}
.peek-date {
  font-size: 24rpx;
  color: #9a9da6;
  flex-shrink: 0;
}
.banner-wrap {
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
}
.banner-swiper {
  width: 100%;
  height: 320rpx;
}
.banner-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 40rpx;
  box-sizing: border-box;
}
.banner-title {
  color: #ffffff;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.6;
}
.banner-dots {
  position: absolute;
  top: 20rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10rpx;
}
.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 5rpx;
  background: rgba(255, 255, 255, 0.5);
}
.dot_active {
  width: 26rpx;
  background: #ffffff;
}
.banner-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 68rpx;
  background: rgba(15, 20, 45, 0.55);
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.banner-caption-text {
  color: #ffffff;
  font-size: 26rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* 资讯列表 */
.news-list {
  margin-top: 20rpx;
  padding: 0 24rpx;
}
.news-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.news-header {
  overflow: hidden;
  max-height: 92rpx;
}
.tag {
  float: left;
  color: #ffffff;
  font-size: 22rpx;
  padding: 4rpx 14rpx;
  border-radius: 6rpx;
  margin-right: 12rpx;
  margin-top: 4rpx;
}
.news-title {
  display: block;
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
  line-height: 1.5;
}
.news-footer {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.news-date {
  font-size: 24rpx;
  color: #9a9da6;
}
.news-more {
  font-size: 24rpx;
  color: #2e6bff;
}

/* 商品指数 */
.index-section {
  margin-top: 36rpx;
}
.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
  padding: 0 24rpx 20rpx;
}
.index-scroll {
  width: 100%;
  white-space: nowrap;
}
.index-scroll:not(:last-child) {
  margin-bottom: 20rpx;
}
.index-row {
  display: flex;
  padding: 0 24rpx;
  gap: 20rpx;
}
.index-card {
  flex-shrink: 0;
  width: 220rpx;
  box-sizing: border-box;
  background: #ffffff;
  border: 1rpx solid #ebedf2;
  border-radius: 12rpx;
  padding: 18rpx;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4rpx 12rpx rgba(20, 30, 60, 0.04);
}
.index-date {
  font-size: 20rpx;
  color: #9a9da6;
}
.index-name {
  font-size: 28rpx;
  color: #1a1a1a;
  font-weight: 600;
  margin: 10rpx 0;
}
.index-value {
  font-size: 36rpx;
  font-weight: 700;
}
.index-change {
  margin-top: 8rpx;
  font-size: 22rpx;
}

/* 自选 */
.favorite-section {
  margin-top: 44rpx;
  padding: 0 24rpx;
}
.favorite-tabs {
  display: flex;
  align-items: center;
  gap: 40rpx;
}
.favorite-tab {
  font-size: 30rpx;
  color: #9a9da6;
}
.favorite-tab_active {
  color: #2e6bff;
  font-weight: 700;
}
.favorite-empty {
  margin-top: 24rpx;
  background: #f6f7fa;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64rpx 0;
}
.favorite-add-icon {
  width: 64rpx;
  height: 64rpx;
}
.favorite-empty-text {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #9a9da6;
}

/* 页脚 */
.footer {
  margin-top: 48rpx;
  padding: 0 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.footer-line {
  font-size: 22rpx;
  color: #b7b9c0;
  line-height: 1.9;
}

/* 登录提示条 */
.login-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 100rpx;
  height: 96rpx;
  background: #eaf1ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-sizing: border-box;
  z-index: 5;
}
.login-text {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  margin-right: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.login-btn {
  flex-shrink: 0;
  background: #2e6bff;
  color: #ffffff;
  font-size: 26rpx;
  padding: 12rpx 28rpx;
  border-radius: 30rpx;
}

/* TabBar */
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 1rpx solid #eeeeee;
  display: flex;
  z-index: 6;
}
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}
.tabbar-icon {
  width: 44rpx;
  height: 44rpx;
}
.tabbar-label {
  font-size: 20rpx;
  color: #9a9da6;
}
.tabbar-label_active {
  color: #2e6bff;
}
</style>
