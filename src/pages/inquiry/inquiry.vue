<template>
  <view class="page">
    <view v-if="loading" class="page-loading">
      <text class="page-loading-text">加载中...</text>
    </view>

    <template v-else>
    <InquiryFilterBar
      :side-options="sideOptions"
      :active-side="activeSide"
      :category-options="categoryOptions"
      :active-category="activeCategory"
      @update:active-side="activeSide = $event"
      @update:active-category="activeCategory = $event"
    >
      <AppSearchBar />
    </InquiryFilterBar>

    <view class="result-area">
      <view class="empty-state">
        <image class="empty-illustration" :src="icons.empty" mode="aspectFit" />
        <text class="empty-text">没有找到结果</text>
      </view>
    </view>
    </template>

    <LoginBanner />
    <AppTabBar :active="4" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSearchBar from '../../components/AppSearchBar.vue'
import LoginBanner from '../../components/LoginBanner.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import InquiryFilterBar from './components/InquiryFilterBar.vue'
import { icons } from '../../utils/icons'
import { getInquiryFilters } from '../../api/inquiry'

const loading = ref(true)
const sideOptions = ref([])
const activeSide = ref(0)
const categoryOptions = ref([])
const activeCategory = ref(0)

onMounted(async () => {
  const filters = await getInquiryFilters()
  sideOptions.value = filters.sideOptions
  categoryOptions.value = filters.categoryOptions
  loading.value = false
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 210rpx;
  box-sizing: border-box;
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
.result-area {
  padding: 80rpx 24rpx 0;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60rpx;
}
.empty-illustration {
  width: 240rpx;
  height: 240rpx;
}
.empty-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #9a9da6;
}
</style>
