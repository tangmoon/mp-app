<template>

<view  class="report-panel">
      <view class="period-row">
        <view
          v-for="(p, i) in periods"
          :key="p"
          :class="['period-pill', activePeriod === i && 'period-pill_active']"
          @click="onPeriodChange(i)"
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
        <d-scroll
        v-if="loaded"
        :total="total"
        :skip="size"
        @fetch="fetchData"
        background="transparent"
        refresher-background="transparent"
        >
        <view class="report-item" v-for="(r, i) in list" :key="i" @click="onOpenDetail(r)">
          <text class="report-title">{{ r.title }}</text>
        </view>
      </d-scroll>
      </view>
    </view>
    
</template>


<script setup>
import { getNewsPage} from '../../../api/news'

import { ref, computed, onMounted } from 'vue'

import DScroll from '@dimple-smile/uni-scroll'

const props = defineProps({
  //list: { type: Array, default: () => [] },
  subCategoryId: { type: Number, default: () => 0 },
  keyword: {type: String, default: () => ''}
})

const size = ref(-1)
const total = ref(-1)
const current = ref(1)
const list = ref([])
const loaded = ref(false)

const periods = ['日报', '周报', '月报', '年报', '其他']
const activePeriod = ref(0)
function onPeriodChange(i){
    activePeriod.value = i;
    getPage();
}

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

// 筛选选项
const filterOptions = computed(() => ({
  categoryId: 2,
  subCategoryId: activePeriod.value + 1,
  keyword: props.keyword,
  current: current.value,
}))

function onOpenDetail(n) {
  uni.navigateTo({ url: `/pages/news/detail/detail?id=${n.id}` })
}
// 获取分页数据
const getPage = async (isRefresh = false) => {
  try {
    const res = await getNewsPage(filterOptions.value)
  if (res.code === 200){
    total.value = res.data.totalNum
    if (isRefresh || current.value === 1) {
      list.value = res.data.contentList
    } else {
      list.value = [...list.value, ...res.data.contentList]
    }
    size.value = list.value.length
  }
  } catch (error) {
    console.error('加载列表失败', error)
  } finally {
    loaded.value = true
  }
}

const fetchData = async (e) => {
  console.log("e:" + e)
  const {stop} = e;
  try {
    // 从事件参数中获取当前页码（组件会自动管理）
    // 这里简化处理：如果当前页为1则刷新，否则加载更多
    if (current.value === 1) {
      await getPage(true)
    } else {
      await getPage()
    }
  } finally {
    stop();
  }
}

onMounted(() => {
  getPage();
})

</script>
<style scoped>
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

</style>