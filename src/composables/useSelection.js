import { reactive, readonly } from 'vue'

// セレクションの範囲を取得する関数
const getSelectionRange = () => {
  const selection = window.getSelection()
  if (selection.rangeCount) {
    return selection.getRangeAt(0)
  }
}

// セレクションの範囲を変更する関数
const setSelectionRange = (startContainer, startOffset, endContainer, endOffset) => {
  const selection = window.getSelection()
  const range = document.createRange()
  range.setStart(startContainer, startOffset)
  range.setEnd(endContainer, endOffset)
  selection.removeAllRanges()
  selection.addRange(range)
}

// 現在のセレクションの範囲を、Textベースに変換して返す関数
const getCurrentTextualOffset = rootNode => {
  const range = getSelectionRange()
  const startOffset = getTextualOffset(rootNode, range.startContainer, range.startOffset)
  const endOffset   = getTextualOffset(rootNode, range.endContainer, range.endOffset)
  return { startOffset, endOffset }
}

// DOMツリーの特定のノードに関連付けられたoffsetを、
// DOMツリーにテキストノードだけが存在すると考えた場合のoffsetとして取得する関数
const getTextualOffset = (node, container, offset) => {
  const iterationLimit = (node === container) ? offset : node.childNodes.length
  let textLengthSum = 0
  switch (node.nodeType) {
  case Node.ELEMENT_NODE:
    for (let i = 0; i < iterationLimit; i++) {
      const childNode = node.childNodes.item(i)
      textLengthSum += getTextualOffset(childNode, container, offset)
      if (childNode.contains(container)) break
    }
    break
  case Node.TEXT_NODE:
    textLengthSum = (node === container) ? offset : node.length
    break
  default:
    console.error(`Unexpected node type [${node.nodeType}].`)
  }
  return textLengthSum
}

// getTextualOffsetの逆の計算を行う関数
const getElementalOffset = (node, offset) => {
  let textLengthSum = 0
  switch (node.nodeType) {
  case Node.ELEMENT_NODE:
    if (offset === 0) return [node, offset]
    for (const childNode of node.childNodes) {
      const value = getElementalOffset(childNode, offset - textLengthSum)
      if (typeof(value) === 'object') return value
      if (typeof(value) === 'number') textLengthSum += value
    }
    break
  case Node.TEXT_NODE:
    return (offset <= node.length) ? [node, offset] : node.length
  default:
    console.error(`Unexpected node type [${node.nodeType}].`)
  }
  return textLengthSum
}


// テキストの選択範囲を扱うモジュール
export default function useSelection() {

  // 簡易的に記録される選択範囲
  const localRange = reactive({
    startOffset: 0,
    endOffset: 0,
  })

  // localRangeの値を、相対的に変更する関数
  const setLocalRangeBy = (start, end) => {
    localRange.startOffset += start
    localRange.endOffset += (end === undefined) ? start : end
  }

  // localRangeの値を、絶対的に変更する関数
  const setLocalRangeTo = (start, end) => {
    localRange.startOffset = start
    localRange.endOffset = (end === undefined) ? start : end
  }

  // 現在のセレクションの範囲を、Textベースに変換して記録する関数
  const recordLocalRange = rootNode => {
    const { startOffset, endOffset } = getCurrentTextualOffset(rootNode)
    setLocalRangeTo(startOffset, endOffset)
  }

  // localRangeによる範囲を、セレクションに適用する関数
  const applyLocalRange = rootNode => {
    const [startContainer, startOffset] = getElementalOffset(rootNode, localRange.startOffset)
    const [endContainer,     endOffset] = getElementalOffset(rootNode, localRange.endOffset)
    setSelectionRange(startContainer, startOffset, endContainer, endOffset)
  }

  // キャレットの位置が前回記録時から変化していないときに真を返す関数
  const isNotCaretMoved = rootNode => {
    const { startOffset: oldStart, endOffset: oldEnd } = localRange
    const { startOffset: newStart, endOffset: newEnd } = getCurrentTextualOffset(rootNode)
    return (oldStart === newStart && oldEnd === newEnd)
  }

  return {
    localRange: readonly(localRange),
    setLocalRangeBy,
    setLocalRangeTo,
    recordLocalRange,
    applyLocalRange,
    isNotCaretMoved,
  }
}