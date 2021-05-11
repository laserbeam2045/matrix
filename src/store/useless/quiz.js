import { reactive, ref, readonly, provide, inject } from 'vue'
import { getRequest } from '@/api/request_methods'

const storeSymbol = Symbol('quiz')
const API_ADDRESS = process.env.VUE_APP_API_SELECT_QUIZZES

const createStore = () => {
  const quizzes = ref([])

  const state = reactive({
    error  : null,
    loaded : false,
    loading: false,
  })

  const load = async() => {
    state.loading = true
    try {
      quizzes.value = await getRequest(API_ADDRESS)
      state.loaded = true
    } catch (e) {
      state.error = e
    } finally {
      state.loading = false
    }
  }

  // 引数のidの問題を取得する関数
  const find = id => quizzes.value.find(quiz => quiz.id === id)

  return {
    quizzes: readonly(quizzes),
    state  : readonly(state),
    load,
    find,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)
