import { ref, unref, computed } from 'vue'

export default function useQuizStringSearch(quizzes) {
  const searchQuery = ref('')

  const quizzesMatchingSearchQuery = computed(() => {
    return unref(quizzes).filter(quiz => {
      return (
        quiz.answer1.includes(searchQuery.value) ||
        quiz.answer2.includes(searchQuery.value) ||
        quiz.question.includes(searchQuery.value)
      )
    })
  })

  return {
    searchQuery,
    quizzesMatchingSearchQuery,
  }
}
