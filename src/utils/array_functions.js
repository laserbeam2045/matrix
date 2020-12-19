
/* 配列の操作に関する関数 */

// 配列をシャッフルする関数
export const shuffle = ([...arr]) => {
  let m = arr.length
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]]
  }
  return arr
}

// 配列に要素を追加する関数
export const addToArray = (arr, val) => {
  const length = arr.length
  arr.splice(length, 0, val)
}

// 配列から要素を削除する関数
export const delFromArray = (arr, val) => {
  const index = arr.indexOf(val)
  arr.splice(index, 1)
}

// 配列の最後の要素を返す関数
export const lastOf = arr => {
  return arr.slice(-1)[0]
}

// オブジェクトをディーブコピーする関数
export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}