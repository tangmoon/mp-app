<template>
  <!-- cards：每个 block 独立着色卡片（如“液厂原料气现货价格”按区域分卡） -->
  <template v-if="variant === 'cards'">
    <view
      v-for="(block, bi) in blocks"
      :key="bi"
      class="region-card"
      :style="{ background: block.bg }"
    >
      <text v-if="block.heading" class="region-card-heading" :style="{ color: block.color }">
        {{ block.heading }}
      </text>
      <StatRows :rows="block.rows" :color="block.color" />
    </view>
  </template>

  <!-- shared：多个 block 共用一张卡片，中间用分隔线区分（单指标/多指标场景） -->
  <view v-else class="stat-card">
    <view v-for="(block, bi) in blocks" :key="bi" :class="['stat-block', bi > 0 && 'stat-block_sep']">
      <StatRows :rows="block.rows" :color="block.color" />
    </view>
  </view>
</template>

<script setup>
import StatRows from './StatRows.vue'

defineProps({
  blocks: { type: Array, required: true },
  variant: { type: String, default: 'shared' }, // 'cards' | 'shared'
})
</script>

<style scoped>
.region-card {
  border-radius: 16rpx;
  padding: 28rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.region-card-heading {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}
.stat-card {
  background: #f2f6fd;
  border-radius: 16rpx;
  padding: 28rpx;
  box-sizing: border-box;
}
.stat-block_sep {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #e3e8f2;
}
</style>
