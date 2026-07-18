<template>
  <view :class="['tabs', spread && 'tabs_spread', center && 'tabs_center']">
    <view
      v-for="(tab, i) in tabs"
      :key="tab"
      class="tab-item"
      @click="$emit('update:modelValue', i)"
    >
      <text :class="['tab-text', modelValue === i && 'tab-text_active']">{{ tab }}</text>
      <view :class="['tab-underline', modelValue === i && 'tab-underline_active']" />
    </view>
  </view>
</template>

<script setup>
defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: Number, default: 0 },
  spread: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx 24rpx;
  gap: 48rpx;
}
.tabs_spread {
  justify-content: space-between;
  gap: 0;
}
.tabs_center {
  justify-content: center;
  gap: 72rpx;
}
.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab-text {
  font-size: 30rpx;
  color: #666;
  font-weight: 400;
}
.tab-text_active {
  color: #1a1a1a;
  font-weight: 700;
}
.tab-underline {
  margin-top: 12rpx;
  width: 40rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background: transparent;
}
.tab-underline_active {
  background: #2e6bff;
}
</style>
