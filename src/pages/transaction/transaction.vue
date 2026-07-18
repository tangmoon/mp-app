<template>
  <view class="page">
    <!-- 自定义顶部：长江资讯 + 圆点菜单 -->
    <view class="navbar">
      <text class="navbar-title">长江资讯</text>
      <view class="navbar-right">
        <image class="navbar-icon" :src="iconMore" mode="aspectFit" />
        <view class="navbar-circle">
          <view class="navbar-circle-dot"></view>
        </view>
      </view>
    </view>

    <!-- 搜索行 -->
    <AppSearchBar />

    <!-- 4 个 tab -->
    <SegmentTabs :tabs="tabs" v-model="activeTab" spread />

    <!-- 「成交信息」专属筛选行（TxFilterBar 自带下拉面板与 scrim） -->
    <TxFilterBar
      v-if="activeTab === 3"
      :product-options="filters.productOptions"
      :active-product="activeProduct"
      :province-options="filters.provinceOptions"
      :active-province="activeProvince"
      :range-options="filters.rangeOptions"
      :active-range="activeRange"
      @update:active-product="activeProduct = $event"
      @update:active-province="activeProvince = $event"
      @update:active-range="activeRange = $event"
    />

    <!-- 交易卡片列表 -->
    <view class="tx-list">
      <view v-if="currentTxList.length === 0" class="tx-empty">
        <text class="tx-empty-text">没有匹配的成交记录</text>
      </view>
      <view class="tx-card" v-for="(t, i) in currentTxList" :key="i">
        <view class="tx-head">
          <view class="tx-product">
            <view class="tx-hex">
              <image class="tx-hex-icon" :src="iconLng" mode="aspectFit" />
              <text class="tx-hex-text">LNG</text>
            </view>
            <view class="tx-meta">
              <text class="tx-name">{{ t.product }}</text>
              <text class="tx-date">{{ t.date }}</text>
            </view>
          </view>
        </view>
        <view class="tx-stats">
          <view class="tx-stat">
            <text class="stat-label">成交量</text>
            <view class="stat-value-row">
              <text class="stat-value">{{ t.volume }}</text>
              <text class="stat-unit">吨</text>
            </view>
          </view>
          <view class="tx-stat">
            <text class="stat-label">成交单价</text>
            <view class="stat-value-row">
              <text class="stat-value stat-value_blue">{{ t.price }}</text>
              <text class="stat-unit">元/吨</text>
            </view>
          </view>
          <view class="tx-stat">
            <text class="stat-label">省份</text>
            <view class="stat-value-row">
              <text class="stat-value">{{ t.province }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <AppTabBar :active="2" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSearchBar from '../../components/AppSearchBar.vue'
import SegmentTabs from '../../components/SegmentTabs.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import TxFilterBar from './components/TxFilterBar.vue'
import { svg } from '../../utils/icons'
import { getTransactionFilters, getTransactions } from '../../api/transaction'

const tabs = ['市场动态', '交易公告', '交易快报', '成交信息']
// tag:--mockapi 成交信息是首页点进来的目标 tab，默认激活
const activeTab = ref(3)

const txList = ref([])
const filters = ref({ productOptions: [], provinceOptions: [], rangeOptions: [] })

// 筛选状态（仅「成交信息」tab 生效；其他 tab 展示各自的全量数据）
const activeProduct = ref(0)
const activeProvince = ref(0)
const activeRange = ref(1) // 默认「近30天」

onMounted(async () => {
  const [txs, f] = await Promise.all([getTransactions(), getTransactionFilters()])
  txList.value = txs
  filters.value = f
})

const currentTxList = computed(() => {
  // tag:--mockapi 成交信息 tab 走筛选；其他 tab 不带筛选 UI，但也基于 txList 简单展示
  if (activeTab.value !== 3) {
    // 其他 tab 也按产品 / 省份筛一份简单视图，省得切过去看到原始 mock
    return applyFilters(txList.value)
  }
  return applyFilters(txList.value)
})

function applyFilters(list) {
  const product = filters.value.productOptions[activeProduct.value]
  const province = filters.value.provinceOptions[activeProvince.value]
  const range = filters.value.rangeOptions[activeRange.value]
  return list.filter((t) => {
    if (product && product !== '全部品种' && t.product !== product) return false
    if (province && province !== '全部省份' && t.province !== province) return false
    if (range && !withinRange(t.date, range.days)) return false
    return true
  })
}

function withinRange(dateStr, days) {
  // tag:--mockapi 用今天作为右端；真实接入后端后应该按后端返回的时间窗口判断
  const end = new Date()
  const start = new Date(end.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  const d = new Date(dateStr)
  return d >= start && d <= end
}

// 顶栏右上角圆点（•••）
const iconMore = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
    `<circle cx='12' cy='24' r='3.6' fill='#1a1a1a'/>` +
    `<circle cx='24' cy='24' r='3.6' fill='#1a1a1a'/>` +
    `<circle cx='36' cy='24' r='3.6' fill='#1a1a1a'/>` +
    `</svg>`
)

// 蓝色六边形 LNG 图标
const iconLng = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
    `<defs><linearGradient id='lng' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='#6F8BFF'/><stop offset='1' stop-color='#3B5BE0'/></linearGradient></defs>` +
    `<path d='M24 3 L42 13 L42 35 L24 45 L6 35 L6 13 Z' fill='url(#lng)'/>` +
    `<path d='M15 22h12M15 26h18M15 30h10' stroke='#ffffff' stroke-width='2' stroke-linecap='round'/>` +
    `<circle cx='33' cy='22' r='3' fill='#ffffff'/>` +
    `</svg>`
)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 140rpx;
  box-sizing: border-box;
}

/* —— 自定义顶栏 —— */
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 60rpx 24rpx 12rpx;
  background: #ffffff;
}
.navbar-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}
.navbar-right {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.navbar-icon { width: 36rpx; height: 36rpx; }
.navbar-circle {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar-circle-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #1a1a1a;
}

/* —— 交易卡片 —— */
.tx-list {
  padding: 20rpx 24rpx 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.tx-empty {
  padding: 80rpx 0;
  display: flex;
  justify-content: center;
}
.tx-empty-text {
  font-size: 28rpx;
  color: #9a9da6;
}
.tx-card {
  background: #f4f6fa;
  border-radius: 16rpx;
  padding: 28rpx 28rpx 32rpx;
}
.tx-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.tx-product {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.tx-hex {
  position: relative;
  width: 72rpx;
  height: 72rpx;
  flex-shrink: 0;
}
.tx-hex-icon {
  width: 100%;
  height: 100%;
}
.tx-hex-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 56%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 18rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1rpx;
}
.tx-meta {
  display: flex;
  flex-direction: column;
}
.tx-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a1a;
}
.tx-date {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #8a8d94;
}
.tx-stats {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.tx-stat {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.stat-label {
  font-size: 24rpx;
  color: #8a8d94;
}
.stat-value-row {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}
.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
}
.stat-value_blue {
  color: #2e6bff;
}
.stat-unit {
  font-size: 22rpx;
  color: #8a8d94;
}
</style>