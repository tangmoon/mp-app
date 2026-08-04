<template>
  <view class="page">
    <!-- 浅色渐变顶部：自定义返回 + 头像 + 用户名 + ♂ -->
    <view class="top">
      <view class="navbar">
        <view class="navbar-back" @click="onBack">
          <image class="navbar-icon" :src="iconBack" mode="aspectFit" />
        </view>
      </view>
      <view class="header">
        <view class="avatar">
          <image class="avatar-img" :src="avatarImg" mode="aspectFit" />
        </view>
        <view class="user-text">
          <view class="username-row">
            <text class="username">user-qystvdheul</text>
            <image class="male-icon" :src="iconMale" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <!-- 菜单列表（白卡，圆角，5 项纯文字） -->
    <view class="menu-card">
      <view
        v-for="(m, i) in menus"
        :key="m.key"
        :class="['menu-item', i !== menus.length - 1 && 'menu-item_divider']"
        @click="onMenuTap(m)"
      >
        <text class="menu-name">{{ m.label }}</text>
        <image class="menu-arrow" :src="iconArrow" mode="aspectFit" />
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom">
      <button class="btn-logout" hover-class="btn-logout_hover" @click="onLogout">退出账号</button>
      <text class="switch-account" @click="onSwitchAccount">切换账号</text>
    </view>
  </view>
</template>

<script setup>
import { svg } from '../../utils/icons'
import { userStore } from '../../store/user'
import { logout } from '../../api/auth'

// 默认灰色头像
const avatarImg = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
    `<circle cx='24' cy='24' r='24' fill='#D6DAE2'/>` +
    `<circle cx='24' cy='19' r='8' fill='#ffffff'/>` +
    `<path d='M8 42c1-9 8-14 16-14s15 5 16 14z' fill='#ffffff'/>` +
    `</svg>`
)

// 顶栏返回箭头
const iconBack = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
    `<path d='M30 10l-16 14 16 14' fill='none' stroke='#1a1a1a' stroke-width='3.6' stroke-linecap='round' stroke-linejoin='round'/>` +
    `</svg>`
)

// 蓝色 ♂ 男性符号（带方框描边）
const iconMale = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
    `<circle cx='18' cy='30' r='11' fill='none' stroke='#2E6BFF' stroke-width='3'/>` +
    `<path d='M26 22L40 8' fill='none' stroke='#2E6BFF' stroke-width='3' stroke-linecap='round'/>` +
    `<path d='M28 8h12v12' fill='none' stroke='#2E6BFF' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>` +
    `</svg>`
)

// 菜单右侧 > 箭头
const iconArrow = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>` +
    `<path d='M18 12l12 12-12 12' fill='none' stroke='#C3C6CC' stroke-width='3.6' stroke-linecap='round' stroke-linejoin='round'/>` +
    `</svg>`
)

const menus = [
  { key: 'favorites', label: '我的收藏' },
  { key: 'history', label: '历史浏览' },
  { key: 'contact', label: '联系我们' },
  { key: 'vip', label: '增值服务' },
  { key: 'survey', label: '已填问卷' },
]

function onBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

function onMenuTap(m) {
  // tag:--mockapi 仅占位提示，没有真正的收藏/历史/问卷等后端接口
  uni.showToast({ title: m.label, icon: 'none' })
}

function onLogout() {
  userStore.logout()
  logout();
  uni.showToast({ title: '已退出登录', icon: 'none' })
  setTimeout(() => uni.reLaunch({ url: '/pages/index/index' }), 600)
}

function onSwitchAccount() {
  // tag:--mockapi 切换账号：清掉当前 session 后跳到登录页
  userStore.logout()
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: 200rpx;
  box-sizing: border-box;
}

/* —— 顶部：navbar + header 共用浅色渐变 —— */
.top {
  background: linear-gradient(180deg, #e4e8ff 0%, #f4f5f7 100%);
}
.navbar {
  display: flex;
  align-items: center;
  padding: 60rpx 24rpx 16rpx;
  background: transparent;
}
.navbar-back {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar-icon {
  width: 40rpx;
  height: 40rpx;
}

/* —— 头部：头像 + 用户名 + ♂ —— */
.header {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx 48rpx;
  background: transparent;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 6rpx 18rpx rgba(20, 30, 60, 0.12);
}
.avatar-img {
  width: 100%;
  height: 100%;
}
.user-text {
  margin-left: 24rpx;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.username-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.username {
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
}
.male-icon {
  width: 30rpx;
  height: 30rpx;
}

/* —— 菜单卡 —— */
.menu-card {
  margin: 32rpx 24rpx 0;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(20, 30, 60, 0.05);
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 32rpx;
}
.menu-item_divider {
  border-bottom: 1rpx solid #f0f0f2;
}
.menu-name {
  font-size: 30rpx;
  color: #1a1a1a;
}
.menu-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

/* —— 底部 —— */
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32rpx;
}
.btn-logout {
  width: 100%;
  height: 92rpx;
  line-height: 92rpx;
  background: #2E6BFF;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 46rpx;
  margin: 0;
}
.btn-logout::after { border: none; }
.btn-logout_hover { background: #244fc4; }
.switch-account {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #1a1a1a;
}
</style>