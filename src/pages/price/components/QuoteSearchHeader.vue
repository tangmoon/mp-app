<template>
  <view>
    <view class="quote-search-row">
      <input
        class="quote-search-input"
        :value="search"
        @input="$emit('search-change', $event.detail.value)"
        :placeholder="placeholder"
        placeholder-class="quote-search-placeholder"
      />
      <view class="quote-search-btn" @click="onSearch">搜索</view>
    </view>
    <view class="quote-table-header">
      <text class="col col-name">{{ nameLabel }}</text>
      <text class="col col-price" @click="$emit('sort', 'price')">报价(元/吨){{ sortArrow('price') }}</text>
      <text class="col col-pct" @click="$emit('sort', 'pct')">涨幅{{ sortArrow('pct') }}</text>
      <text class="col col-change" @click="$emit('sort', 'change')">涨跌(元/吨){{ sortArrow('change') }}</text>
      <text class="col col-prince" @click="$emit('sort', 'prince')">省份{{ sortArrow('prince') }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  search: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  nameLabel: { type: String, default: '' },
  sortArrow: { type: Function, required: true },
})
defineEmits(['search-change', 'sort'])

function onSearch() {
  uni.hideKeyboard && uni.hideKeyboard()
}
</script>

<style scoped>
.quote-search-row {
  display: flex;
  align-items: center;
  padding: 0 24rpx 20rpx;
  gap: 16rpx;
}
.quote-search-input {
  flex: 1;
  height: 68rpx;
  background: #f0f4fc;
  border-radius: 34rpx;
  padding: 0 28rpx;
  font-size: 26rpx;
  color: #333;
  box-sizing: border-box;
}
.quote-search-placeholder {
  color: #a0abc0;
}
.quote-search-btn {
  flex-shrink: 0;
  background: #2e6bff;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 600;
  padding: 16rpx 32rpx;
  border-radius: 34rpx;
}
.quote-table-header {
  display: flex;
  align-items: center;
  padding: 0 24rpx 18rpx;
  border-bottom: 1rpx solid #f0f0f2;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
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
  text-align: right;
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
}
</style>
