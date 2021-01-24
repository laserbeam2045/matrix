<template>
  <div class="virtual-window-contents">
    <div :class="['header', handleClass]">
      <slot name="header" />
    </div>

    <slot />

    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    handleClass: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.virtual-window-contents {
  height: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  border-radius: 0 0 8px 8px;
  overflow: hidden;

  .header {
    height: auto;
    padding-top: $windowHeaderItemSize;

    @if $test { background: $greenLikeColor1; }
  }

  // フッターのスタイル
  .footer {
    @if $test { background: $greenLikeColor1; }
  }
}
</style>