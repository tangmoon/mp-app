<template>
  <view class="detail-page">
    <view class="detail-header">
      <text class="detail-header-title">{{ payload.title }}</text>
      <text class="detail-header-date">{{ payload.date }}</text>
    </view>

    <view v-if="payload.series.length > 1" class="detail-legend">
      <view v-for="(s, i) in payload.series" :key="i" class="detail-legend-item">
        <view class="detail-legend-dot" :style="{ background: s.color }" />
        <text class="detail-legend-name">{{ payload.names[i] || `系列${i + 1}` }}</text>
      </view>
    </view>

    <scroll-view class="chart-scroll" scroll-x>
      <view class="chart-image-wrap" @touchstart="onTap" @click="onTap">
        <image v-if="chartUri" class="chart-image" :src="chartUri" mode="heightFix" />

        <template v-if="tooltip">
          <view class="chart-guideline" :style="{ left: tooltip.pointXPct + '%' }" />
          <view
            v-for="(row, i) in tooltip.rows"
            :key="i"
            class="chart-point-dot"
            :style="{ left: tooltip.pointXPct + '%', top: row.yPct + '%', background: row.color }"
          />
          <view
            class="chart-tooltip-box"
            :style="{ left: tooltip.boxLeftPx + 'px', top: tooltip.boxTopPx + 'px' }"
            @click.stop="closeTooltip"
          >
            <text class="chart-tooltip-date">{{ tooltip.date }}</text>
            <view v-for="(row, i) in tooltip.rows" :key="i" class="chart-tooltip-row">
              <view class="chart-tooltip-dot" :style="{ background: row.color }" />
              <text v-if="row.name" class="chart-tooltip-name">{{ row.name }}</text>
              <text class="chart-tooltip-value" :style="{ color: row.color }">
                {{ row.value }}{{ payload.unit ? ' ' + payload.unit : '' }}
              </text>
            </view>
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { buildAreaChart, buildLineChart } from '../../../utils/chart'
import { useChartTooltip } from '../composables/useChartTooltip'

const payload = ref({ title: '', date: '', unit: '', names: [], series: [] })

onLoad((query) => {
  try {
    payload.value = JSON.parse(decodeURIComponent(query.payload || ''))
  } catch (e) {
    payload.value = { title: '', date: '', unit: '', names: [], series: [] }
  }
  if (payload.value.title) {
    uni.setNavigationBarTitle({ title: payload.value.title })
  }
})

// Elongate the x-axis instead of cramming points into the compact home-page width -
// wide enough per point for every date label to render without overlapping its
// neighbors, with a floor matching the home chart. Overflow scrolls (see .chart-scroll).
const chartWidth = computed(() => Math.max(700, (payload.value.series[0]?.points.length || 0) * 170))
const allLabelIndexes = computed(() => (payload.value.series[0]?.points || []).map((_, i) => i))

const chartUri = computed(() => {
  const s = payload.value.series
  if (!s.length) return ''
  return s.length > 1
    ? buildLineChart(s, allLabelIndexes.value, chartWidth.value)
    : buildAreaChart(s[0].points, allLabelIndexes.value, chartWidth.value)
})

const { tooltip, onTap, closeTooltip } = useChartTooltip({
  series: computed(() => payload.value.series),
  names: computed(() => payload.value.names),
  width: chartWidth,
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24rpx 32rpx;
  background: #ffffff;
}
.detail-header-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
}
.detail-header-date {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #8a8d94;
}
.detail-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 32rpx;
  margin-top: 20rpx;
}
.detail-legend-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.detail-legend-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.detail-legend-name {
  font-size: 24rpx;
  color: #666666;
}
.chart-scroll {
  margin-top: 24rpx;
  width: 100%;
  white-space: nowrap;
}
.chart-image-wrap {
  position: relative;
  display: inline-block;
  vertical-align: top;
}
.chart-image {
  height: 480rpx;
  display: block;
}
.chart-guideline {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 2rpx dashed #c3c6cc;
  transform: translateX(-50%);
  pointer-events: none;
}
.chart-point-dot {
  position: absolute;
  width: 14rpx;
  height: 14rpx;
  margin-left: -7rpx;
  margin-top: -7rpx;
  border-radius: 50%;
  border: 3rpx solid #ffffff;
  box-shadow: 0 0 0 2rpx rgba(0, 0, 0, 0.08);
  pointer-events: none;
  z-index: 2;
}
.chart-tooltip-box {
  position: fixed;
  transform: translate(-50%, -100%);
  margin-top: -16px;
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 1rpx solid #e3e8f2;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 20rpx rgba(20, 30, 60, 0.14);
  white-space: nowrap;
  z-index: 3;
}
.chart-tooltip-date {
  display: block;
  margin-bottom: 8rpx;
  font-size: 22rpx;
  color: #8a8d94;
  white-space: nowrap;
}
.chart-tooltip-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.chart-tooltip-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.chart-tooltip-name {
  font-size: 22rpx;
  color: #666666;
  white-space: nowrap;
}
.chart-tooltip-value {
  font-size: 24rpx;
  font-weight: 700;
  white-space: nowrap;
}
</style>
