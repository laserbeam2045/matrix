<template>
  <button class="app-button">
    <slot>Submit</slot>
  </button>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.app-button {
  margin: 0 auto;
  padding: 4px 8px;
  color: $grayLikeColor3;
  background: transparent;
  border-radius: 5px;
  border: 1px solid $grayLikeColor3;
  font-family: $font-family-orbitron;
  transition: all .1;
  cursor: pointer;

  &:hover {
    color: $blueLikeColor6;
    border-color: $blueLikeColor6;
  }
}
</style>