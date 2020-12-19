import { reactive, ref, readonly, provide, inject } from 'vue'
import { getRequest } from '@/api/request_methods'
import { API_ADDRESS } from '@/store/constants'

const storeSymbol = Symbol('quiz')

const createStore = () => {
  const data = ref(null)

  const state = reactive({
    error: null,
    loaded: false,
    loading: false,
  })

  const load = async() => {
    state.loading = true
    try {
      data.value = await getRequest(API_ADDRESS.SELECT_QUIZZES)
      state.loaded = true
    } catch(e) {
      state.error = e
    } finally {
      state.loading = false
    }
  }

  // 引数のidの問題を取得する関数
  const find = id => data.value.find(quiz => quiz.id === id)

  return {
    data: readonly(data),
    state: readonly(state),
    load,
    find,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)