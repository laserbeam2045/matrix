/* eslint-disable semi */
import { reactive, readonly } from 'vue'

interface Containers {
  startContainer: Node
  endContainer: Node
}

interface Offsets {
  startOffset: number
  endOffset: number
}

type MyNode = Node | Text;

type MyArray = [MyNode, number];

// セレクションの範囲を取得する関数
const getSelectionRange = (): (Range | undefined) => {
  const selection = window.getSelection() as Selection
  if (selection.rangeCount) {
    return selection.getRangeAt(0)
  }
}

// セレクションの範囲を変更する関数
const setSelectionRange = (
  {
    startContainer,
    endContainer,
    startOffset,
    endOffset,
  } : (Containers & Offsets)
): void => {
  const selection = window.getSelection() as Selection
  const range = document.createRange()
  range.setStart(startContainer, startOffset)
  range.setEnd(endContainer, endOffset)
  selection.removeAllRanges()
  selection.addRange(range)
}

// 現在のセレクションの範囲を、Textベースに変換して返す関数
const getCurrentTextualOffset = (rootNode: MyNode): (Offsets | undefined) => {
  const range = getSelectionRange()
  if (range) {
    const { startContainer, endContainer, startOffset, endOffset } = range
    const s = getTextualOffset(rootNode, startContainer, startOffset)
    const e = getTextualOffset(rootNode, endContainer, endOffset)
    return { startOffset: s, endOffset: e }
  }
}

// DOMツリーの特定のノードに関連付けられたoffsetを、
// DOMツリーにテキストノードだけが存在すると考えた場合のoffsetとして取得する関数
const getTextualOffset = (node: MyNode, container: MyNode, offset: number): number => {
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
    textLengthSum = (node === container) ? offset : (<Text>node).length
    break
  default:
    console.error(`Unexpected node type [${node.nodeType}].`)
  }
  return textLengthSum
}

// getTextualOffsetの逆の計算を行う関数
const getElementalOffset = (node: MyNode, offset: number): (MyArray | number) => {
  let textLengthSum = 0
  let value: MyArray | number

  switch (node.nodeType) {
  case Node.ELEMENT_NODE:
    if (offset === 0) {
      return [node, offset]
    }
    for (const childNode of node.childNodes) {
      value = getElementalOffset(childNode, offset - textLengthSum)
      if (Array.isArray(value)) {
        return value
      } else {
        textLengthSum += value
      }
    }
    break
  case Node.TEXT_NODE:
    return (offset <= (<Text>node).length)
      ? [node, offset]
      : (<Text>node).length
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
    endOffset  : 0,
  })

  // localRangeの値を、相対的に変更する関数
  const setLocalRangeBy = (start: number, end: number) => {
    localRange.startOffset += start
    localRange.endOffset += (end === undefined) ? start : end
  }

  // localRangeの値を、絶対的に変更する関数
  const setLocalRangeTo = (start: number, end: number) => {
    localRange.startOffset = start
    localRange.endOffset = (end === undefined) ? start : end
  }

  // 現在のセレクションの範囲を、Textベースに変換して記録する関数
  const recordLocalRange = (rootNode: Node): void => {
    const { startOffset, endOffset } = getCurrentTextualOffset(rootNode) as Offsets
    setLocalRangeTo(startOffset, endOffset)
  }

  // localRangeによる範囲を、セレクションに適用する関数
  const applyLocalRange = (rootNode: Node): void => {
    const [startContainer, startOffset] = <MyArray>getElementalOffset(rootNode, localRange.startOffset);
    const [endContainer, endOffset] = <MyArray>getElementalOffset(rootNode, localRange.endOffset);

    setSelectionRange({ startContainer, endContainer, startOffset, endOffset })
  }

  // キャレットの位置が前回記録時から変化していないときに真を返す関数
  const isNotCaretMoved = (rootNode: HTMLElement) => {
    const { startOffset: oldStart, endOffset: oldEnd } = localRange
    const { startOffset: newStart, endOffset: newEnd } = getCurrentTextualOffset(rootNode) as Offsets

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
