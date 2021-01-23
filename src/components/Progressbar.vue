<template>
  <div
    v-scroll="onScroll"
    class="app-progressbar"
  >
    <div class="container">
      <div
        class="path"
        :style="rootStyle"
      />
      <div
        class="progress"
        :style="progressStyle"
      />
    </div>
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
  name: 'Progressbar',
  setup() {
    const rootHeight = ref(650)
    const progressHeight = ref(0)

    const rootStyle = computed(() => ({
      height: rootHeight.value + 'px'
    }))

    const progressStyle = computed(() => ({
      height: progressHeight.value + '%'
    }))

    const onScroll = (evt, el) => {
      const totalHeight = el.scrollHeight
      const scrollTop = el.scrollTop
      progressHeight.value = (scrollTop / totalHeight) * 100 + 11
      console.log(progressHeight.value)
    }

    onMounted(() => {

    })

    return { rootStyle, progressStyle, onScroll }
  }
})
</script>

<style lang="scss" scoped>
$color1: #008aff;
$color2: #00ffe7;
$color3: rgba(255,255,255,0.1);

@keyframes animate {
  0%,
  100% { filter: hue-rotate(0deg); }
  50%  { filter: hue-rotate(360deg); }
}

.app-progressbar {
  position: relative;
  height: 100%;
  padding: 15px 20px 20px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;  // iOS用

  .container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: $windowScrollbarWidth;
    // height: 100%;

    .path {
      position: fixed;
      width: $windowScrollbarWidth;
      // height: 100%;
      background: $color3;
    }
    .progress {
      position: fixed;
      width: $windowScrollbarWidth;
      background: linear-gradient(to top, $color1, $color2);
      animation: animate 5s linear infinite;
      border-radius: 3px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, $color1, $color2);
        filter: blur(10px);
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, $color1, $color2);
        filter: blur(30px);
      }
    }
  }
}
</style>