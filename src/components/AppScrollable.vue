<template>
  <div
    v-scroll="onScroll"
    class="scrollable"
    :style="{ width, height, ...containerStyle }"
  >
    <slot />
    <AppScrollbar v-bind="scrollbarProps" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import useScroll from '@/composables/useScroll'

export default defineComponent({
  props: {
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: false,
      default: 'Right',
      validator(value) {
        return [
          'Top',
          'Left',
          'Right',
          'Bottom'
        ].includes(value)
      },
    },
  },
  setup(props) {
    const {
      onScroll,
      containerStyle,
      scrollbarProps,
    } = useScroll(props.position)

    return { onScroll, containerStyle, scrollbarProps }
  }
})
</script>

<style lang="scss" scoped>
.scrollable {
  @include overflowScrolling;

  // ブラウザのスクロールバーは表示しない
  &::-webkit-scrollbar { display: none; }
}
</style>