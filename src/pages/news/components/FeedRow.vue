<template>
    <view  class="feed-list">
        <d-scroll
        v-if="loaded"
        :total="total"
        :skip="size"
        @fetch="fetchData"
        background="transparent"
        refresher-background="transparent"
        >
        <view class="feed-item" v-for="(n, i) in list" :key="i" @click="onOpenDetail(n)">
        <text class="feed-title">{{ n.title }}</text>
        <text class="feed-summary">{{ n.summary }}</text>
        <text class="feed-date">{{ n.publishTime }}</text>
      </view>
      </d-scroll>
      
    </view>
</template>


<script setup>
import { getNewsPage} from '../../../api/news'

import { ref, computed, onMounted } from 'vue'

import DScroll from '@dimple-smile/uni-scroll'

const props = defineProps({
  //list: { type: Array, default: () => [] },
  subCategoryId: { type: Number, default: () => 0 },
  keyword: {type: String, default: () => ''}
})

const size = ref(-1)
const total = ref(-1)
const current = ref(1)
const list = ref([])
const loaded = ref(false)
// 筛选选项
const filterOptions = computed(() => ({
  categoryId: 1,
  keyword: props.keyword,
  current: current.value,
}))

function onOpenDetail(n) {
  uni.navigateTo({ url: `/pages/news/detail/detail?id=${n.id}` })
}
// 获取分页数据
const getPage = async (isRefresh = false) => {
  try {
    const res = await getNewsPage(filterOptions.value)
  if (res.code === 200){
    total.value = res.data.totalNum
    if (isRefresh || current.value === 1) {
      list.value = res.data.contentList
    } else {
      list.value = [...list.value, ...res.data.contentList]
    }
    size.value = list.value.length
  }
  } catch (error) {
    console.error('加载列表失败', error)
  } finally {
    loaded.value = true
  }
}

const fetchData = async (e) => {
  console.log("e:" + e)
  const {stop} = e;
  try {
    // 从事件参数中获取当前页码（组件会自动管理）
    // 这里简化处理：如果当前页为1则刷新，否则加载更多
    if (current.value === 1) {
      await getPage(true)
    } else {
      await getPage()
    }
  } finally {
    stop();
  }
}

onMounted(() => {
  getPage();
})

</script>
<style scoped>
/* 信息动态 */
.feed-list {
  padding: 0 24rpx;
  height: 1500rpx;
}
.feed-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.feed-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.5;
  margin-bottom: 14rpx;
}
.feed-summary {
  font-size: 26rpx;
  color: #8a8d94;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.feed-date {
  font-size: 24rpx;
  color: #5B7FD6;
}
</style>