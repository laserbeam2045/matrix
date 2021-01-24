<template>
  <div
    ref="root"
    :class="rootClass"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, computed, onMounted, nextTick } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utils/event_functions'
import { str2num } from '@/utils/string_functions'
import useVModel from '@/composables/useVModel'
import useWindow from '@/composables/useWindow'

export default defineComponent({
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
  emits: [
    'update:top',
    'update:left',
  ],
  setup(props, context) {
    const root = ref(null)
    const top = useVModel(props, context, 'top')
    const left = useVModel(props, context, 'left')
    const { width, height, wrapper, position } = toRefs(props)

    // dragging時に付与するclass用
    const dragging = ref(false)

    // ラッパーの有無によって、状態を更新する対象となる要素を決める
    const target = computed(() => wrapper.value ? wrapper.value : root.value)

    const rootClass = computed(() => ['draggable', { dragging }])

    // ラッパーの有無によってスタイルを分ける
    const rootStyle = computed(() => {
      if (wrapper.value) {
        return {
          width: '100%',
          height: '100%',
          position: 'relative',
        }
      } else {
        return {
          top: top.value,
          left: left.value,
          width: width.value,
          height: height.value,
          position: position.value,
        }
      }
    })

    /* イベントリスナ・イベントハンドラ関連 */

    const { setState, getDiffX, getDiffY, getCenterPosition } = useWindow()

    // イベントを追加する関数
    const addDragEvent = () => {
      if (event.target.classList.contains('draggable-handle')) {
        // event.preventDefault()
        setState(event, target)
        dragging.value = true
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
      dragging.value = false
    }
    // 状態をドラッグ後の値で更新する関数
    const drag = () => {
      if (dragging.value) {
        updateTop(event)
        if (width.value !== '100%') {
          updateLeft(event)
        }
        setState(event, target)
      }
    }
    const updateTop = e => top.value = Math.max(0, (str2num(top.value) - getDiffY(e))) + 'px'
    const updateLeft = e => left.value = Math.max(0, (str2num(left.value) - getDiffX(e))) + 'px'

    // ハンドルをバインドする関数
    const bindHandle = () => {
      document.querySelectorAll(props.handle).forEach(elm => {
        elm.classList.add('draggable-handle')
        elm.addEventListener(MOUSE_TOUCH_EVENT.START, addDragEvent, { passive: false })
      })
    }
    // プロパティに応じて中央配置にする
    const centering = () => {
      if (!wrapper.value) {
        const { top: t, left: l } = getCenterPosition(root)
        if ('center' === top.value) top.value = t + 'px'
        if ('center' === left.value) left.value = l + 'px'
      }
    }

    onMounted(() => {
      nextTick(() => {
        bindHandle()
        centering()
      })
    })

    return { root, rootClass, rootStyle }
  }
})
</script>

<style lang="scss">
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