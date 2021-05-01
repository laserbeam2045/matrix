<template>
  <button class="app-button-effects" @mouseenter="onMouseEnter">
    <div class="circle" :style="circleStyle" />
    <div class="container">
      <slot />
    </div>
  </button>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const circleStyle = reactive({
      top : 0,
      left: 0,
    })

    const onMouseEnter = e => {
      circleStyle.top = e.offsetY + 'px'
      circleStyle.left = e.offsetX + 'px'
    }

    return { circleStyle, onMouseEnter }
  },
})
</script>

<style lang="scss" scoped>
.app-button-effects {
  position: relative;
  padding: 10px 30px;
  overflow: hidden;
  font-family: $font-poppins;
  color: $green-poison;
  letter-spacing: 2px;
  border: 2px solid $green-poison;
  transition: 0.5s;
  @include unSelectable;

  .circle {
    position: absolute;
    width: 0;
    height: 0;
    background: $green-poison;
    border-radius: 50%;
    transition: width 0.5s, height 0.5s;
    transform: translate(-50%, -50%);
  }

  &:hover {
    color: $black-dreamless;

    .circle {
      width: 600px;
      height: 300px;
    }
  }

  .container {
    position: relative;
  }
}
</style>
