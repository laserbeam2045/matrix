<template>
  <div
    v-center
    v-draggable
    v-resizable
    class="virtual-window"
  >
    <div class="contents-wrapper">
      <div class="header draggable-handle">
        <slot name="header" />
      </div>
      <slot />
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
    <AppVirtualWindowLegend :legend="legend" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    legend: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
$windowBoxShadow:
  $outColor   $out-H-Offset    $out-V-Offset  $outBlur $outSpread,        // 外側右下
  $outColor (-$out-H-Offset)   $out-V-Offset  $outBlur $outSpread,        // 外側左下
  $outColor (-$out-H-Offset) (-$out-V-Offset) $outBlur $outSpread,        // 外側左上
  $outColor   $out-H-Offset  (-$out-V-Offset) $outBlur $outSpread,        // 外側右上
  $inColorH    $in-H-Offset                0   $inBlur  $inSpread inset,  // 内側左
  $inColorH  (-$in-H-Offset)               0   $inBlur  $inSpread inset,  // 内側右
  $inColorV               0   (-$in-V-Offset)  $inBlur  $inSpread inset,  // 内側下
  $inColorV               0     $in-V-Offset   $inBlur  $inSpread inset;  // 内側上

// 外枠のスタイル
.virtual-window {
  position: absolute;
  max-width: 100%;
  max-height: 90%;
  color: $blueLikeColor6;
  border: 1px solid $blueLikeColor6;
  border-radius: 8px;
  box-shadow: $windowBoxShadow;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .contents-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    text-align: center;
    border-radius: 0 0 8px 8px;

    .header {
      height: auto;
      padding-top: $windowHeaderItemSize;

      @if $test { background: $greenLikeColor1; }
    }
    .footer {
      @if $test { background: $greenLikeColor1; }
    }
  }
}

body.light-theme {
  .virtual-window {
    color: $windowLightTextColor;
    background: $windowLightBackground;
  }
}
body.dark-theme {
  .virtual-window {
    color: $windowDarkTextColor;
    background: $windowDarkBackground;
  }
}
</style>