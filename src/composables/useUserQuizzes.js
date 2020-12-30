import { fetchUserQuizzes } from '@/api/quizzes'
import { ref, onMounted, watch } from 'vue'

export default function useUserQuizzes(user) {
  const quizzes = ref([])
  const getUserQuizzes = async () => {
    quizzes.value = await fetchUserQuizzes(user.value)
  }

  onMounted(getUserQuizzes)
  watch(user, getUserQuizzes)

  return {
    quizzes,
    getUserQuizzes,
  }
}