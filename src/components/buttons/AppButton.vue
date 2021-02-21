<template>
  <button class="app-button">
    <slot>Submit</slot>
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss" scoped>
.app-button {
  padding: 4px 8px;
  margin: 0 auto;
  font-family: $font-family-orbitron;
  color: $grayLikeColor3;
  cursor: pointer;
  background: transparent;
  border: 1px solid $grayLikeColor3;
  border-radius: 5px;
  transition: all .1;

  &:hover {
    color: $blueLikeColor6;
    border-color: $blueLikeColor6;
  }
}
</style>