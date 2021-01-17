
/* イベントに関する関数 */

import { DEVICE_TYPE } from '@/store/constants'

// タッチイベントのサポートの有無
export const IS_SUPPORT_TOUCH = 'ontouchend' in document

// (マウス／タッチ)系イベント
export const MOUSE_TOUCH_EVENT = {
  START: IS_SUPPORT_TOUCH ? 'touchstart' : 'mousedown',
  MOVE : IS_SUPPORT_TOUCH ? 'touchmove'  : 'mousemove',
  END  : IS_SUPPORT_TOUCH ? 'touchend'   : 'mouseup',
  LEAVE: IS_SUPPORT_TOUCH ? 'touchleave' : 'mouseleave',
}

// デバイスの種類を取得する関数
export const getDeviceType = () => {
  const ua = navigator.userAgent
  if (
    ua.includes('iPhone') || ua.includes('iPod') ||
    ua.includes('Android') && ua.includes('Mobile')
  ) {
    return DEVICE_TYPE.SMART_PHONE
  } else if (ua.includes('iPad') || ua.includes('Android')) {
    return DEVICE_TYPE.TABLET
  } else {
    return DEVICE_TYPE.PC
  }
}

// タッチイベントのサポートの有無による差異を吸収する関数
export const getTouchEvent = evt => {
  return IS_SUPPORT_TOUCH ? evt.changedTouches[0] : evt
}

// コピーされた文字列を返す関数
export const getClipboardData = (event) => {
  if (window.clipboardData) {
    return window.clipboardData.getData('text')
  } else {
    return event.clipboardData.getData('text/plain')
  }
}