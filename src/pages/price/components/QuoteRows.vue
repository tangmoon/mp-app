<template>
  <view class="quote-list">
    <d-scroll
    v-if="loaded"
    :total="total"
    :skip="size"
    @fetch="fetchData"
    background="transparent"
    refresher-background="transparent"
    >
      <view class="quote-row" v-for="(item, i) in list" :key="i">
      <view class="col col-name quote-name">
        <text class="quote-name-text">{{ item.name }}</text>
        <image class="quote-add-icon" :src="icons.add" mode="aspectFit" @click.stop="$emit('add', item)" />
      </view>
      <text class="col col-price quote-value" :style="{ color: signColor(item.changeNum) }">{{ item.price }}</text>
      <text class="col col-pct quote-value" :style="{ color: signColor(item.changeNum) }">{{ signPercent(item.pct) }}</text>
      <text class="col col-change quote-value" :style="{ color: signColor(item.changeNum) }">{{ signNumber(item.changeNum) }}</text>
      <text class="col col-prince quote-value" >{{ '省份' }}</text>
    </view>
    </d-scroll>
    
    <view v-if="total === 0" class="quote-empty">未找到匹配的结果</view>
  </view>
</template>

<script setup>
import { icons } from '../../../utils/icons'
import { signColor, signPercent, signNumber } from '../../../utils/format'
import { getPlantQuotesPage} from '../../../api/price'

import { ref, computed, onMounted } from 'vue'

import DScroll from '@dimple-smile/uni-scroll'

const props = defineProps({
  //list: { type: Array, default: () => [] },
  type: { type: Number, default: () => 0 },
  keyword: {type: String, default: () => ''}
})
defineEmits(['add'])

const size = ref(-1)
const total = ref(-1)
const current = ref(1)
const list = ref([])
const loaded = ref(false)
// 筛选选项
const filterOptions = computed(() => ({
  type: props.type,
  keyword: props.keyword,
  current: current.value,
}))
// 获取分页数据
const getPage = async (isRefresh = false) => {
  try {
    const res = await getPlantQuotesPage(filterOptions.value)
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
  console.log('type'+ props.type)
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
.quote-list {
  padding: 0 24rpx;
}
.quote-row {
  display: flex;
  align-items: center;
  padding: 26rpx 0;
  border-bottom: 1rpx solid #f0f0f2;
}
.col {
  font-size: 24rpx;
  color: #8a8d94;
}
.col-name {
  flex: 1.5;
  text-align: left;
}
.col-price {
  flex: 1.5;
  text-align: center;
}
.col-pct {
  flex: 0.8;
  text-align: right;
}
.col-change {
  flex: 1.5;
  text-align: right;
}

.col-prince {
  flex: 1;
  text-align: right;
  color: #1a1a1a;
}
.quote-name {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.quote-name-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
}
.quote-add-icon {
  width: 34rpx;
  height: 34rpx;
  flex-shrink: 0;
}
.quote-value {
  font-size: 28rpx;
  font-weight: 600;
}
.quote-empty {
  padding: 80rpx 0;
  text-align: center;
  color: #9a9da6;
  font-size: 26rpx;
}
</style>
