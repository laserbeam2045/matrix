// Array class usable like Set class
export default class Aset extends Array {

  constructor(arr = []) {
    super()
    if (Array.isArray(arr)) {
      arr.forEach(value => this.push(value))
    }
  }

  // Returns the number of values in the Aset object.
  get size() {
    return this.length
  }

  get head() {
    return this[0]
  }

  get tail() {
    return this[this.length - 1]
  }

  // Appends value to the Aset object.
  // Returns the Aset object.
  add(value) {
    if (!this.includes(value)) {
      this.splice(this.length, 0, value)
    }
    return this
  }

  // Removes all elements from the Aset object.
  clear() {
    while (this.length) this.shift()
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

  // Returns a boolean asserting whether an element is
  // present with the given value in the Aset object or not.
  has(value) {
    return this.includes(value)
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
}