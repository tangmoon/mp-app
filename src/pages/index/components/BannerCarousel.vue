<template>
  <view class="banner-area">
    <view class="banner-wrap">
      <swiper
        class="banner-swiper"
        :autoplay="true"
        :interval="4000"
        :duration="400"
        circular
        @change="onBannerChange"
      >
        <swiper-item v-for="(b, i) in banners" :key="i">
          <view class="banner-slide" :style="{ background: b.bg }">
            <text class="banner-title">{{ b.title }}</text>
          </view>
        </swiper-item>
      </swiper>

      <view class="banner-dots">
        <view v-for="(b, i) in banners" :key="i" :class="['dot', currentBanner === i && 'dot_active']" />
      </view>

      <view class="banner-caption">
        <text class="banner-caption-text">{{ banners[currentBanner].title }}</text>
      </view>
    </view>

    <!-- 上下自动翻滚的公告牌 -->
    <view class="peek-card">
      <swiper class="peek-swiper" vertical circular :autoplay="true" :interval="2600" :duration="500">
        <swiper-item v-for="(p, i) in peekItems" :key="i" class="peek-swiper-item">
          <text class="peek-title">{{ p.title }}</text>
          <text class="peek-date">{{ p.date }}</text>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  banners: { type: Array, required: true },
  peekItems: { type: Array, required: true },
})

const currentBanner = ref(0)
function onBannerChange(e) {
  currentBanner.value = e.detail.current
}
</script>

<style scoped>
.banner-area {
  position: relative;
  padding: 0 24rpx;
}
.peek-card {
  margin-top: 20rpx;
  height: 76rpx;
  background: #eef2fb;
  border-radius: 12rpx;
  overflow: hidden;
}
.peek-swiper {
  width: 100%;
  height: 100%;
}
.peek-swiper-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.peek-title {
  font-size: 26rpx;
  color: #6b7078;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 16rpx;
}
.peek-date {
  font-size: 24rpx;
  color: #9a9da6;
  flex-shrink: 0;
}
.banner-wrap {
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
}
.banner-swiper {
  width: 100%;
  height: 320rpx;
}
.banner-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 40rpx;
  box-sizing: border-box;
}
.banner-title {
  color: #ffffff;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.6;
}
.banner-dots {
  position: absolute;
  top: 20rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10rpx;
}
.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 5rpx;
  background: rgba(255, 255, 255, 0.5);
}
.dot_active {
  width: 26rpx;
  background: #ffffff;
}
.banner-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 68rpx;
  background: rgba(15, 20, 45, 0.55);
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.banner-caption-text {
  color: #ffffff;
  font-size: 26rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
