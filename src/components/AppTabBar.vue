<template>
  <view class="tabbar">
    <view
      v-for="(t, i) in items"
      :key="t.label"
      class="tabbar-item"
      @click="onTap(i)"
    >
      <image class="tabbar-icon" :src="tabIcon(t.icon, active === i)" mode="aspectFit" />
      <text :class="['tabbar-label', active === i && 'tabbar-label_active']">{{ t.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { tabIcon } from '../utils/icons'

const props = defineProps({
  active: { type: Number, default: 0 },
})

const items = [
  { label: '首页', icon: 'home', path: '/pages/index/index' },
  { label: '资讯', icon: 'doc', path: '/pages/news/news' },
  { label: '交易', icon: 'exchange', path: null },
  { label: '价格', icon: 'price', path: '/pages/price/price' },
  { label: '询价', icon: 'inquiry', path: '/pages/inquiry/inquiry' },
  { label: '地图', icon: 'map', path: null },
]

function onTap(i) {
  if (i === props.active) return
  const item = items[i]
  if (!item.path) {
    uni.showToast({ title: '敬请期待', icon: 'none' })
    return
  }
  uni.reLaunch({ url: item.path })
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 1rpx solid #eeeeee;
  display: flex;
  z-index: 6;
}
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}
.tabbar-icon {
  width: 44rpx;
  height: 44rpx;
}
.tabbar-label {
  font-size: 20rpx;
  color: #9a9da6;
}
.tabbar-label_active {
  color: #2e6bff;
}
</style>
