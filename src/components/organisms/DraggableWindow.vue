<template>
  <div
    ref="root"
    :class="['draggable', { dragging }]"
    :style="style"
  >
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref, toRef, computed, onMounted, nextTick } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import { str2num } from '@/utils/string_functions'
import useVModelRef from '@/utils/vmodel'
import useWindow from '@/utils/windows'

export default defineComponent({
  name: "DraggableWindow",
  emits: [
    'update:top',
    'update:left',
  ],
  props: {
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
    position: {
      type: String,
      required: false,
      default: 'absolute',
    },
    handle: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const rootRef = ref(null)
    const topRef = useVModelRef(props, context, 'top')
    const leftRef = useVModelRef(props, context, 'left')
    const widthRef = useVModelRef(props, context, 'width')
    const heightRef = useVModelRef(props, context, 'height')
    const wrapperRef = toRef(props, 'wrapper')
    const positionRef = toRef(props, 'position')

    // dragging時に付与するclass用
    const draggingRef = ref(false)

    // ラッパーの有無によって、状態を更新する対象となる要素を決める
    const targetRef = computed(() => {
      return wrapperRef.value ? wrapperRef.value : rootRef.value
    })

    // ラッパーの有無によってスタイルを分ける
    const styleRef = computed(() => {
      if (wrapperRef.value) {
        return {
          width: '100%',
          height: '100%',
          position: 'relative',
        }
      } else {
        return {
          top: topRef.value,
          left: leftRef.value,
          width: widthRef.value,
          height: heightRef.value,
          position: positionRef.value,
        }
      }
    })

    /* イベントリスナ・イベントハンドラ関連 */

    const { setState, getDiffX, getDiffY, getCenterPosition } = useWindow()

    // イベントを追加する関数
    const addDragEvent = () => {
      if (event.target.classList.contains('draggable-handle')) {
        event.preventDefault()
        setState(event, targetRef)
        draggingRef.value = true
        document.body.addEventListener(MOUSE_TOUCH_EVENT.MOVE, drag)
        document.body.addEventListener(MOUSE_TOUCH_EVENT.END, removeDragEvent)
        document.body.addEventListener(MOUSE_TOUCH_EVENT.LEAVE, removeDragEvent)
      }
    }
    // イベントを削除する関数
    const removeDragEvent = () => {
      document.body.removeEventListener(MOUSE_TOUCH_EVENT.MOVE, drag)
      document.body.removeEventListener(MOUSE_TOUCH_EVENT.END,  removeDragEvent)
      document.body.removeEventListener(MOUSE_TOUCH_EVENT.LEAVE, removeDragEvent)
      draggingRef.value = false
    }
    // 状態をドラッグ後の値で更新する関数
    const drag = () => {
      if (draggingRef.value) {
        updateTop(event)
        if (widthRef.value !== '100%') {
          updateLeft(event)
        }
        setState(event, targetRef)
      }
    }
    const updateTop = e => {
      const top = str2num(topRef.value)
      topRef.value = Math.max(22, (top - getDiffY(e))) + 'px'
    }
    const updateLeft = e => {
      const left = str2num(leftRef.value)
      leftRef.value = Math.max(0, (left - getDiffX(e))) + 'px'
    }
    // ハンドルをバインドする関数
    const bindHandle = () => {
      const handleElements = document.querySelectorAll(props.handle)
      handleElements.forEach(elm => {
        elm.classList.add('draggable-handle')
        elm.addEventListener(MOUSE_TOUCH_EVENT.START, addDragEvent)
      })
    }
    // プロパティに応じて中央配置にする
    const centering = () => {
      if (!wrapperRef.value) {
        const { top, left } = getCenterPosition(rootRef)
        if ('center' === topRef.value) topRef.value = top + 'px'
        if ('center' === leftRef.value) leftRef.value = left + 'px'
      }
    }

    onMounted(() => {
      nextTick(() => {
        bindHandle()
        centering()
      })
    })

    return {
      root: rootRef,
      style: styleRef,
      dragging: draggingRef,
    }
  },
})
</script>

<style lang="scss">
@import '@/assets/style/app';
@import '@/assets/style/colors';

.draggable {
  &.dragging {
    user-select: none;
  }
}
.draggable-handle {
  cursor: move;
  @if $test { background: $greenLikeColor1; }
}
</style>