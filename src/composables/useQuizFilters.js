import { ref, unref, computed } from 'vue'

export default function useQuizFilters(quizzes) {
  const filters = ref([
    // quiz => quiz.tagIds.some(id => activeTagIds.value.has(id)),
    quiz => quiz.tagIds.length === 0,
  ])

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
    updateFilters,
    filteredQuizzes,
  }
}