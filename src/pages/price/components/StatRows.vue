<template>
  <view v-for="(row, ri) in rows" :key="ri" class="stat-row">
    <view v-for="(col, ci) in row" :key="ci" class="stat-col">
      <text class="stat-col-label">{{ col.label }}</text>
      <text class="stat-col-value" :style="{ color }">
        {{ col.value }}<text class="stat-col-unit"> {{ col.unit }}</text>
      </text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  rows: { type: Array, required: true },
  color: { type: String, default: '#1a1a1a' },
})
</script>

<style scoped>
.stat-row {
  display: flex;
  gap: 12rpx;
}
.stat-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.stat-col-label {
  font-size: 24rpx;
  color: #8a8d94;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-col-value {
  font-size: 30rpx;
  font-weight: 700;
}
.stat-col-unit {
  font-size: 20rpx;
  font-weight: 400;
  margin-left: 4rpx;
}
</style>
