<template>
  <view class="page">
    <view v-if="loading" class="page-loading">
      <text class="page-loading-text">加载中...</text>
    </view>

    <template v-else>
      <view class="detail-header">
        <text class="detail-title">{{ article.title }}</text>
        <text class="detail-datetime">{{ article.publishTime }}</text>
      </view>

      <view class="detail-content">
        <text class="detail-content-text">{{ article.content }}</text>
      </view>
    </template>

    <view class="next-bar">
      <view v-if="article.preId" class="next-btn" @click="onPre">上一篇</view>
      <view v-if="article.nextId" class="next-btn" @click="onNext">下一篇</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getNewsDetail } from '../../../api/news'

const loading = ref(true)
const article = ref(null)

async function loadArticle(id) {
  loading.value = true
  const res = await getNewsDetail(id)
  article.value = res.data
  loading.value = false
  if (article.value?.title) {
    uni.setNavigationBarTitle({ title: article.value.title })
  }
}

onLoad((query) => {
  loadArticle(query.id)
})

function onPre() {
  if (!article.value?.preId) return
  // redirectTo 替换当前页而不是入栈，这样反复点"下一篇"不会无限堆叠导航历史，
  // 返回键始终回到发起浏览的列表页。
  uni.redirectTo({ url: `/pages/news/detail/detail?id=${article.value.preId}` })
}

function onNext() {
  if (!article.value?.nextId) return
  // redirectTo 替换当前页而不是入栈，这样反复点"下一篇"不会无限堆叠导航历史，
  // 返回键始终回到发起浏览的列表页。
  uni.redirectTo({ url: `/pages/news/detail/detail?id=${article.value.nextId}` })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  box-sizing: border-box;
  padding-bottom: 160rpx;
}

.page-loading {
  padding-top: 200rpx;
  display: flex;
  justify-content: center;
}

.page-loading-text {
  font-size: 28rpx;
  color: #9a9da6;
}

.detail-header {
  padding: 32rpx 24rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f2;
}

.detail-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
}

.detail-datetime {
  display: block;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #9a9da6;
}

.detail-content {
  padding: 28rpx 24rpx;
}

.detail-content-text {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.9;
  white-space: pre-wrap;
}

.next-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20rpx;
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1rpx solid #f0f0f2;
  box-sizing: border-box;

  display: flex;
  gap: 20rpx;
  /* 两个按钮之间的间距 */
  height: 100rpx;
}

.next-btn {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #2e6bff;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 50rpx;

  flex: 1;
}
</style>
