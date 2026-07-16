<template>
    <view class="quote-table-header">
        <text class="col col-name">{{ nameLabel }}</text>
        <text class="col col-price">报价(元/吨)</text>
        <text class="col col-pct">涨幅</text>
        <text class="col col-change">涨跌(元/吨)</text>
      </view>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  
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

  </style>
  