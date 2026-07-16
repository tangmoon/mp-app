<template>
  <view class="page">
    <AppSearchBar />

    <SegmentTabs :tabs="tabs" v-model="activeTab" spread />

    <view v-if="loading" class="page-loading">
      <text class="page-loading-text">加载中...</text>
    </view>

    <template v-if="activeTab === 0">
    <BannerCarousel :banners="banners" :peek-items="peekItems" />

    <!-- 资讯列表 -->
    <view class="news-list">
      <view class="news-item" v-for="(n, i) in filteredNews" :key="i">
        <view class="news-header">
          <text class="tag" :style="{ background: n.tagColor }">{{ n.tag }}</text>
          <text class="news-title">{{ n.title }}</text>
        </view>
        <view class="news-footer">
          <text class="news-date">{{ n.date }}</text>
          <text class="news-more" v-if="i < 2" @click="onMoreTap(i)">查看更多 ></text>
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
        <view>
          <image class="favorite-add-icon" :src="icons.add" mode="aspectFit" />
        </view>
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
    </template>

    <!-- 交易公告 -->
    <scroll-view v-if="activeTab === 1" class="scroll-body" scroll-y :key="1">
      <!-- 资讯列表 -->
      <view class="news-list">
        <view class="news-item" v-for="(n, i) in filteredNews" :key="i">
          <view class="news-header">
            
            <text class="news-title">{{ n.title }}</text>
          </view>
          <view class="news-footer">
            <text class="news-date">{{ n.date }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 交易公告 -->
    <scroll-view v-if="activeTab === 2" class="scroll-body" scroll-y :key="2">
      <!-- 资讯列表 -->
      <view class="news-list">
        <view class="news-item" v-for="(n, i) in filteredNews" :key="i">
          <view class="news-header">
            <text class="tag" :style="{ background: n.tagColor }">{{ n.tag }}</text>
            <text class="news-title">{{ n.title }}</text>
          </view>
          <view class="news-footer">
            <text class="news-date">{{ n.date }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 成交信息 -->
    <scroll-view v-if="activeTab === 3" class="scroll-body" scroll-y :key="3">
      <!-- 资讯列表 -->
      
    </scroll-view>

    <LoginBanner />
    <AppTabBar :active="0" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { icons } from '../../utils/icons'
import AppSearchBar from '../../components/AppSearchBar.vue'
import SegmentTabs from '../../components/SegmentTabs.vue'
import LoginBanner from '../../components/LoginBanner.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import BannerCarousel from './components/BannerCarousel.vue'
import { getHomeBanners, getHomeNewsFeed, getMarketIndices } from '../../api/home'

const tabs = ['市场动态', '交易公告', '交易快报', '成交信息']
const activeTab = ref(0)
const loading = ref(true)

const banners = ref([])
const peekItems = ref([])
const newsList = ref([])
const indexRows = ref([])

onMounted(async () => {
  const [homeBanners, feed, indices] = await Promise.all([getHomeBanners(), getHomeNewsFeed(), getMarketIndices()])
  banners.value = homeBanners.banners
  peekItems.value = homeBanners.peekItems
  newsList.value = feed
  indexRows.value = indices
  loading.value = false
})

const filteredNews = computed(() => {
  if (activeTab.value === 0) return newsList.value
  const tagName = tabs[activeTab.value]
  return newsList.value.filter((n) => n.tag === tagName)
})

function onMoreTap(i) {
  //uni.showToast({ title: `查看：${n.tag}`, icon: 'none' })
  activeTab.value = i + 1
}
// 公告跳转
function toPath(i) {

}

function onOpenDetail(id) {
  uni.navigateTo({ url: `/pages/news/detail/detail?id=${id}` })
}

const favoriteTabs = ['LNG液厂自选', '接收站自选']
const activeFavoriteTab = ref(0)

function onAddFavorite() {
  uni.showToast({ title: '添加自选', icon: 'none' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 210rpx;
  box-sizing: border-box;
}
.page-loading {
  padding-top: 200rpx;
  display: flex;
  justify-content: center;
}
.page-loading-text {
  font-size: 28rpx;
  color: #9a9da6;
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


.scroll-body {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  padding-bottom: 320rpx;
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
</style>
