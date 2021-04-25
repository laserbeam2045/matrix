<template>
  <div class="scrollable-container" :style="containerStyle">
    <div v-scroll="onScroll" v-resize="onResize" class="scrollable">
      <slot />
    </div>
    <div class="scrollbar" :style="scrollbarStyle">
      <div class="progress" :style="progressStyle" />
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue'
import useScroll from '@/composables/useScroll'

export default defineComponent({
  props: {
    width: {
      type: String,
      required: false,
      default: '100%',
    },
    height: {
      type: String,
      required: false,
      default: '100%',
    },
    position: {
      type: String,
      required: false,
      default: 'right',
      validator(value) {
        return [
          'top',
          'left',
          'right',
          'bottom'
        ].includes(value)
      },
    },
  },
  setup(props) {
    const { width, height, position } = toRefs(props)

    const {
      onScroll,
      onResize,
      containerStyle,
      scrollbarStyle,
      progressStyle,
    } = useScroll({ width, height, position })

    return {
      containerStyle,
      scrollbarStyle,
      progressStyle,
      onScroll,
      onResize,
    }
  }
})
</script>

<style lang="scss" scoped>
%gradient {
  background: linear-gradient(to top, #008aff, #00ffe7);
}

@keyframes animate {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(360deg);
  }
}

.scrollable-container {
  position: relative;

  .scrollable {
    @extend %size100p;
    @include overflowScrolling;
    &::-webkit-scrollbar { display: none; }
  }

  .scrollbar {
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 0 0 8px 0;

    .progress {
      transition: all .1s;
      animation: animate 5s linear infinite;
      @extend %size100p;
      @extend %gradient;

      &::before {
        position: absolute;
        content: '';
        filter: blur(10px);
        @extend %size100p;
        @extend %gradient;
      }
      &::after {
        position: absolute;
        content: '';
        filter: blur(30px);
        @extend %size100p;
        @extend %gradient;
      }
    }
  }
}
</style>