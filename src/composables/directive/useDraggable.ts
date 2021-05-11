import { MOUSE_TOUCH_EVENT as TOUCH } from '@/utilities/v_event_functions'
import useWindow from './useWindow'
import '@types/events'

export default function useDraggable(el: HTMLElement) {
  const {
    frameX,
    frameY,
    setElementState,
    setEventState,
    replaceMargin,
  } = useWindow(el)

  // 状態をドラッグ後の値で更新する関数
  const drag = (e: Events.MouseTouch) => {
    el.style.top = (e.pageY - frameY.value) + 'px'
    el.style.left = (e.pageX - frameX.value) + 'px'
  }

  // イベントを追加する関数
  const addDragEvent = () => {
    document.body.addEventListener(TOUCH.MOVE, drag as EventListener)
    document.body.addEventListener(TOUCH.END, removeDragEvent)
  }

  // イベントを削除する関数
  const removeDragEvent = () => {
    document.body.removeEventListener(TOUCH.MOVE, drag as EventListener)
    document.body.removeEventListener(TOUCH.END, removeDragEvent)
  }

  // ハンドル要素にイベントを追加する関数
  const addDragEvent2Handle = (handle: HTMLElement) => {
    handle.addEventListener(TOUCH.START, ((e: Events.MouseTouch) => {
      if (e.target !== e.currentTarget) return
      setElementState()
      setEventState(e)
      replaceMargin()
      addDragEvent()
    }) as EventListener)
  }

  return { addDragEvent2Handle }
}
