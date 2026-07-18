<template>
  <view class="filter-container">
    <view class="filter-head">
      <view class="filter-row">
        <view class="filter-select filter-select_third" @click="togglePanel('product')">
          <text class="filter-select-text">{{ productOptions[activeProduct] }}</text>
          <text class="filter-select-arrow">⌄</text>
        </view>
        <view class="filter-select filter-select_third" @click="togglePanel('province')">
          <text class="filter-select-text">{{ provinceOptions[activeProvince] }}</text>
          <text class="filter-select-arrow">⌄</text>
        </view>
        <view class="filter-select filter-select_wider" @click="togglePanel('range')">
          <text class="filter-select-text">{{ rangeLabel }}</text>
          <text class="filter-select-arrow">⌄</text>
        </view>
      </view>

      <view v-if="openKey === 'product'" class="dropdown dropdown_product">
        <view
          v-for="(p, i) in productOptions"
          :key="p"
          :class="['dropdown-item', activeProduct === i && 'dropdown-item_active']"
          @click="selectProduct(i)"
        >
          {{ p }}
        </view>
      </view>

      <view v-if="openKey === 'province'" class="dropdown dropdown_province">
        <view
          v-for="(p, i) in provinceOptions"
          :key="p"
          :class="['dropdown-item', activeProvince === i && 'dropdown-item_active']"
          @click="selectProvince(i)"
        >
          {{ p }}
        </view>
      </view>

      <view v-if="openKey === 'range'" class="dropdown dropdown_range">
        <view
          v-for="(r, i) in rangeOptions"
          :key="r.key"
          :class="['dropdown-item', activeRange === i && 'dropdown-item_active']"
          @click="selectRange(i)"
        >
          {{ r.label }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  productOptions: { type: Array, required: true },
  activeProduct: { type: Number, default: 0 },
  provinceOptions: { type: Array, required: true },
  activeProvince: { type: Number, default: 0 },
  rangeOptions: { type: Array, required: true },
  activeRange: { type: Number, default: 1 },
})
const emit = defineEmits([
  'update:activeProduct',
  'update:activeProvince',
  'update:activeRange',
])

const openKey = ref('') // 'product' | 'province' | 'range' | ''

// tag:--mockapi 用今天日期动态算范围文案；真实接入后端后应该改成后端时间窗口
const rangeLabel = computed(() => {
  const r = props.rangeOptions[props.activeRange]
  if (!r) return ''
  const end = new Date()
  const start = new Date(end.getTime() - (r.days - 1) * 24 * 60 * 60 * 1000)
  const fmt = (d) => {
    const yy = String(d.getFullYear()).slice(2)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yy}/${mm}/${dd}`
  }
  return `${fmt(start)} 至 ${fmt(end)}`
})

function togglePanel(key) {
  openKey.value = openKey.value === key ? '' : key
}
function selectProduct(i) {
  emit('update:activeProduct', i)
  openKey.value = ''
}
function selectProvince(i) {
  emit('update:activeProvince', i)
  openKey.value = ''
}
function selectRange(i) {
  emit('update:activeRange', i)
  openKey.value = ''
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
  gap: 16rpx;
  padding: 8rpx 24rpx 20rpx;
  box-sizing: border-box;
}
.filter-select {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 64rpx;
  background: #eaf1ff;
  border: 2rpx solid #b9cdf2;
  border-radius: 12rpx;
  box-sizing: border-box;
}
.filter-select_third {
  flex: 1;
}
.filter-select_wider {
  flex: 1.6;
}
.filter-select-text {
  color: #2e6bff;
  font-size: 26rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.filter-select-arrow {
  flex-shrink: 0;
  color: #6b88c2;
  font-size: 22rpx;
}

.dropdown {
  position: absolute;
  top: 100%;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(20, 30, 60, 0.14);
  overflow: hidden;
  max-height: 480rpx;
  overflow-y: auto;
}
.dropdown_product {
  left: 24rpx;
  width: 200rpx;
}
.dropdown_province {
  left: calc(24rpx + 200rpx + 16rpx);
  width: 200rpx;
}
.dropdown_range {
  right: 24rpx;
  width: 280rpx;
}
.dropdown-item {
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
}
.dropdown-item_active {
  color: #2e6bff;
  font-weight: 600;
  background: #f2f6fd;
}
</style>