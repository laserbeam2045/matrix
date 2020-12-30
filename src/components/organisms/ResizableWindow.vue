<template>
  <div
    ref="root"
    class="resizable"
    :class="{ resizing: activeResizer.className }"
    :style="style"
  >
    <slot />
    <div
      v-for="(eventHandler, className) in resizers"
      :key="className"
      class="resizer"
      :class="[className, { active: className === activeResizer.className }]"
      @mousedown.passive="addResizeEvent(eventHandler, className)"
      @touchstart.passive="addResizeEvent(eventHandler, className)"
    />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, toRefs, onMounted, nextTick } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import useVModel from '@/composables/useVModel'
import useWindow from '@/composables/useWindow'

const MIN_WIDTH = 200
const MIN_HEIGHT = 30

export default defineComponent({
  name: 'ResizableWindow',

  props: {
    position: {
      type: String,
      required: false,
      default: 'absolute',
    },
    top: {
      type: [Number, String],
      required: false,
      default: 'auto',
    },
    left: {
      type: [Number, String],
      required: false,
      default: 'auto',
    },
    width: {
      type: String,
      required: false,
      default: 'auto',
    },
    height: {
      type: String,
      required: false,
      default: 'auto',
    },
    wrapper: {
      type: Object,
      required: false,
      default: null,
    },
    useResizeV: {
      type: Boolean,
      required: false,
      default: true,
    },
    useResizeH: {
      type: Boolean,
      required: false,
      default: true,
    }
  },
  emits: [
    'update:top',
    'update:left',
    'update:width',
    'update:height',
  ],

  setup(props, context) {
    const rootRef = ref(null)
    const topRef = useVModel(props, context, 'top')
    const leftRef = useVModel(props, context, 'left')
    const widthRef = useVModel(props, context, 'width')
    const heightRef = useVModel(props, context, 'height')
    const propsAsRefs = toRefs(props)

    // ラッパーの有無によって、状態を更新する対象となる要素を決める
    const targetRef = computed(() => {
      const wrapper = propsAsRefs.wrapper.value
      return wrapper ? wrapper : rootRef.value
    })

    // ラッパーの有無によってスタイルを分ける
    const styleRef = computed(() => {
      if (propsAsRefs.wrapper.value) {
        return {
          width: ('auto' === widthRef.value) ? 'auto' : '100%',
          height: ('auto' === heightRef.value) ? 'auto' : '100%',
          position: 'relative',
        }
      } else {
        return {
          top: topRef.value,
          left: leftRef.value,
          width: widthRef.value,
          height: heightRef.value,
          position: propsAsRefs.position.value,
        }
      }
    })

    /* イベントリスナ関連 */

    const { state, setState, getPageX, getPageY,
            getDiffX, getDiffY, getCenterPosition } = useWindow()

    // 使用中のresizer
    const activeResizer = reactive({
      className: '',
      eventHandler: null,
    })

    // イベントを追加する関数
    const addResizeEvent = (eventHandler, className) => {
      // event.preventDefault()
      setState(event, targetRef)
      activeResizer.className = className
      activeResizer.eventHandler = eventHandler
      document.body.addEventListener(MOUSE_TOUCH_EVENT.MOVE, eventHandler)
      document.body.addEventListener(MOUSE_TOUCH_EVENT.END,  removeResizeEvent)
    }
    // イベントを削除する関数
    const removeResizeEvent = () => {
      document.body.removeEventListener(MOUSE_TOUCH_EVENT.MOVE, activeResizer.eventHandler)
      document.body.removeEventListener(MOUSE_TOUCH_EVENT.END,  removeResizeEvent)
      activeResizer.eventHandler = null
      activeResizer.className = ''
    }

    /* イベントハンドラ関連 */

    // リサイズ後の値を計算する関数
    const getNewTop  = e => Math.max(0, getPageY(e) - state.frameY)
    const getNewLeft = e => Math.max(0, getPageX(e) - state.frameX)
    const getNewWidth  = (e, dir) => (state.clientWidth + dir * getDiffX(e))
    const getNewHeight = (e, dir) => (state.clientHeight + dir * getDiffY(e))

    // 状態をリサイズ後の値で更新する関数
    const updateTop = e => topRef.value = getNewTop(e) + 'px'
    const updateLeft = e => leftRef.value = getNewLeft(e) + 'px'
    const updateWidth = (e, dir) => widthRef.value = Math.max(MIN_WIDTH, getNewWidth(e, dir)) + 'px'
    const updateHeight = (e, dir) => heightRef.value = Math.max(MIN_HEIGHT, getNewHeight(e, dir)) + 'px'

    // 垂直方向のイベントハンドラ
    const useResizeVr = {
      'resizer-top': () => {
        updateTop(event)
        updateHeight(event, 1)
      },
      'resizer-bottom': () => {
        updateHeight(event, -1)
      },
    }
    // 水平方向のイベントハンドラ
    const useResizeHr = {
      'resizer-left': () => {
        updateLeft(event)
        updateWidth(event, 1)
      },
      'resizer-right': () => {
        updateWidth(event, -1)
      },
    }
    // 斜め四方向のイベントハンドラ
    const diagonalResizer = {
      'resizer-top-left': () => {
        updateTop(event)
        updateLeft(event)
        updateWidth(event, 1)
        updateHeight(event, 1)
      },
      'resizer-top-right': () => {
        updateTop(event)
        updateWidth(event, -1)
        updateHeight(event, 1)
      },
      'resizer-bottom-left': () => {
        updateLeft(event)
        updateWidth(event, 1)
        updateHeight(event, -1)
      },
      'resizer-bottom-right': () => {
        updateWidth(event, -1)
        updateHeight(event, -1)
      },
    }
    // 全八方向のイベントハンドラ
    const omnidirectionalResizer = {
      ...useResizeVr,
      ...useResizeHr,
      ...diagonalResizer,
    }
    // 実際に設定されるイベントハンドラ
    const resizersRef = computed(() => {
      const useV = propsAsRefs.useResizeV.value
      const useH = propsAsRefs.useResizeH.value
      if (useV && useH) return omnidirectionalResizer
      else if (useV)    return useResizeVr
      else if (useH)    return useResizeHr
      else              return {}
    })

    // プロパティに応じて中央配置にする
    const centering = () => {
      if (!propsAsRefs.wrapper.value) {
        const { top, left } = getCenterPosition(rootRef)
        if ('center' === topRef.value) topRef.value = top + 'px'
        if ('center' === leftRef.value) leftRef.value = left + 'px'
      }
    }

    onMounted(() => {
      nextTick(() => {
        centering()
      })
    })

    return {
      root: rootRef,
      style: styleRef,
      resizers: resizersRef,
      activeResizer,
      addResizeEvent,
    }
  },
})
</script>

