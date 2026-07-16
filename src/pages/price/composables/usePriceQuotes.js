import { ref, computed, watch } from 'vue'

/**
 * 报价列表的搜索 + 排序状态，供 LNG 液厂/接收站报价两个 tab 共用。
 * rawList 变化（切换 tab）时自动清空搜索词和排序状态。
 */
export function usePriceQuotes(rawList) {
  const searchText = ref('')
  const sortField = ref(null)
  const sortDir = ref('desc')

  watch(rawList, () => {
    searchText.value = ''
    sortField.value = null
  })

  const filteredList = computed(() => {
    const kw = searchText.value.trim()
    if (!kw) return rawList.value
    return rawList.value.filter((item) => item.name.includes(kw))
  })

  const sortedList = computed(() => {
    if (!sortField.value) return filteredList.value
    const dir = sortDir.value === 'asc' ? 1 : -1
    return [...filteredList.value].sort((a, b) => (a[sortField.value] - b[sortField.value]) * dir)
  })

  function toggleSort(field) {
    if (sortField.value === field) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDir.value = 'desc'
    }
  }

  function sortArrow(field) {
    if (sortField.value !== field) return ' ⇕'
    return sortDir.value === 'asc' ? ' ↑' : ' ↓'
  }

  return { searchText, sortedList, toggleSort, sortArrow }
}
