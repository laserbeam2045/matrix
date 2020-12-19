<template>
  <div class="virtual-wrapper">
    <header :class="handleClass">
      <slot name="header"></slot>
    </header>
    <div ref="root" :style="contentsStyle">
      <slot></slot>
    </div>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'VirtualWindowContents',
  props: {
    handleClass: {
      type: String,
      required: true,
    },
    contentsStyle: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const root = ref(null)

    return { root }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/app';
@import '@/assets/style/colors';
@import '@/assets/style/window';

// コンテンツラッパーのスタイル
.virtual-wrapper {
  height: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  border-radius: 0 0 8px 8px;
  overflow: hidden;

  // ヘッダーのスタイル
  header {
    height: auto;
    padding-top: $windowHeaderItemSize;

    @if $test { background: $greenLikeColor1; }
  }

  // コンテンツのスタイル
  & > div {
    // display: flex;
    // flex-direction: column;
    // align-items: stretch;
    position: relative;
    width: 100%;
    height: auto;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;  // iOS用

    // スクロールバーのスタイル
    // ::v-deep(.ps__rail-y) {
    //   width: $windowScrollbarWidth;
    //   position: absolute;
    //   right: 0;

    //   .ps__thumb-y {
    //     position: relative;
    //     background: $blueLikeColor4;
    //     box-shadow: $windowScrollbarBoxShadow;
    //     border-radius: $windowScrollbarBorderRadius;
    //     &:hover { cursor: grab; }
    //     &:active { cursor: grabbing; }
    //   }
    // }
    // ::v-deep(.ps__rail-x) {
    //   height: $windowScrollbarWidth;
    //   position: absolute;
    //   bottom: 0;

    //   .ps__thumb-x {
    //     position: relative;
    //     background: $blueLikeColor4;
    //     box-shadow: $windowScrollbarBoxShadow;
    //     border-radius: $windowScrollbarBorderRadius;
    //     &:hover { cursor: grab; }
    //     &:active { cursor: grabbing; }
    //   }
    // }

    // スクロールバーのスタイル
    &::-webkit-scrollbar {
      // background: $blueLikeColor4;
      // box-shadow: $windowScrollbarBoxShadow;
      // border-radius: $windowScrollbarBorderRadius;
      // width: $windowScrollbarWidth;
      // height: 0;
      display: none;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-track {
      border: none;
      box-shadow: none;
      background: transparent;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
    // // リサイザーのスタイル
    &::-webkit-resizer {
      display: none;
    }
  }

  // フッターのスタイル
  footer {
    @if $test { background: $greenLikeColor1; }
  }
}
</style>