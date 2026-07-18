<template>
  <view class="page">
    <view v-if="loading" class="page-loading">
      <text class="page-loading-text">加载中...</text>
    </view>

    <template v-else>
    <view class="fixed-head">
      <AppSearchBar />
      <SegmentTabs :tabs="tabs" v-model="activeTab" spread />

      <IndexFilterBar v-if="activeTab === 0" :options="indexData" v-model="activeIndexIdx" @more="onMoreIndex" />

      <QuoteSearchHeader
        v-else
        :search="searchText"
        :placeholder="activeTab === 1 ? '请输入液厂名称' : '请输入接收站名称'"
        :name-label="activeTab === 1 ? '液厂名称' : '接收站名称'"
        :sort-arrow="sortArrow"
        @search-change="searchText = $event"
        @sort="toggleSort"
      />
    </view>

    <scroll-view class="scroll-body" scroll-y :key="activeTab">
      <!-- 价格与指数：内容 -->
      <view v-if="activeTab === 0" class="index-detail">
        <!-- 变体一：CYLNG 价格指数（标题/日期/统计 同一张卡片，数字比其它变体更大） -->
        <template v-if="currentIndexData.variant === 'legacy'">
          <view class="index-card">
            <text class="index-card-title">{{ currentIndexData.title }}</text>
            <text class="index-card-date">{{ currentIndexData.date }}</text>
            <view class="index-card-stats">
              <view class="stat">
                <text class="stat-label">价格</text>
                <text class="stat-value" :style="{ color: currentIndexData.color }">
                  {{ currentIndexData.price }}<text class="stat-unit"> 元/吨</text>
                </text>
              </view>
              <view class="stat">
                <text class="stat-label">环比涨跌</text>
                <text class="stat-value" :style="{ color: currentIndexData.color }">
                  {{ currentIndexData.changeText }}<text class="stat-unit"> 元/吨</text>
                </text>
              </view>
              <view class="stat">
                <text class="stat-label">环比幅度</text>
                <text class="stat-value" :style="{ color: currentIndexData.color }">
                  {{ currentIndexData.pctText }}<text class="stat-unit"> %</text>
                </text>
              </view>
            </view>
          </view>

          <PriceIndexChart
            :src="chartUri"
            :series="chartSeries"
            :names="chartSeriesNames"
            :unit="chartUnit"
            @view-detail="onViewDetail"
          />
        </template>

        <!-- 变体二/三：分区域卡片 或 共享统计卡片（可能带月度/日度切换），见 StatBlocks -->
        <template v-else>
          <view v-if="currentIndexData.periodTabs" class="index-period-row">
            <view
              v-for="(p, i) in currentIndexData.periodTabs"
              :key="p"
              :class="['index-period-pill', activeIndexPeriod === i && 'index-period-pill_active']"
              @click="activeIndexPeriod = i"
            >
              {{ p }}
            </view>
          </view>

          <text class="detail-title">{{ currentDataset.title }}</text>
          <text class="detail-date">{{ currentDataset.date }}</text>

          <StatBlocks
            :blocks="currentDataset.blocks"
            :variant="currentIndexData.variant === 'cards' ? 'cards' : 'shared'"
          />

          <PriceIndexChart
            :src="chartUri"
            :series="chartSeries"
            :names="chartSeriesNames"
            :unit="chartUnit"
            @view-detail="onViewDetail"
          />
        </template>
      </view>

      <!-- LNG 报价：列表 -->
      <QuoteRows v-else :list="sortedList" @add="onAddQuote" />
    </scroll-view>
    </template>

    <LoginBanner />
    <AppTabBar :active="3" />
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { buildAreaChart, buildLineChart } from '../../utils/chart'
import AppSearchBar from '../../components/AppSearchBar.vue'
import SegmentTabs from '../../components/SegmentTabs.vue'
import LoginBanner from '../../components/LoginBanner.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import IndexFilterBar from './components/IndexFilterBar.vue'
import StatBlocks from './components/StatBlocks.vue'
import PriceIndexChart from './components/PriceIndexChart.vue'
import QuoteSearchHeader from './components/QuoteSearchHeader.vue'
import QuoteRows from './components/QuoteRows.vue'
import { usePriceQuotes } from './composables/usePriceQuotes'
import { getPriceIndexData, getPlantQuotes, getStationQuotes } from '../../api/price'

const tabs = ['价格与指数', 'LNG液厂报价', 'LNG接收站报价']
const activeTab = ref(0)
const loading = ref(true)
const indexData = ref([])
const plantQuotes = ref([])
const stationQuotes = ref([])

onMounted(async () => {
  const [priceIndexData, plants, stations] = await Promise.all([
    getPriceIndexData(),
    getPlantQuotes(),
    getStationQuotes(),
  ])
  indexData.value = priceIndexData
  plantQuotes.value = plants
  stationQuotes.value = stations
  loading.value = false
})

