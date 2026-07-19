<template>
  <view class="search-row">
    <image class="avatar" :src="icons.avatar" mode="aspectFit" @click="onAvatarTap" />
    <view class="search-box">
      <image class="search-icon" :src="icons.search" mode="aspectFit" />
      <input class="search-input" placeholder="输入关键字" placeholder-class="search-placeholder" />
      <text class="divider">|</text>
      <text class="search-btn">搜索</text>
    </view>
    <view class="ai-btn" @click="onAiChat">AI</view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { icons } from '../utils/icons'
import { userStore } from '../store/user'

const loggedIn = computed(() => userStore.isLoggedIn())

function onAvatarTap() {
  if (!loggedIn.value) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  /*uni.showActionSheet({
    itemList: ['退出登录'],
    success: (res) => {
      if (res.tapIndex === 0) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'none' })
      }
    },
  })*/
  uni.navigateTo({ url: '/pages/user/info' })
}

function onAiChat() {
  uni.navigateTo({ url: '/pages/chat/chat' })
}
</script>

<style scoped>
.search-row {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.search-box {
  flex: 1;
  height: 72rpx;
  background: #f4f5f7;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.search-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.search-placeholder {
  color: #a9acb4;
}

.divider {
  color: #dcdee3;
  font-size: 26rpx;
  margin: 0 16rpx;
}

.search-btn {
  color: #6b7078;
  font-size: 28rpx;
  flex-shrink: 0;
}

.ai-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6f8bff, #2e4fe0);
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
