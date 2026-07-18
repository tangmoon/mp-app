<template>
  <view class="page">
    <AppSearchBar />

    <SegmentTabs :tabs="tabs" v-model="activeTab" center />

    <view v-if="loading" class="page-loading">
      <text class="page-loading-text">加载中...</text>
    </view>

    <template v-else>
    <!-- 信息动态 -->
    <view v-if="activeTab === 0" class="feed-list">
      <view class="feed-item" v-for="(n, i) in newsFeed" :key="i" @click="onOpenDetail(n)">
        <text class="feed-title">{{ n.title }}</text>
        <text class="feed-summary">{{ n.summary }}</text>
        <text class="feed-date">{{ n.datetime }}</text>
      </view>
    </view>

    <!-- 资讯报告 -->
    <view v-else-if="activeTab === 1" class="report-panel">
      <view class="period-row">
        <view
          v-for="(p, i) in periods"
          :key="p"
          :class="['period-pill', activePeriod === i && 'period-pill_active']"
          @click="activePeriod = i"
        >
          {{ p }}
        </view>
      </view>

      <picker mode="selector" :range="monthOptions" :value="selectedMonthIndex" @change="onMonthChange">
        <view class="time-filter">
          <text>时间：{{ monthOptions[selectedMonthIndex] }}</text>
          <text class="time-filter-arrow">⌄</text>
        </view>
      </picker>

      <view class="report-list">
        <view class="report-item" v-for="(r, i) in currentReports" :key="i">
          <text class="report-title">{{ r }}</text>
        </view>
      </view>
    </view>

    <!-- 行业政策 -->
    <view v-else class="policy-list">
      <view class="policy-item" v-for="(p, i) in policyList" :key="i">
        <text class="policy-title">{{ p.title }}</text>
        <text class="policy-date">{{ p.date }}</text>
      </view>
    </view>
    </template>

    <LoginBanner />
    <AppTabBar :active="1" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSearchBar from '../../components/AppSearchBar.vue'
import SegmentTabs from '../../components/SegmentTabs.vue'
import LoginBanner from '../../components/LoginBanner.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import { getNewsFeed, getReportsByPeriod, getPolicyList } from '../../api/news'

const tabs = ['信息动态', '资讯报告', '行业政策']
const activeTab = ref(0)
const loading = ref(true)

const newsFeed = ref([])
const reportsByPeriod = ref([])
const policyList = ref([])

onMounted(async () => {
  const [feed, reports, policies] = await Promise.all([getNewsFeed(), getReportsByPeriod(), getPolicyList()])
  newsFeed.value = feed
  reportsByPeriod.value = reports
  policyList.value = policies
  loading.value = false
})

const periods = ['日报', '周报', '月报', '年报', '其他']
const activePeriod = ref(0)

function buildMonthOptions() {
  const now = new Date()
  const options = ['全部']
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    options.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return options
}
const monthOptions = buildMonthOptions()
const selectedMonthIndex = ref(0)

function onMonthChange(e) {
  selectedMonthIndex.value = Number(e.detail.value)
}

const currentReports = computed(() => reportsByPeriod.value[activePeriod.value] || [])

function onOpenDetail(n) {
  uni.navigateTo({ url: `/pages/news/detail/detail?id=${n.id}` })
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

/* 信息动态 */
.feed-list {
  padding: 0 24rpx;
}
.feed-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.feed-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 14rpx;
}
.feed-summary {
  font-size: 26rpx;
  color: #8a8d94;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.feed-date {
  font-size: 24rpx;
  color: #5B7FD6;
}

/* 资讯报告 */
.report-panel {
  padding: 0 24rpx;
}
.period-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
  padding: 8rpx 0 24rpx;
}
.period-pill {
  flex: 1;
  box-sizing: border-box;
  text-align: center;
  padding: 12rpx 0;
  border-radius: 8rpx;
  background: #f4f5f7;
  color: #666;
  font-size: 26rpx;
  border: 1rpx solid transparent;
  white-space: nowrap;
}
.period-pill_active {
  background: #eaf1ff;
  color: #2e6bff;
  font-weight: 600;
  border-color: #2e6bff;
}
.time-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  background: #eef2fb;
  border-radius: 32rpx;
  padding: 16rpx 0;
  color: #5b6b85;
  font-size: 26rpx;
  margin-bottom: 20rpx;
}
.time-filter-arrow {
  color: #8a94a6;
  font-size: 22rpx;
}
.report-list {
  display: flex;
  flex-direction: column;
}
.report-item {
  padding: 26rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.report-title {
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 500;
  line-height: 1.5;
}

/* 行业政策 */
.policy-list {
  padding: 0 24rpx;
}
.policy-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.policy-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 14rpx;
}
.policy-date {
  font-size: 24rpx;
  color: #5B7FD6;
}
</style>