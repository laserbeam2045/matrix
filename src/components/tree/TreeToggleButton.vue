<template>
  <div class="tree-toggle-button" :class="{ open: isOpen }">
    ▼
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isOpen: {
      type    : Boolean,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.tree-toggle-button {
  @include unSelectable;

  display: inline-block;
  width: 30px;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  cursor: pointer;
  transition: all .5s;

  &:not(.open) {
    @include textStyleA;

    transform: rotate(-90deg);
  }
}
</style>
