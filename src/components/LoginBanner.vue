<template>
  <view v-if="!loggedIn" class="login-banner">
    <text class="login-text">请点击登录，以便为您提供更好的服务</text>
    <view class="login-btn" @click="onLogin">点击登录</view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { userStore } from '../store/user'

const loggedIn = computed(() => userStore.isLoggedIn())

function onLogin() {
  uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<style scoped>
.login-banner {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 124rpx;
  height: 96rpx;
  background: #eaf1ff;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(30, 60, 140, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-sizing: border-box;
  z-index: 5;
}
.login-text {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  margin-right: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.login-btn {
  flex-shrink: 0;
  background: #2e6bff;
  color: #ffffff;
  font-size: 26rpx;
  padding: 12rpx 28rpx;
  border-radius: 30rpx;
}
</style>
