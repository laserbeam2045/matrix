<template>
  <div class="header-item-box">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'HeaderItemBox',
}
</script>

<style scoped>
.header-item-box {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
</style>