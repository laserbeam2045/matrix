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
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
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
  line-height: $windowHeaderItemSize;
  font-weight: normal;
  text-align: center;
  pointer-events: auto;
  @if $test { background: yellow; }

  &.active {
    transition: all .2s;
    color: green;
  }
  &:hover,
  &:focus {
    color: orange;
    cursor: pointer;
    text-decoration: none;
  }
}
</style>