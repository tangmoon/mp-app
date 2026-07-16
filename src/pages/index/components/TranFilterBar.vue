<template>
  <view class="filter-container">
    <view class="filter-head">
      <slot />

      <view class="filter-row">
        <view class="filter-select filter-select_side" @click="toggleSide">
          <text class="filter-select-text">{{ sideOptions[activeSide] }}</text>
          <text class="filter-select-arrow">⌄</text>
        </view>
        <view class="filter-select filter-select_wide" @click="toggleCategory">
          <text class="filter-select-text">{{ categoryOptions[activeCategory] }}</text>
          <text class="filter-select-arrow">⌄</text>
        </view>
      </view>

      <view v-if="sideOpen" class="category-panel">
        <view class="category-grid">
        <view v-for="(s, i) in sideOptions" :key="s"
          :class="['category-pill', activeSide === i && 'category-pill_active']" @click="selectSide(i)">
          {{ s }}
        </view>
      </view>
    </view>

    <view v-if="categoryOpen" class="category-panel">
      <view class="category-grid">
        <view v-for="(c, i) in categoryOptions" :key="c"
          :class="['category-pill', activeCategory === i && 'category-pill_active']" @click="selectCategory(i)">
          {{ c }}
        </view>
      </view>
    </view>
  </view>

  <view v-if="sideOpen || categoryOpen" class="filter-scrim" @click="closeAll" />
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sideOptions: { type: Array, required: true },
  activeSide: { type: Number, default: 0 },
  categoryOptions: { type: Array, required: true },
  activeCategory: { type: Number, default: 0 },
  dateOptions: {type: Array, required: true},
  acticeDate: {type: Array, required: true}
})
const emit = defineEmits(['update:activeSide', 'update:activeCategory'])

const sideOpen = ref(false)
const categoryOpen = ref(false)
const dateOpen = ref(false)

function toggleSide() {
  sideOpen.value = false
  sideOpen.value = !sideOpen.value
}
function toggleCategory() {
  categoryOpen.value = false
  categoryOpen.value = !categoryOpen.value
}

function toggleDate() {
  dateOpen.value = false
  dateOpen.value = !dateOpen.value
}

function selectSide(i) {
  emit('update:activeSide', i)
  sideOpen.value = false
}
function selectCategory(i) {
  emit('update:activeCategory', i)
  categoryOpen.value = false
}


function closeAll() {
  sideOpen.value = false
  categoryOpen.value = false
  dateOpen.value = false
}
</script>

<style scoped>
.filter-head {
  position: relative;
  z-index: 8;
  background: #ffffff;
}

.filter-row {
  display: flex;
  gap: 20rpx;
  padding: 0 24rpx 20rpx;
  box-sizing: border-box;
}

.filter-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eaf1ff;
  border: 1rpx solid #2e6bff;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  box-sizing: border-box;
}

.filter-select_side {
  width: 100rpx;
  flex-shrink: 0;
}

.filter-select_wide {
  width: 100rpx;
  flex: 1;
  min-width: 0;
}

.filter-select-text {
  color: #2e6bff;
  font-size: 28rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-select-arrow {
  flex-shrink: 0;
  color: #2e6bff;
  font-size: 22rpx;
  margin-left: 8rpx;
}

.side-dropdown {
  position: absolute;
  top: 100%;
  left: 24rpx;
  width: 200rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(20, 30, 60, 0.14);
  overflow: hidden;
}

.side-dropdown-item {
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
}

.side-dropdown-item_active {
  color: #2e6bff;
  font-weight: 600;
  background: #f2f6fd;
}

.category-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 20rpx 24rpx 28rpx;
  box-sizing: border-box;
  box-shadow: 0 12rpx 24rpx rgba(20, 30, 60, 0.1);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.category-pill {
  text-align: center;
  padding: 20rpx 0;
  border-radius: 8rpx;
  background: #f4f5f7;
  color: #333333;
  font-size: 28rpx;
  border: 1rpx solid transparent;
  box-sizing: border-box;
}

.category-pill_active {
  background: #eaf1ff;
  color: #2e6bff;
  font-weight: 600;
  border-color: #2e6bff;
}

.filter-scrim {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 15, 30, 0.35);
  z-index: 7;
}
</style>
