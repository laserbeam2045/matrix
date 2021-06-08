import { Ref, ref, unref, computed } from 'vue'
import { Quizzes } from 'types/api'

export default function useQuizStringSearch(quizzes: Ref<Quizzes>) {
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
