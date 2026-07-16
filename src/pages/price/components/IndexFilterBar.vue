<template>
  <view class="index-filter">
    <scroll-view class="index-filter-scroll" scroll-x :show-scrollbar="false">
      <view class="index-filter-row">
        <view
          v-for="(opt, i) in options"
          :key="opt.key"
          :class="['index-pill', modelValue === i && 'index-pill_active']"
          @click="$emit('update:modelValue', i)"
        >
          {{ opt.label }}
        </view>
      </view>
    </scroll-view>
    <view class="index-filter-more" @click="$emit('more')">⌄</view>
  </view>
</template>

<script setup>
defineProps({
  options: { type: Array, required: true },
  modelValue: { type: Number, default: 0 },
})
defineEmits(['update:modelValue', 'more'])
</script>

<style scoped>
.index-filter {
  display: flex;
  align-items: center;
  padding: 0 24rpx 20rpx;
  gap: 8rpx;
}
.index-filter-scroll {
  flex: 1;
  white-space: nowrap;
}
.index-filter-row {
  display: flex;
  gap: 16rpx;
}
.index-pill {
  flex-shrink: 0;
  padding: 14rpx 24rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
  border: 1rpx solid transparent;
  white-space: nowrap;
}
.index-pill_active {
  color: #2e6bff;
  font-weight: 600;
  border-color: #2e6bff;
}
.index-filter-more {
  flex-shrink: 0;
  color: #9a9da6;
  font-size: 30rpx;
  padding: 0 8rpx;
}
</style>
