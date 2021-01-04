import { ref, onMounted, watch, computed } from 'vue'
import { fetchQuizTags } from '@/api/tags'
import Aset from '@/utilities/Aset'

export default function useQuizTags(user) {
  const tags = ref([])
  const tree = computed(() => root.value ? getStruct(root.value) : {})
  const activeTagIds = ref(new Aset())

  const getQuizTags = async () => {
    tags.value = await fetchQuizTags(user.value)
  }

  // 引数のidのタグを取得する関数
  const getQuizTag = id => tags.value.find(tag => tag.id === id)

  // 引数のidのタグの直下のタグを取得する関数
  const childrenOf = id => tags.value.filter(tag => tag.parentId === id)

  const toggleActiveTagId = id => activeTagIds.value.toggle(id)

  const root = computed(() => {
    if (tags.value.length)
      return tags.value.find(tag => tag.parentId === null)
    else
      return null
  })

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

  onMounted(getQuizTags)
  watch(user, getQuizTags)

  return {
    tags,
    tree,
    activeTagIds,
    getQuizTag,
    getQuizTags,
    toggleActiveTagId,
  }
}