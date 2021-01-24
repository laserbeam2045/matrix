<template>
  <div
    v-scroll="onScroll"
    class="scrollable"
    :style="{ width, height }"
  >
    <slot />
    <AppScrollbar v-bind="scrollbarProps" />
  </div>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  props: {
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
  },
  setup() {
    const state = reactive({
      clientRect: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
      scrollTop: 0,
      scrollHeight: 0,
    })

    // 表示されない領域の高さ
    const denominator = computed(() => {
      return state.scrollHeight - state.clientRect.height
    })

    // これまでに表示された領域の高さ
    const numerator = computed(() => {
      return denominator.value - state.scrollTop
    })

    // これまでに表示された割合（0~1）
    const progress = computed(() => {
      return 1 - numerator.value / denominator.value
    })

    const onScroll = (evt, el) => {
      const { top, left, width, height } = el.getBoundingClientRect()
      state.clientRect = { top, left, width, height }
      state.scrollTop = el.scrollTop
      state.scrollHeight = el.scrollHeight
    }

    const scrollbarProps = computed(() => {
      const { top, left, width, height } = state.clientRect

      return {
        top: top + 'px',
        left: left + 'px',
        right: (left + width - 5) + 'px',
        width: width + 'px',
        height: height + 'px',
        progress: (progress.value * 100) + '%',
      }
    })

    return { onScroll, scrollbarProps }
  }
}
</script>

<style lang="scss" scoped>
.scrollable {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-right: $scrollbarThickness;

  // ブラウザのスクロールバーは表示しない
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>