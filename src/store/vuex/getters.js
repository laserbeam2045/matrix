
export default {

  // タグツリーのルートを返す(オブジェクト)
  rootTag({ quizTags }) {
    return quizTags.filter(tag => tag.parentId === null)[0]
  },

  // タグ(=id)直下のタグのidを返す(配列)
  childTagsOf: ({ quizTags }) => (id) => {
    return quizTags.filter(tag => tag.parentId === id)
  },

  // タグのデータ(表形式)を木構造に起こす
  tagTree: (_, getters) => (parentNode) => {
    if (parentNode === undefined) {
      parentNode = getters.rootTag
    }
    if (parentNode === undefined) {
      return null
    }
    parentNode = JSON.parse(JSON.stringify(parentNode))
    parentNode.children = getters.childTagsOf(parentNode.id)
    parentNode.children.forEach((child, idx, arr) => {
      arr[idx] = getters.tagTree(child)
    })
    return parentNode
  },
}