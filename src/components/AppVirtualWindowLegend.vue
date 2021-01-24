<template>
  <legend
    v-if="legend.text"
    :class="legend.type"
    v-on="events"
  >
    <div />
    <div><div /></div>
    <div />
    <div>{{ legend.text }}</div>
    <div :class="handleClass" />
  </legend>
</template>

<script>
import { defineComponent } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utils/event_functions'

export default defineComponent({
  props: {
    legend: {
      type: Object,
      required: true,
    },
    handleClass: {
      type: String,
      required: false,
      default: '',
    }
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    const events = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }
    return { events }
  }
})
</script>

<style lang="scss" scoped>
$fontSize: 21px;
$borderRadius: 8px 8px 0 0;
$border: 1px solid $blueLikeColor6;

body.light-theme {
  legend.outside {
    & > div:nth-of-type(1) {
      background: $windowLightBackground;
    }
    // & > div:nth-of-type(3) {
    //   border-bottom: 1px solid $windowLightBackground;
    // }
  }
}
body.dark-theme {
  legend.outside {
    & > div:nth-of-type(1) {
      background: $windowDarkBackground;
    }
    // & > div:nth-of-type(3) {
    //   border-bottom: 1px solid $windowDarkBackground;
    // }
  }
}

legend {
  @include unSelectable;
  @include textStyleA;
  height: 0;
  font-size  : $fontSize;
  line-height: $fontSize;
  font-family: $font-family-electrolize;

  // 内側に配置する場合のスタイル
  &.inside {
    $paddingTop: 0;
    $paddingLnR: 12px;
    $paddingBottom: 0;

    position: absolute;
    top: 0;
    left: 0;

    // テキスト用
    & > div:nth-of-type(4) {
      line-height: $windowHeaderItemSize;
      padding: $paddingTop $paddingLnR $paddingBottom;
    }
    // ドラッグハンドル用
    & > div:nth-of-type(5) {
      @include absoluteBox;
      height: $windowHeaderItemSize;
    }
  }

  // 外側に配置する場合のスタイル
  &.outside {
    $paddingTop: 12px;
    $paddingLnR: 17px;
    $paddingBottom: 12px;

    position: absolute;
    // top: -(floor($fontSize / 2) + $paddingTop - 1);
    top: -($fontSize + $paddingTop + $paddingBottom + 1);
    left: -1px;

    // 背景色用
    & > div:nth-of-type(1) {
      @include absoluteBox;
      right: -1px;
      // height: $fontSize;
      height: $fontSize + $paddingTop + $paddingBottom + 1;
      border-radius: $borderRadius;
    }
    // box-shadow用
    & > div:nth-of-type(2) {
      @include absoluteBox;
      // height: $fontSize + 1;
      height: $fontSize + $paddingTop + $paddingBottom;
      border-radius: $borderRadius;
      overflow: hidden;
      & > div {
        @include absoluteBox;
        right: -500px;
        box-shadow: $legendBoxShadow;
      }
    }
    // ボーダー用
    & > div:nth-of-type(3) {
      @include absoluteBox;
      right: -1px;
      // height: $fontSize;
      height: $fontSize + $paddingTop + $paddingBottom;
      border-radius: $borderRadius;
      border: $border;
      border-bottom: none;
    }
    // テキスト用
    & > div:nth-of-type(4) {
      position: relative;
      height: $fontSize;
      padding: $paddingTop $paddingLnR $paddingBottom;
    }
    // ドラッグハンドル用
    & > div:nth-of-type(5) {
      @include absoluteBox;
      height: ($fontSize + $paddingTop + $paddingBottom + 6);
    }
  }
}
</style>