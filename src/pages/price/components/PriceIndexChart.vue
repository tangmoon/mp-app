<template>
  <view>
    <view class="chart-image-wrap" @touchstart="onTap" @click="onTap">
      <image v-if="src" class="chart-image" :src="src" mode="widthFix" />

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
          :style="{ left: tooltip.boxXPct + '%', top: tooltip.boxTopPct + '%' }"
          @click.stop="closeTooltip"
        >
          <text class="chart-tooltip-date">{{ tooltip.date }}</text>
          <view v-for="(row, i) in tooltip.rows" :key="i" class="chart-tooltip-row">
            <view class="chart-tooltip-dot" :style="{ background: row.color }" />
            <text v-if="row.name" class="chart-tooltip-name">{{ row.name }}</text>
            <text class="chart-tooltip-value" :style="{ color: row.color }">{{ row.value }}{{ unit ? ' ' + unit : '' }}</text>
          </view>
        </view>
      </template>
    </view>

    <view class="chart-more" @click="$emit('view-detail')">
      <image class="chart-more-icon" :src="icons.chart" mode="aspectFit" />
      <text class="chart-more-text">查看详细数据图</text>
    </view>
  </view>
</template>

<script setup>
import { toRef } from 'vue'
import { icons } from '../../../utils/icons'
import { useChartTooltip } from '../composables/useChartTooltip'

const props = defineProps({
  src: { type: String, default: '' },
  // [{ color: string, points: [{ x: string, y: number }] }]
  series: { type: Array, default: () => [] },
  // display name per series, same order/length as `series`
  names: { type: Array, default: () => [] },
  unit: { type: String, default: '' },
})
defineEmits(['view-detail'])

const { tooltip, onTap, closeTooltip } = useChartTooltip({
  series: toRef(props, 'series'),
  names: toRef(props, 'names'),
})
</script>

<style scoped>
.chart-image-wrap {
  position: relative;
  margin-top: 24rpx;
}
.chart-image {
  width: 100%;
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
  position: absolute;
  transform: translate(-50%, -100%);
  margin-top: -16rpx;
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
.chart-more {
  margin-top: 20rpx;
  background: #eaf1ff;
  border-radius: 16rpx;
  padding: 26rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
.chart-more-icon {
  width: 32rpx;
  height: 32rpx;
}
.chart-more-text {
  color: #2e6bff;
  font-size: 28rpx;
  font-weight: 600;
}
</style>
