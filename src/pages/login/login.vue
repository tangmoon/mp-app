<template>
  <view class="login-page">
    <view class="logo-area">
      <view class="logo-mark">
        <text class="logo-mark-text">上海</text>
      </view>
      <text class="app-name">上海资讯</text>
      <text class="app-slogan">LNG · 天然气市场信息服务</text>
    </view>

    <view class="action-area">
      <template v-if="mode === 'entry'">
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="btn-primary"
          open-type="getPhoneNumber"
          hover-class="btn-primary_hover"
          :loading="loading"
          @getphonenumber="onGetPhoneNumber"
        >
          手机号一键登录
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <!-- tag:--mockapi H5/开发环境没有微信 getPhoneNumber 能力，这里用同一套流程走一个假 code 方便联调 -->
        <button class="btn-primary" hover-class="btn-primary_hover" :loading="loading" @click="onGetPhoneNumberFallback">
          手机号一键登录
        </button>
        <!-- #endif -->

        <text class="link" @click="mode = 'account'">账号登录</text>
      </template>

      <template v-else>
        <view class="account-form">
          <input
            class="input"
            v-model="account.phone"
            placeholder="请输入账号"
            placeholder-class="input-placeholder"
          />
          <input
            class="input"
            v-model="account.password"
            password
            placeholder="请输入密码"
            placeholder-class="input-placeholder"
          />
        </view>
        <button class="btn-primary" hover-class="btn-primary_hover" :loading="loading" @click="onAccountLogin">
          登录
        </button>
        <text class="link" @click="mode = 'entry'">返回</text>
      </template>
    </view>

    <text class="agreement">登录即代表同意《用户协议》与《隐私政策》</text>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getWxLoginCode, wxPhoneLogin, accountLogin } from '../../api/auth'
import { userStore } from '../../store/user'

const mode = ref('entry') // 'entry' | 'account'
const loading = ref(false)
const account = reactive({ phone: '', password: '' })

function finishLogin(session) {
  
  const token = session.clientToken;
  console.log("token:" + JSON.stringify(session, null, 2))
  userStore.setSession({ token, userInfo: session })
  uni.showToast({ title: '登录成功', icon: 'success' })
  setTimeout(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }, 600)
}

async function onGetPhoneNumber(e) {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '已取消授权', icon: 'none' })
    return
  }
  await loginWithPhoneCode(e.detail.code)
}

async function onGetPhoneNumberFallback() {
  await loginWithPhoneCode('mock-phone-code')
}

async function loginWithPhoneCode(phoneCode) {
  if (loading.value) return
  loading.value = true
  try {
    // tag:--mockapi wxCode 目前只在 wxPhoneLogin 里拼进假数据，真实接入后端时才会真正用到
    const wxCode = await getWxLoginCode()
    const session = await wxPhoneLogin({ phoneCode, wxCode })
    const userInfo = session.data;
    finishLogin(userInfo)
  } catch (err) {
    console.log(err)
    uni.showToast({ title: '登录失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function onAccountLogin() {
  if (loading.value) return
  if (!account.phone || !account.password) {
    uni.showToast({ title: '请输入账号和密码', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const session = await accountLogin({ phone: account.phone, password: account.password })
    const userInfo = session.data;
    console.log('userId:' + userInfo.clientToken)
    finishLogin(userInfo)
  } catch (err) {
    console.log(err)
    uni.showToast({ title: '登录失败，请检查账号密码', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 56rpx;
  box-sizing: border-box;
  background: #ffffff;
}
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200rpx;
  margin-bottom: 120rpx;
}
.logo-mark {
  width: 140rpx;
  height: 140rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #6f8bff, #2e4fe0);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(46, 107, 255, 0.28);
}
.logo-mark-text {
  color: #ffffff;
  font-size: 40rpx;
  font-weight: 700;
}
.app-name {
  margin-top: 28rpx;
  font-size: 38rpx;
  font-weight: 700;
  color: #1a1a1a;
}
.app-slogan {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #9a9da6;
}
.action-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.account-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 32rpx;
}
.input {
  width: 100%;
  height: 88rpx;
  background: #f4f5f7;
  border-radius: 16rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}
.input-placeholder {
  color: #a9acb4;
}
.btn-primary {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: #2e6bff;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 16rpx;
  margin: 0;
}
.btn-primary::after {
  border: none;
}
.btn-primary_hover {
  background: #244fc4;
}
.link {
  margin-top: 32rpx;
  font-size: 26rpx;
  color: #2e6bff;
}
.agreement {
  margin-top: auto;
  margin-bottom: 48rpx;
  font-size: 22rpx;
  color: #c3c6cc;
  text-align: center;
}
</style>
