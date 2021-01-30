<template>
  <div class="header-item-box">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss" scoped>
.header-item-box {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
</style>