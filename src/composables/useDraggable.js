import { MOUSE_TOUCH_EVENT as TOUCH } from '@/utilities/v_event_functions'
import useWindow from '@/composables/useWindow'

export default function useDraggable(el) {
  const {
    state,
    setTop,
    setLeft,
    setState,
    getPageX,
    getPageY,
  } = useWindow(el)

  // 状態をドラッグ後の値で更新する関数
  const drag = e => {
    el.style.top = setTop(getPageY(e) - state.frameY) + 'px'
    el.style.left = setLeft(getPageX(e) - state.frameX) + 'px'
  }
  // イベントを追加する関数
  const addDragEvent = e => {
    if (e.target !== e.currentTarget) return
    setState(e, el)
    document.body.addEventListener(TOUCH.MOVE, drag)
    document.body.addEventListener(TOUCH.END, removeDragEvent)
  }
  // イベントを削除する関数
  const removeDragEvent = () => {
    document.body.removeEventListener(TOUCH.MOVE, drag)
    document.body.removeEventListener(TOUCH.END, removeDragEvent)
  }

  el.style.position = 'absolute'

  el.querySelectorAll('.draggable-handle').forEach(elm => {
    elm.addEventListener(TOUCH.START, addDragEvent)
  })
}