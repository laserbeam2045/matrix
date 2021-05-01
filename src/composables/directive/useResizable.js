import { reactive } from 'vue'
import { MOUSE_TOUCH_EVENT as TOUCH } from '@/utilities/v_event_functions'
import useWindow from './useWindow'

const WEIGHT = '11px'       // 通常時の太さ
const LENGTH = '100%'       // 通常時の長さ
const OFFSET = '-6px'       // 通常時の太さに応じた位置調整
const STRIDE = '0px'        // 通常時の長さに応じた位置調整
const BOX_WEIGHT = '27px'   // 通常時のコーナーサイズ
const BOX_OFFSET = '-14px'  // 通常時のコーナーサイズに応じた位置調整

/**
 * // リサイズを可能にするハンドル要素を返す
 * @param {Object} el         // リサイズ対象のHTML要素
 * @param {Number} minWidth   // 横幅の最小値
 * @param {Number} minHeight  // 高さの最小値
 * @returns {Object}          // ハンドル要素
 */
export default function useResizable(el, minWidth=0, minHeight=0) {
  const {
    pageX,
    pageY,
    frameX,
    frameY,
    offsetWidth,
    offsetHeight,
    setElementState,
    setEventState,
    replaceMargin,
  } = useWindow(el)

  const state = reactive({
    eventHandler: null,
  })

  // イベントを追加する関数
  const addResizeEvent = () => {
    document.body.addEventListener(TOUCH.MOVE, state.eventHandler)
    document.body.addEventListener(TOUCH.END, removeResizeEvent)
  }
  // イベントを削除する関数
  const removeResizeEvent = () => {
    document.body.removeEventListener(TOUCH.MOVE, state.eventHandler)
    document.body.removeEventListener(TOUCH.END, removeResizeEvent)
  }

  // リサイズ後の値を計算する関数
  const getNewTop  = e => e.pageY - frameY.value
  const getNewLeft = e => e.pageX - frameX.value
  const getNewWidth  = (e, dir) => offsetWidth.value + dir * (pageX.value - e.pageX)
  const getNewHeight = (e, dir) => offsetHeight.value + dir * (pageY.value - e.pageY)

  /**
   * 垂直方向の位置を更新する関数
   * @param {Object} e eventObject
   */
  const updateTop  = e => el.style.top = getNewTop(e) + 'px'

  /**
   * 水平方向の位置を更新する関数
   * @param {Object} e eventObject
   */
  const updateLeft = e => el.style.left = getNewLeft(e) + 'px'

  /**
   * 横幅を更新する関数
   * @param {Object} e    eventObject
   * @param {Number} dir  方向(1 or -1)
   * @return {Boolean}    true(更新時) or false
   */
  const updateWidth  = (e, dir) => {
    const newWidth = getNewWidth(e, dir)

    if (minWidth <= newWidth) {
      el.style.width = newWidth + 'px'
      return true
    } else {
      return false
    }
  }

  /**
   * 高さを更新する関数
   * @param {Object} e    eventObject
   * @param {Number} dir  方向(1 or -1)
   * @return {Boolean}    true(更新時) or false
   */
  const updateHeight = (e, dir) => {
    const newHeight = getNewHeight(e, dir)

    if (minHeight <= newHeight) {
      el.style.height = newHeight + 'px'
      return true
    } else {
      return false
    }
  }

  // 各リサイザーの設定
  const resizerSettings = {
    // 上
    resizerTop: {
      style: {
        top   : OFFSET,
        left  : STRIDE,
        width : LENGTH,
        height: WEIGHT,
        cursor: 'ns-resize',
      },
      eventHandler: e => {
        updateHeight(e, 1) && updateTop(e)
      },
    },
    // 左
    resizerLeft: {
      style: {
        top   : STRIDE,
        left  : OFFSET,
        width : WEIGHT,
        height: LENGTH,
        cursor: 'ew-resize',
      },
      eventHandler: e => {
        updateWidth(e, 1) && updateLeft(e)
      },
    },
    // 右
    resizerRight: {
      style: {
        top   : STRIDE,
        right : OFFSET,
        width : WEIGHT,
        height: LENGTH,
        cursor: 'ew-resize',
      },
      eventHandler: e => {
        updateWidth(e, -1)
      },
    },
    // 下
    resizerBottom: {
      style: {
        bottom: OFFSET,
        left  : STRIDE,
        width : LENGTH,
        height: WEIGHT,
        cursor: 'ns-resize',
      },
      eventHandler: e => {
        updateHeight(e, -1)
      },
    },
    // 左上
    resizerTopLeft: {
      style: {
        top   : BOX_OFFSET,
        left  : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nwse-resize',
      },
      eventHandler: e => {
        updateWidth(e, 1) && updateLeft(e)
        updateHeight(e, 1) && updateTop(e)
      },
    },
    // 右上
    resizerTopRight: {
      style: {
        top   : BOX_OFFSET,
        right : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nesw-resize',
      },
      eventHandler: e => {
        updateWidth(e, -1)
        updateHeight(e, 1) && updateTop(e)
      },
    },
    // 左下
    resizerBottomLeft: {
      style: {
        bottom: BOX_OFFSET,
        left  : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nesw-resize',
      },
      eventHandler: e => {
        updateHeight(e, -1)
        updateWidth(e, 1) && updateLeft(e)
      },
    },
    // 右下
    resizerBottomRight: {
      style: {
        bottom: BOX_OFFSET,
        right : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nwse-resize',
      },
      eventHandler: e => {
        updateWidth(e, -1)
        updateHeight(e, -1)
      },
    },
  }

  const resizers = {}

  for (const name of Object.keys(resizerSettings)) {
    const { style, eventHandler } = resizerSettings[name]

    // resizerSettingsと同じプロパティでresizersにelementを作成する
    resizers[name] = document.createElement('div')

    // リサイザーのスタイルを設定する
    for (const prop of Object.keys(style)) {
      resizers[name].style[prop] = style[prop]
      resizers[name].style.position = 'absolute'
      // resizers[name].style.background = 'rgba(100,100,255,0.5)' // デバッグ時
    }
    // リサイザーのイベントハンドラを設定する
    resizers[name].addEventListener(TOUCH.START, e => {
      state.eventHandler = eventHandler
      setElementState()
      setEventState(e)
      replaceMargin()
      addResizeEvent()
    })
  }

  return { ...resizers }
}