const activeIndexIdx = ref(0)
const activeIndexPeriod = ref(0)
watch(activeIndexIdx, () => {
  activeIndexPeriod.value = 0
})

const currentIndexData = computed(() => indexData.value[activeIndexIdx.value])
const currentDataset = computed(() => {
  const d = currentIndexData.value
  if (d.variant === 'legacy') return null
  const idx = d.periodTabs ? activeIndexPeriod.value : 0
  return d.datasets[idx]
})

const chartUri = computed(() => {
  const d = currentIndexData.value
  if (d.variant === 'legacy') return buildAreaChart(d.points, d.xLabelIndexes)
  const ds = currentDataset.value
  if (!ds || !ds.chart) return ''
  return ds.chart.series.length > 1
    ? buildLineChart(ds.chart.series, ds.chart.xLabelIndexes)
    : buildAreaChart(ds.chart.series[0].points, ds.chart.xLabelIndexes)
})

// Raw series data behind chartUri, kept in parallel so PriceIndexChart can hit-test
// taps against the exact same points used to draw the SVG (see computeChartLayout).
const chartSeries = computed(() => {
  const d = currentIndexData.value
  if (d.variant === 'legacy') return [{ color: '#2E6BFF', points: d.points }]
  const ds = currentDataset.value
  if (!ds || !ds.chart) return []
  return ds.chart.series
})

// Series names/unit are derived from the accompanying StatBlocks rows, whose order
// matches chart.series 1:1 in this data model (see indexData above).
const chartSeriesNames = computed(() => {
  const d = currentIndexData.value
  if (d.variant === 'legacy') return [d.label]
  const ds = currentDataset.value
  if (!ds || !ds.blocks) return []
  return ds.blocks.map((b) => b.rows?.[0]?.[0]?.label || '')
})

const chartUnit = computed(() => {
  const d = currentIndexData.value
  if (d.variant === 'legacy') return '元/吨'
  const ds = currentDataset.value
  return ds?.blocks?.[0]?.rows?.[0]?.[0]?.unit || ''
})

const chartTitle = computed(() => {
  const d = currentIndexData.value
  return d.variant === 'legacy' ? d.title : currentDataset.value?.title || ''
})
const chartDate = computed(() => {
  const d = currentIndexData.value
  return d.variant === 'legacy' ? d.date : currentDataset.value?.date || ''
})

function onMoreIndex() {
  uni.showToast({ title: '更多价格指数', icon: 'none' })
}
function onViewDetail() {
  const payload = {
    title: chartTitle.value,
    date: chartDate.value,
    unit: chartUnit.value,
    names: chartSeriesNames.value,
    series: chartSeries.value,
  }
  uni.navigateTo({
    url: `/pages/price/detail/detail?payload=${encodeURIComponent(JSON.stringify(payload))}`,
  })
}

const rawList = computed(() => (activeTab.value === 1 ? plantQuotes.value : stationQuotes.value))
const { searchText, sortedList, toggleSort, sortArrow } = usePriceQuotes(rawList)

function onAddQuote(item) {
  uni.showToast({ title: `已添加：${item.name}`, icon: 'none' })
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  box-sizing: border-box;
}
.page-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-loading-text {
  font-size: 28rpx;
  color: #9a9da6;
}
.fixed-head {
  flex-shrink: 0;
}
.scroll-body {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  padding-bottom: 320rpx;
}

/* 价格与指数：内容（通用） */
.index-detail {
  padding: 0 24rpx;
}
.detail-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
}
.detail-date {
  display: block;
  margin-top: 14rpx;
  margin-bottom: 24rpx;
  font-size: 26rpx;
  color: #8a8d94;
}

/* 变体一：legacy 卡片（CYLNG），标题/日期/统计同框，数字比其它变体更大 */
.index-card {
  background: #f2f6fd;
  border-radius: 16rpx;
  padding: 28rpx;
  box-sizing: border-box;
}
.index-card-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #16305c;
}
.index-card-date {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #4a6fb5;
  background: #e3ecfb;
  border-radius: 6rpx;
  padding: 4rpx 12rpx;
  align-self: flex-start;
}
.index-card-stats {
  display: flex;
  margin-top: 28rpx;
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.stat-label {
  font-size: 24rpx;
  color: #8a8d94;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-value {
  font-size: 34rpx;
  font-weight: 700;
}
.stat-unit {
  font-size: 22rpx;
  font-weight: 400;
  margin-left: 4rpx;
}

/* 月度/日度切换（仅“区域LNG厂站价格”使用） */
.index-period-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.index-period-pill {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  background: #f4f5f7;
  color: #666;
  font-size: 26rpx;
  border: 1rpx solid transparent;
}
.index-period-pill_active {
  background: #eaf1ff;
  color: #2e6bff;
  font-weight: 600;
  border-color: #2e6bff;
}
</style>
