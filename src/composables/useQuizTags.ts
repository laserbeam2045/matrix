import { Ref, ComputedRef, ref, onMounted, watch, computed } from 'vue'
import { fetchQuizTags } from '@/api/tags'
import SuperArray from '@/utilities/SuperArray'

export type Tag = {
  id: number
  lft: number
  label: string
  parentId: number
  children: Array<Tag>
  quizCount: number
}
export type Tags = Array<Tag>
export type TagsRef = Ref<Tags>

const user = ref({
  profile: {
    name: 'Neo',
  },
})

export default function useQuizTags() {
  const tags: TagsRef = ref([])

  const root: ComputedRef = computed(() => {
    return tags.value.length
      ? tags.value.find((tag: Tag) => tag.parentId === null)
      : null
  })

  const tree: ComputedRef = computed(() =>
    root.value ? makeTree(root.value) : {})

  const activeTagIds = ref(new SuperArray())

  const getQuizTags = async () => {
    tags.value = await fetchQuizTags(user.value)
  }

  /**
   * 引数のidのタグを取得する関数
   * @param {number} id タグのid
   * @return {Tag}
   */
  const getQuizTag = (id: number): Tag | undefined =>
    tags.value.find((tag: Tag) => tag.id === id)

  /**
   * 引数のidのタグの直下のタグを取得する関数
   * @param {number} id タグのid
   * @return {Tags}
   */
  const childrenOf = (id: number): Tags =>
    tags.value.filter((tag: Tag) => tag.parentId === id)

  /**
   * タグの(活性/非活性)状態を入れ替える関数
   * @param id タグのid
   */
  const toggleActiveTagId = (id: number): void => {
    activeTagIds.value.toggle(id)
  }

  /**
   * タグのデータ(配列)を木構造に起こす関数
   * @param {Tag} parentNode 親ノード
   * @return {Tag}
   */
  const makeTree = (parentNode: Tag) => {
    parentNode.children = childrenOf(parentNode.id)
    parentNode.children.forEach((child: Tag, idx: number) => {
      parentNode.children[idx] = makeTree(child)
    })
    return parentNode
  }

  onMounted(getQuizTags)
  watch(user, getQuizTags)

  return {
    tags,
    tree,
    getQuizTag,
    getQuizTags,
    activeTagIds,
    toggleActiveTagId,
  }
}
