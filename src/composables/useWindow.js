import { reactive, computed, toRefs } from 'vue'

export default function useWindow(el) {
  // elementが持つプロパティの状態
  const elementState = reactive({
    offsetParent: null, // 直近の祖先(CSS-positioned)要素
    offsetTop: 0,       // offsetParentから見た垂直位置
    offsetLeft: 0,      // offsetParentから見た水平位置
    offsetWidth: 0,     // padding, borderを含む幅
    offsetHeight: 0,    // padding, borderを含む高さ
    clientWidth: 0,     // paddingを含む幅
    clientHeight: 0,    // paddingを含む高さ
  })

  // eventが持つプロパティの状態
  const eventState = reactive({
    screenX: 0,   // 端末のスクリーンを起点とした水平位置
    screenY: 0,   // 端末のスクリーンを起点とした垂直位置
    clientX: 0,   // viewportの左上からの水平位置
    clientY: 0,   // viewportの左上からの垂直位置
    pageX: 0,     // page全体の左上からの水平位置
    pageY: 0,     // page全体の左上からの垂直位置
  })

  // (水平・垂直)位置のピクセル数値(el要素内での、相対位置)
  const frameX = computed(() => eventState.pageX - elementState.offsetLeft)
  const frameY = computed(() => eventState.pageY - elementState.offsetTop)

  const setElementState = () => {
    elementState.offsetParent = el.offsetParent
    elementState.offsetTop = el.offsetTop
    elementState.offsetLeft = el.offsetLeft
    elementState.offsetWidth = el.offsetWidth
    elementState.offsetHeight = el.offsetHeight
    elementState.clientWidth = el.clientWidth
    elementState.clientHeight = el.clientHeight
  }

  const setEventState = e => {
    eventState.screenX = e.screenX
    eventState.screenY = e.screenY
    eventState.clientX = e.clientX
    eventState.clientY = e.clientY
    eventState.pageX = e.pageX
    eventState.pageY = e.pageY
  }
  
  // マージンをなくし、絶対位置で置き換える関数
  const replaceMargin = () => {
    el.style.margin = 0
    el.style.top = elementState.offsetTop + 'px'
    el.style.left = elementState.offsetLeft + 'px'
  }

  return {
    ...toRefs(elementState),
    ...toRefs(eventState),
    frameX,
    frameY,
    setElementState,
    setEventState,
    replaceMargin,
  }
}