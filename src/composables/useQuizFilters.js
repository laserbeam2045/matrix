import { ref, unref, computed } from 'vue'

export default function useQuizFilters(quizzes) {
  // フィルター関数の配列
  const filters = ref([])

  /**
   * フィルターを更新する関数
   * @param {array | function} newFilter
   */
  const updateFilters = newFilter => {
    if (Array.isArray(newFilter))
      filters.value = newFilter
    else
      filters.value = [newFilter]
  }

  // フィルターにかけた結果として残るデータ
  const filteredQuizzes = computed(() => {
    let data = unref(quizzes)
    filters.value.forEach(filter => {
      data = data.filter(filter)
    })
    return data
  })

  return {
    filters,
    updateFilters,
    filteredQuizzes,
  }
}
