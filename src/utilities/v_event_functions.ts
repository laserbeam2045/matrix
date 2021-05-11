
/* イベントに関する関数 */

// デバイスの種類
export const DEVICE_TYPE = {
  PC         : 0,
  TABLET     : 1,
  SMART_PHONE: 2,
}

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

// コピーされた文字列を返す関数
export const getClipboardData = (evt: Event): string => {
  if ('clipboardData' in window) {
    return (<any>window).clipboardData.getData('text')
  } else if ('clipboardData' in evt) {
    return (<any>evt).clipboardData.getData('text/plain')
  } else {
    return ''
  }
}
