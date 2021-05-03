<template>
  <div
    v-center
    v-draggable
    class="virtual-window"
    :style="{ width, height }"
  >
    <div class="buttons">
      <slot name="buttons" />
    </div>
    <div class="header draggable-handle">
      <slot name="header" />
    </div>
    <div class="body">
      <slot />
    </div>
    <div class="footer">
      <slot name="footer" />
    </div>
    <AppVirtualWindowLegend :legend="legend" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    width: {
      type   : String,
      default: 'auto',
    },
    height: {
      type   : String,
      default: 'auto',
    },
    legend: {
      type   : [String, Object],
      default: 'TEST',
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
  display: flex;
  flex-direction: column;
  width: auto;
  max-width: 100vw;
  height: auto;
  max-height: 100vh;
  color: $blueLikeColor6;
  text-align: center;
  border: 1px solid $blueLikeColor6;
  border-radius: 8px;
  box-shadow: $windowBoxShadow;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .buttons {
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
  }
  .header {
    width: 100%;
    height: auto;
    padding-top: $windowHeaderItemSize;
    @if $test { background: $greenLikeColor1; }
  }
  .body {
    width: 100%;
    min-width: 0;
    height: auto;
    min-height: 0;
  }
  .footer {
    width: 100%;
    height: auto;
    @if $test { background: $greenLikeColor1; }
  }
}

.main.dark {
  .virtual-window {
    color: $windowDarkTextColor;
    background: $windowDarkBackground;
  }
}
.main.light {
  .virtual-window {
    color: $windowLightTextColor;
    background: $windowLightBackground;
  }
}
.main.classic {
  .virtual-window {
    color: $windowLightTextColor;
    background: $windowLightBackground;
  }
}
</style>
