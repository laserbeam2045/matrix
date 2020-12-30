import { unref, reactive, readonly } from 'vue'
import { getTouchEvent } from '@/utils/event_functions'

export default function useWindow() {
  const state = reactive({
    pageX: 0,
    pageY: 0,
    frameX: 0,
    frameY: 0,
    clientWidth: 0,
    clientHeight: 0,
  })

  // 状態を記録する関数
  const setState = (e, target) => {
    target = unref(target)
    state.pageX = getPageX(e)
    state.pageY = getPageY(e)
    state.frameX = state.pageX - target.offsetLeft
    state.frameY = state.pageY - target.offsetTop
    state.clientWidth  = target.clientWidth
    state.clientHeight = target.clientHeight
  }

  // (水平・垂直)位置のピクセル数値(document全体からの相対位置)を取得する関数
  const getPageX = e => getTouchEvent(e).pageX
  const getPageY = e => getTouchEvent(e).pageY

  // (水平・垂直)方向の変化量を計算する関数
  const getDiffX = e => state.pageX - getPageX(e)
  const getDiffY = e => state.pageY - getPageY(e)

  // 画面の表示領域内で、絶対位置指定で中央配置にするための位置を計算する関数
  const getCenterPosition = elm => {
    const doc = document.documentElement
    const top = Math.floor((doc.offsetHeight - unref(elm).offsetHeight) * 0.5)
    const left = Math.floor((doc.offsetWidth - unref(elm).offsetWidth) * 0.5)
    return { top, left }
  }

  return {
    state: readonly(state),
    setState,
    getPageX,
    getPageY,
    getDiffX,
    getDiffY,
    getCenterPosition,
  }
}