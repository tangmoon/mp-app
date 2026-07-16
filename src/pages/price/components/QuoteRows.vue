<template>
  <view class="quote-list">
    <view class="quote-row" v-for="(item, i) in list" :key="i">
      <view class="col col-name quote-name">
        <text class="quote-name-text">{{ item.name }}</text>
        <image class="quote-add-icon" :src="icons.add" mode="aspectFit" @click.stop="$emit('add', item)" />
      </view>
      <text class="col col-price quote-value" :style="{ color: signColor(item.change) }">{{ item.price }}</text>
      <text class="col col-pct quote-value" :style="{ color: signColor(item.change) }">{{ signPercent(item.pct) }}</text>
      <text class="col col-change quote-value" :style="{ color: signColor(item.change) }">{{ signNumber(item.change) }}</text>
      <text class="col col-prince quote-value" >{{ '省份' }}</text>
    </view>
    <view v-if="list.length === 0" class="quote-empty">未找到匹配的结果</view>
  </view>
</template>

<script setup>
import { icons } from '../../../utils/icons'
import { signColor, signPercent, signNumber } from '../../../utils/format'

defineProps({
  list: { type: Array, default: () => [] },
})
defineEmits(['add'])
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
