<template>
  <div
    v-scroll="onScroll"
    class="progressbar-atom"
  >
    <div class="container">
      <div class="path" />
      <div
        class="progressbar"
        :style="progressStyle"
      />
    </div>
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'ProgressbarAtom',
  setup() {
    const progressHeight = ref(0)

    const progressStyle = computed(() => ({
      height: progressHeight.value + '%'
    }))

    const onScroll = (evt, el) => {
      const totalHeight = el.scrollHeight
      const scrollTop = el.scrollTop
      progressHeight.value = (scrollTop / totalHeight) * 100
      // console.log(progressHeight.value)
    }

    return { progressStyle, onScroll }
  }
})
</script>

<style lang="scss" scoped>
@keyframes animate {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(360deg);
  }
}

.progressbar-atom {
  position: relative;
  height: 100%;
  padding: 15px 20px 20px;
  overflow-y: scroll;
  // -webkit-overflow-scrolling: touch;  // iOS用

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: $windowScrollbarWidth;
    height: 100%;

    .path {
      position: fixed;
      width: $windowScrollbarWidth;
      height: 100%;
      background: rgba(255,255,255,0.05);
    }
    .progressbar {
      position: fixed;
      width: $windowScrollbarWidth;
      background: linear-gradient(to top, #008aff, #00ffe7);
      animation: animate 5s linear infinite;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, #008aff, #00ffe7);
        filter: blur(10px);
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, #008aff, #00ffe7);
        filter: blur(30px);
      }
    }
  }
}
</style>