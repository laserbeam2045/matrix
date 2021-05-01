import { fetchUserQuizzes } from '@/api/quizzes'
import { ref, onMounted, watch } from 'vue'

export default function useUserQuizzes() {
  const user = ref({
    profile: {
      name: 'Neo',
    },
  })

  const quizzes = ref([])

  const getUserQuizzes = async () => {
    quizzes.value = await fetchUserQuizzes(user.value)
  }

  // 引数のidの問題を取得する関数
  const getUserQuiz = id => quizzes.value.find(quiz => quiz.id === id)

  onMounted(getUserQuizzes)
  watch(user, getUserQuizzes)

  return {
    quizzes,
    getUserQuiz,
    getUserQuizzes,
  }
}
