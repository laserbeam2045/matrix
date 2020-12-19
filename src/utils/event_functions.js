
/* イベントに関する関数 */

import { DEVICE_TYPE, IS_SUPPORT_TOUCH } from '@/store/constants'

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