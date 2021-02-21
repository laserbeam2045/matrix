import { unref, reactive, computed, readonly } from 'vue'

// タッチイベントのサポートの有無による差異を吸収する関数
export const touchEvent = evt => {
  return ('ontouchend' in document) ? evt.changedTouches[0] : evt
}

export default function useWindow(
  top='center',
  left='center',
  width='auto',
  height='auto'
) {
  const state = reactive({
    top,
    left,
    width,
    height,
    pageX: 0,
    pageY: 0,
    frameX: 0,
    frameY: 0,
    clientWidth: 0,
    clientHeight: 0,
  })

  const topRef = computed(() => {
    return (state.top === 'center') ? 'auto' : `${state.top}px`
  })

  const leftRef = computed(() => {
    return (state.left === 'center') ? 'auto' : `${state.left}px`
  })

  const widthRef = computed(() => {
    return (state.width === 'auto') ? 'auto' : `${state.width}px`
  })

  const heightRef = computed(() => {
    return (state.height === 'auto') ? 'auto' : `${state.height}px`
  })

  const setTop = num => state.top = num

  const setLeft = num => state.left = num

  const setWidth = num => state.width = num

  const setHeight = num => state.height = num

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
  const getPageX = e => touchEvent(e).pageX
  const getPageY = e => touchEvent(e).pageY

  // (水平・垂直)方向の変化量を計算する関数
  const getDiffX = e => state.pageX - getPageX(e)
  const getDiffY = e => state.pageY - getPageY(e)

  return {
    state: readonly(state),
    top: topRef,
    left: leftRef,
    width: widthRef,
    height: heightRef,
    setTop,
    setLeft,
    setWidth,
    setHeight,
    setState,
    getPageX,
    getPageY,
    getDiffX,
    getDiffY,
  }
}