<style lang="scss" scoped>
@function _fn($value) {
  @return -($value + 1) / 2;
}

// リサイザーに関する値
$weight: 11px;                     // 通常時の太さ
$offset: _fn($weight);             // 通常時の太さに応じた位置調整
$length: 100%;                     // 通常時の長さ
$stride: 0;                        // 通常時の長さに応じた位置調整
$boxWeight: 27px;                  // 通常時のコーナーサイズ
$boxOffset: _fn($boxWeight);       // 通常時のコーナーサイズに応じた位置調整
$activeWeight: 101px;              // 使用時の太さ
$activeOffset: _fn($activeWeight); // 使用時の太さに応じた位置調整
$activeLength: 120%;               // 使用時の長さ
$activeStride: -10%;               // 使用時の長さに応じた位置調整

.resizable {
  position: relative;

  &.resizing {
    user-select: none;

    & > .resizer:not(.active) {
      display: none;
    }
  }
  .resizer {
    position: absolute;

    &.resizer-top {
      &.active {
        top   : $activeOffset;
        left  : $activeStride;
        width : $activeLength;
        height: $activeWeight;
      }
      &:not(.active) {
        top   : $offset;
        left  : $stride;
        width : $length;
        height: $weight;
        width: 100%;
      }
      cursor: ns-resize;
      @if $test { background: rgba(255, 100, 100, 0.5); }
    }

    &.resizer-left {
      &.active {
        top   : $activeStride;
        left  : $activeOffset;
        width : $activeWeight;
        height: $activeLength;
      }
      &:not(.active) {
        top   : $stride;
        left  : $offset;
        width : $weight;
        height: $length;
      }
      cursor: ew-resize;
      @if $test { background: rgba(100, 255, 100, 0.5); }
    }

    &.resizer-right {
      &.active {
        top   : $activeStride;
        right : $activeOffset;
        width : $activeWeight;
        height: $activeLength;
      }
      &:not(.active) {
        top   : $stride;
        right : $offset + _fn($windowScrollbarWidth);
        width : $weight;
        height: $length;
      }
      cursor: ew-resize;
      @if $test { background: rgba(100, 100, 255, 0.5); }
    }

    &.resizer-bottom {
      &.active {
        left  : $activeStride;
        bottom: $activeOffset;
        width : $activeLength;
        height: $activeWeight;
      }
      &:not(.active) {
        left  : $stride;
        bottom: $offset + _fn($windowScrollbarWidth);
        width : $length;
        height: $weight;
      }
      cursor: ns-resize;
      @if $test { background: $greenLikeColor1; }
    }

    &.resizer-top-left {
      &.active {
        top   : $activeOffset;
        left  : $activeOffset;
        width : $activeWeight;
        height: $activeWeight;
      }
      &:not(.active) {
        top   : $boxOffset;
        left  : $boxOffset;
        width : $boxWeight;
        height: $boxWeight;
      }
      cursor: nw-resize;
      @if $test { background: rgba(255, 255, 255, 0.5); }
    }

    &.resizer-top-right {
      &.active {
        top   : $activeOffset;
        right : $activeOffset;
        width : $activeWeight;
        height: $activeWeight;
      }
      &:not(.active) {
        top   : $boxOffset;
        right : $boxOffset;
        width : $boxWeight;
        height: $boxWeight;
      }
      cursor: ne-resize;
      @if $test { background: rgba(0, 255, 0, 0.5); }
    }

    &.resizer-bottom-left {
      &.active {
        left   : $activeOffset;
        bottom : $activeOffset;
        width  : $activeWeight;
        height : $activeWeight;
      }
      &:not(.active) {
        left  : $boxOffset;
        bottom: $boxOffset;
        width : $boxWeight;
        height: $boxWeight;
      }
      cursor: sw-resize;
      @if $test { background: rgba(0, 0, 255, 0.5); }
    }

    &.resizer-bottom-right {
      &.active {
        right : $activeOffset;
        bottom: $activeOffset;
        width : $activeWeight;
        height: $activeWeight;
      }
      &:not(.active) {
        right : $boxOffset;
        bottom: $boxOffset;
        width : $boxWeight;
        height: $boxWeight;
      }
      cursor: se-resize;
      @if $test { background: rgba(255, 0, 0, 0.5); }
    }
  }
}
</style>