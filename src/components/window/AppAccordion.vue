<template>
  <transition
    @beforeLeave="open"
    @leave="close"
    @enter="open"
    @afterEnter="after"
  >
    <div v-show="isOpen" ref="root">
      <slot />
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, onBeforeUpdate } from 'vue'

export default defineComponent({
  props: {
    isOpen: {
      type    : Boolean,
      required: true,
    },
  },
  setup(props) {
    const root = ref(null)

    const open  = el => setSize(el, ...getSize())
    const close = el => setSize(el, 0)
    const after = el => setSize(el, 'auto')

    const setSize = (el, width, height) => {
      el.style.width = width
      el.style.height = height ?? width
    }

    // MEMO: enter時に取得されるscrollWidthがpadding-rightを含まないため、
    //   ->: 複製した要素で正確なscroll(Width/Height)を取得している。
    const getSize = () => {
      const clone = createClone()
      const sandBox = createSandBox()

      sandBox.appendChild(clone)
      document.body.appendChild(sandBox)
      const { scrollWidth, scrollHeight } = clone
      document.body.removeChild(sandBox)

      return [scrollWidth + 'px', scrollHeight + 'px']
    }

    const createClone = () => {
      const clone = root.value.cloneNode(true)
      setSize(clone, 'auto')
      return clone
    }

    const createSandBox = () => {
      const sandBox = document.createElement('div')
      sandBox.style.position = 'absolute'
      return sandBox
    }

    // MEMO: before-leaveではtransitionに間に合わないためonBeforeUpdateを使用している
    onBeforeUpdate(() => {
      if (props.isOpen === false) open(root.value)
    })

    return { root, open, close, after }
  },
})
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all .3s ease-in-out !important;
}
.v-leave-to,
.v-enter-from {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
