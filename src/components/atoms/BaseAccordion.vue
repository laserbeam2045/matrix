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
      <div class="sand-box" />
      <slot />
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, onBeforeUpdate } from 'vue'

export default defineComponent({
  name: 'BaseAccordion',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const root = ref(null)

    const open = el => {
      const { width, height } = getSize()
      setSize(el, width + 'px', height + 'px')
    }
    const close = el => setSize(el, 0)
    const after = el => setSize(el, 'auto')

    // MEMO: enter時に取得するscrollWidthがpadding-rightを含まないため、
    //   ->: 複製した要素で正確なscroll(Width/Height)を取得している。
    const getSize = () => {
      const clone = root.value.cloneNode(true)
      const sandBox = root.value.querySelector('.sand-box')
      setSize(clone, 'auto')
      sandBox.appendChild(clone)
      const width = clone.scrollWidth
      const height = clone.scrollHeight
      sandBox.removeChild(clone)
      return { width, height }
    }
    const setSize = (el, width, height) => {
      el.style.width = width
      el.style.height = (height === undefined) ? width : height
    }

    // MEMO: before-leaveではtransitionに間に合わないためonBeforeUpdateを使用している
    onBeforeUpdate(() => {
      if (!props.isOpen) open(root.value)
    })

    return {
      root,
      open,
      close,
      after,
    }
  }
})
</script>

<style scoped>
.sand-box {
  position: absolute;
}
.v-enter-active,
.v-leave-active {
  transition: all .5s;
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