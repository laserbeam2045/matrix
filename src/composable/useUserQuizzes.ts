import { Ref, ref, onMounted, watch } from 'vue'
import { fetchUserQuizzes } from 'api/quizzes'
import { User } from 'types/users'
import { Quizzes } from 'types/api'

export default function useUserQuizzes() {
  const user: Ref<User> = ref({
    profile: {
      name         : 'Neo',
      iconSource   : '',
      bulletinBoard: '',
    },
  })

  const quizzes: Ref<Quizzes> = ref([])

  const getUserQuizzes = async () => {
    quizzes.value = await fetchUserQuizzes(user.value)
  }

  // 引数のidの問題を取得する関数
  const getUserQuiz = (id: number) => quizzes.value.find(quiz => quiz.id === id)

  onMounted(getUserQuizzes)
  watch(user, getUserQuizzes)

  return {
    quizzes,
    getUserQuiz,
    getUserQuizzes,
  }
}
