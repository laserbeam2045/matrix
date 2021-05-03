// An array class that can be used like the Set class
export default class SuperArray extends Array {

  constructor(arr = []) {
    super()
    if (Array.isArray(arr)) {
      arr.forEach(value => this.push(value))
    }
  }

  // Returns the number of values in the SuperArray object.
  get size() {
    return this.length
  }

  // Returns the first element
  get first() {
    return this[0]
  }

  // Returns the last element
  get last() {
    return this[this.length - 1]
  }

  // 最後の要素のインデックス
  get lastIndex() {
    return this.length - 1
  }

  // Returns a boolean asserting whether an element is
  // present with the given value in the SuperArray object or not.
  has(value) {
    return this.includes(value)
  }

  // Appends value to the SuperArray object.
  // Returns the SuperArray object.
  add(value) {
    if (!this.includes(value)) {
      this.splice(this.length, 0, value)
    }
    return this
  }

  // Removes the element associated to the value
  // and returns a boolean asserting whether
  // an element was successfully removed or not.
  delete(value) {
    if (this.includes(value)) {
      this.splice(this.indexOf(value), 1)
      return true
    } else {
      return false
    }
  }

  // Removes all elements from the SuperArray object.
  clear() {
    while (this.length) this.shift()
  }

  // Expansion like element.classList.toggle method.
  toggle(value) {
    if (this.includes(value)) {
      this.splice(this.indexOf(value), 1)
      return false
    } else {
      this.splice(this.length, 0, value)
      return true
    }
  }

  /**
   * 第一引数のindexにある要素を、第二引数のindexに移動させるメソッド
   * @param {number} from 移動元のindex
   * @param {number} to   移動先のindex
   * @return {boolean} 移動できたかどうか
   */
  move(from, to) {
    if (
      from === to ||
      this.length <= to ||
      this.length <= from
    ) return false

    const target = this[from]
    const tail = this.slice(from + 1)

    this.splice(from)
    this.push(...tail)
    this.splice(to, 0, target)

    return true
  }
}
