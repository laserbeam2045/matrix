<template>
  <div
    class="scrollbar"
    :style="{ top, left: right, height }"
  >
    <div
      class="scroll-path"
      :style="{ height }"
    />
    <div
      class="scroll-progress"
      :style="{ height: progress }"
    />
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
    right: {
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
.gradient {
  background: linear-gradient(to top, #008aff, #00ffe7);
}

@keyframes animate {
  0%,
  100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(360deg);
  }
}

@mixin effect($blur) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur($blur);
}

.scrollbar {
  position: fixed;
  width: $scrollbarThickness;

  .scroll-path {
    position: absolute;
    width: $scrollbarThickness;
    background: rgba(255, 255, 255, 0.2);
  }
  .scroll-progress {
    position: absolute;
    width: $scrollbarThickness;
    border-radius: 0 0 5px 5px;
    @extend .gradient;
    animation: animate 5s linear infinite;

    &::before {
      @extend .gradient;
      @include effect(10px);
    }
    &::after {
      @extend .gradient;
      @include effect(30px);
    }
  }
}
</style>