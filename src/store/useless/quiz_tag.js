import { reactive, ref, computed, watch, readonly, provide, inject } from 'vue'
import { getRequest } from '@/api/request_methods'

const storeSymbol = Symbol('quizTag')
const API_ADDRESS = process.env.VUE_APP_API_SELECT_TAG

const createStore = () => {
  const state = reactive({
    error  : null,
    loaded : false,
    loading: false,
  })

  const data = ref(null)
  const tree = ref(null)

  // エラーをコンソールで監視する
  watch(() => state.error, e => console.error(e))

  const root = computed(() => {
    if (data.value)
      return data.value.find(tag => tag.parentId === null)
    else
      return null
  })

  const load = async() => {
    state.loading = true
    try {
      data.value = await getRequest(API_ADDRESS)
      tree.value = getStruct(root.value)
      state.loaded = true
    } catch (e) {
      state.error = e
    } finally {
      state.loading = false
    }
  }

  // タグのデータ(配列)を木構造に起こす関数
  const getStruct = parentNode => {
    if (!parentNode) return null
    // parentNode = JSON.parse(JSON.stringify(parentNode))
    parentNode.children = childrenOf(parentNode.id)
    parentNode.children.forEach((child, idx, arr) => {
      arr[idx] = getStruct(child)
    })
    return parentNode
  }

  // 引数のidのタグを取得する関数
  const find = id => data.value.find(tag => tag.id === id)

  // 引数のidのタグの直下のタグを取得する関数
  const childrenOf = id => data.value.filter(tag => tag.parentId === id)

  return {
    data : readonly(data),
    state: readonly(state),
    root,
    tree,
    load,
    find,
    childrenOf,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)
