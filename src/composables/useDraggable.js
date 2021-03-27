import { MOUSE_TOUCH_EVENT as TOUCH } from '@/utilities/v_event_functions'
import useWindow from '@/composables/useWindow'

export default function useDraggable(el) {
  const {
    frameX,
    frameY,
    setElementState,
    setEventState,
    replaceMargin,
  } = useWindow(el)

  // 状態をドラッグ後の値で更新する関数
  const drag = e => {
    el.style.top = (e.pageY - frameY.value) + 'px'
    el.style.left = (e.pageX - frameX.value) + 'px'
  }
  // イベントを追加する関数
  const addDragEvent = () => {
    document.body.addEventListener(TOUCH.MOVE, drag)
    document.body.addEventListener(TOUCH.END, removeDragEvent)
  }
  // イベントを削除する関数
  const removeDragEvent = () => {
    document.body.removeEventListener(TOUCH.MOVE, drag)
    document.body.removeEventListener(TOUCH.END, removeDragEvent)
  }
  // ハンドル要素にイベントを追加する関数
  const addDragEvent2Handle = handle => {
    handle.addEventListener(TOUCH.START, e => {
      if (e.target !== e.currentTarget) return
      setElementState()
      setEventState(e)
      replaceMargin()
      addDragEvent()
    })
  }

  return { addDragEvent2Handle }
}