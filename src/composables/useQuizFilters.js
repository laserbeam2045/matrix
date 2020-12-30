import { ref, unref, computed } from 'vue'
import Aset from '@/utils/Aset'

export default function useQuizFilters(quizzes) {
  const filters = ref([
    // quiz => quiz.tagIds.some(id => activeTagIds.value.has(id)),
    // quiz => quiz.tagIds.length === 0,
  ])
  const activeTagIds = ref(new Aset())

  const updateFilters = () => {}

  const filteredQuizzes = computed(() => {
    let tmpQuizzes = unref(quizzes)
    filters.value.forEach(filter => {
      tmpQuizzes = tmpQuizzes.filter(filter)
    })
    return tmpQuizzes
  })

  return {
    filters,
    activeTagIds,
    updateFilters,
    filteredQuizzes,
  }
}