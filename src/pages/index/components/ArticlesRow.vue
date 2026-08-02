<template>
    <view  class="news-list">
        <d-scroll
        v-if="loaded"
        :total="total"
        :skip="size"
        @fetch="fetchData"
        background="transparent"
        refresher-background="transparent"
        >
        <view class="news-item" v-for="(n, i) in list" :key="i" @click="onOpenDetail(n)">
          <view class="news-header">
            <text v-if="categoryId.value === 2" class="tag" style="background: #2E6BFF">交易快报</text>
            <text class="news-title">{{ n.title }}</text>
          </view>
          <view class="news-footer">
            <text class="news-date">{{ n.publishTime }}</text>
          </view>
        </view>
      </d-scroll>
      
    </view>
</template>


<script setup>
import { getArticlesPage} from '../../../api/articles'

import { ref, computed, onMounted } from 'vue'

import DScroll from '@dimple-smile/uni-scroll'

const props = defineProps({
  //list: { type: Array, default: () => [] },
  categoryId: { type: Number, default: () => 0 },
  keyword: {type: String, default: () => ''}
})

const size = ref(-1)
const total = ref(-1)
const current = ref(1)
const list = ref([])
const loaded = ref(false)
// 筛选选项
const filterOptions = computed(() => ({
  categoryId: props.categoryId,
  keyword: props.keyword,
  current: current.value,
}))

function onOpenDetail(n) {
  uni.navigateTo({ url: `/pages/index/note/detail?id=${n.id}` })
}
// 获取分页数据
const getPage = async (isRefresh = false) => {
  try {
    const res = await getArticlesPage(filterOptions.value)
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
/* 资讯列表 */
.news-list {
  margin-top: 20rpx;
  padding: 0 24rpx;
}
.news-item {
  display: flex;
  flex-direction: column;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.news-header {
  overflow: hidden;
  max-height: 92rpx;
}
.tag {
  float: left;
  color: #ffffff;
  font-size: 22rpx;
  padding: 4rpx 14rpx;
  border-radius: 6rpx;
  margin-right: 12rpx;
  margin-top: 4rpx;
}
.news-title {
  display: block;
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
  line-height: 1.5;
}
.news-footer {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.news-date {
  font-size: 24rpx;
  color: #9a9da6;
}
.news-more {
  font-size: 24rpx;
  color: #2e6bff;
}
</style>