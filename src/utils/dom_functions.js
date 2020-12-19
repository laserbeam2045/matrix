import { isRef, unref } from 'vue'

/* DOMの操作に関する関数 */

// 第一引数から見て直近の、第二引数の条件を満たす祖先要素を返す関数
export const getClosestElement = (element, conditionFunc, limit = 30) => {
  for (let i = 0; i <= limit; i++) {
    element = element.parentElement
    if (conditionFunc(element)) {
      return element
    } else if (element === null) {
      console.error('Component could not find element.')
      return null
    }
  }
}

// 第一引数がHTML要素かどうかを返す関数
export const isElement = obj => {
  try {
    return obj instanceof HTMLElement
  } catch(e) {
    return (
      (typeof obj === 'object') &&
      (obj.nodeType === Node.ELEMENT_NODE) &&
      (typeof obj.style === 'object') &&
      (typeof obj.ownerDocument === 'object')
    )
  }
}

// HTML要素を得る糖衣構文
export const getElement = obj => {
  if (isElement(obj)) {
    return obj
  } else if (isRef(obj)) {
    return unref(obj).$el
  } else {
    return obj.$el
  }
}