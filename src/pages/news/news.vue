<template>
  <view class="page">
    <AppSearchBar />

    <SegmentTabs :tabs="tabs" v-model="activeTab" center />

    <view v-if="loading" class="page-loading">
      <text class="page-loading-text">加载中...</text>
    </view>

    <template v-else>
    <!-- 信息动态 -->
    <FeedRow v-if="activeTab === 0" />
    <!-- <view v-if="activeTab === 0" class="feed-list">
      <d-scroll
        :total="total"
        :skip="skip"
        @fetch="fetchFeed"
      >
        <view class="feed-item" v-for="(n, i) in newsFeed" :key="i" @click="onOpenDetail(n)">
        <text class="feed-title">{{ n.title }}</text>
        <text class="feed-summary">{{ n.summary }}</text>
        <text class="feed-date">{{ n.datetime }}</text>
      </view>
      </d-scroll> 
      
    </view>-->
    <ReportRow v-else-if="activeTab === 1" />
    <!-- 资讯报告 -->
    <!-- <view v-else-if="activeTab === 1" class="report-panel">
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
      
      </view>
    </view> -->
 
    <!-- 行业政策 -->
    <PolicyRow  v-else />
    
    </template>

    <LoginBanner />
    <AppTabBar :active="1" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppSearchBar from '../../components/AppSearchBar.vue'
import SegmentTabs from '../../components/SegmentTabs.vue'
import LoginBanner from '../../components/LoginBanner.vue'
import AppTabBar from '../../components/AppTabBar.vue'

import FeedRow from './components/FeedRow.vue'
import ReportRow from './components/ReportRow.vue'
import PolicyRow from './components/PolicyRow.vue'


const tabs = ['信息动态', '资讯报告', '行业政策']
const activeTab = ref(0)
const loading = ref(true)


onMounted(async () => {
  loading.value = false
})

onLoad((options) => {
  activeTab.value = Number(options.activeTab) || 0
  console.log('activeTab:' + activeTab.value)
})
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
</style>
