<template>
  <div
    class="header-item"
    :class="{ active }"
    @click="$emit('click')"
  >
    <AppFontAwesome :name="name" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type    : String,
      required: true,
    },
    active: {
      type   : Boolean,
      default: false,
    },
  },
  emits: ['click'],
})
</script>

<style lang="scss" scoped>
.header-item {
  display: inline-block;
  width: $windowHeaderItemSize;
  height: $windowHeaderItemSize;
  font-size: $windowHeaderItemSize * 0.6;
  font-weight: normal;
  line-height: $windowHeaderItemSize;
  text-align: center;
  pointer-events: auto;
  @if $test { background: yellow; }

  &.active {
    color: green;
    transition: all .2s;
  }
  &:hover,
  &:focus {
    color: orange;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
