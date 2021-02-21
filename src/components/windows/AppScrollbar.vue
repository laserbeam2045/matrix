<template>
  <div class="scrollbar" :style="{ top, left, width, height }">
    <div class="path" />
    <div class="progress" :style="{ height: progress }" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    top: {
      type: String,
      required: true,
    },
    left: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    progress: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
%common {
  position: absolute;
  width: 100%;
  height: 100%;
}

%gradient {
  background: linear-gradient(to top, #008aff, #00ffe7);
}

@keyframes animate {
  0%, 100% 
  {
    filter: hue-rotate(0deg);
  }
  50%
  {
    filter: hue-rotate(360deg);
  }
}

.scrollbar {
  position: fixed;

  .path {
    @extend %common;

    background: rgba(255, 255, 255, 0.15);
  }
  .progress {
    @extend %common;
    @extend %gradient;

    animation: animate 5s linear infinite;

    &::before {
      content: '';
      @extend %common;
      @extend %gradient;

      filter: blur(10px);
    }
    &::after {
      content: '';
      @extend %common;
      @extend %gradient;

      filter: blur(30px);
    }
  }
}
</style>