import { MOUSE_TOUCH_EVENT as EVENT } from '@/utils/event_functions'

export default {
  // ウィンドウのスクロールイベント
  'scroll': {
    mounted (el, binding) {
      const fnc = evt => {
        if (binding.value(evt, el)) {
          el.removeEventListener('scroll', fnc)
        }
      }
      el.addEventListener('scroll', fnc, { passive: true })
    }
  },
  // resizeイベント
  'resize': {
    mounted (el, binding) {
      const fnc = evt => {
        if (binding.value(evt, el)) {
          window.removeEventListener('resize', fnc)
        }
      }
      window.addEventListener('resize', fnc, { passive: true })
    }
  },
  // mount時に自動的にfocusする
  'focus': {
    mounted (el, binding) {
      el.focus()
      binding?.value(el)
    }
  },
  // モバイル端末のフォーム要素への素早いfocusを可能にする
  'quick-focus': {
    mounted (el, binding) {
      const focus = evt => {
        // TODO: dirty hack
        // evt.stopPropagation()
        if (evt.target === el) el.focus()
        if (binding?.value(evt, el)) {
          el.removeEventListener(EVENT.START, focus)
          window.removeEventListener(EVENT.END, blur)
        }
      }
      const blur = evt => {
        if (evt.target !== el) el.blur()
      }
      el.addEventListener(EVENT.START, focus, { passive: true })
      window.addEventListener(EVENT.END, blur, { passive: true })
    }
  },
}