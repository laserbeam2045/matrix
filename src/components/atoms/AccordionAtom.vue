<template>
  <transition
    @before-leave="open"
    @leave="close"
    @enter="open"
    @after-enter="after"
  >
    <div
      v-show="isOpen"
      ref="root"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, onBeforeUpdate } from 'vue'

export default defineComponent({
  name: 'AccordionAtom',
  props: {
    isOpen: {
      type: Boolean,
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
      el.style.height = height !== undefined ? height : width
    }

    // MEMO: enter時に取得されるscrollWidthがpadding-rightを含まないため、
    //   ->: 複製した要素で正確なscroll(Width/Height)を取得している。
    const getSize = () => {
      const clone = root.value.cloneNode(true)
      const sandBox = createSandBox()
      setSize(clone, 'auto')
      sandBox.appendChild(clone)
      root.value.appendChild(sandBox)
      const { scrollWidth, scrollHeight } = clone
      root.value.removeChild(sandBox)
      return [ scrollWidth + 'px', scrollHeight + 'px' ]
    }

    const createSandBox = () => {
      const sandBox = document.createElement('div')
      sandBox.style.position = 'absolute'
      return sandBox
    }

    // MEMO: before-leaveではtransitionに間に合わないためonBeforeUpdateを使用している
    onBeforeUpdate(() => {
      if (!props.isOpen) open(root.value)
    })

    return { root, open, close, after }
  }
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all .5s !important;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>