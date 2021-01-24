<template>
  <div :class="{ open: isOpen }">
    ▼
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  @include unSelectable;
  display: inline-block;
  width: 30px;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  transition: all .5s;
  cursor: pointer;
  
  &:not(.open) {
    @include textStyleA;
    transform: rotate(-90deg);
  }
}
</style>