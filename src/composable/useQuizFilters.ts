import { Ref, ref, unref, computed } from 'vue'
import { Quiz, Quizzes } from 'types/api'

type Filter = (quiz: Quiz) => {}

export default function useQuizFilters(quizzes: Ref<Quizzes>) {
  // フィルター関数の配列
  const filters: Ref<Array<Filter>> = ref([])

  /**
   * フィルターを更新する関数
   * @param {function | array} newFilter
   */
  const updateFilters = (newFilter: Filter | Array<Filter>) => {
    filters.value = Array.isArray(newFilter) ? newFilter : [newFilter]
  }

  // フィルターにかけた結果として残るデータ
  const filteredQuizzes = computed(() => {
    let data = unref(quizzes)
    filters.value.forEach((filter: Filter) => {
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
