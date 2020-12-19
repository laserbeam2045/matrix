<template>
  <button>
    <slot>Submit</slot>
  </button>
</template>

<script>
export default {
  name: 'button-basic-atom',
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/text';
@import '@/assets/style/colors';

button {
  margin: 0 auto;
  padding: 4px 8px;
  color: $grayLikeColor3;
  background: transparent;
  border-radius: 5px;
  border: 1px solid $grayLikeColor3;
  font-family: $fontFamily3;
  transition: all .1;
  cursor: pointer;

  &:hover {
    color: $blueLikeColor6;
    border-color: $blueLikeColor6;
  }
}
</style>