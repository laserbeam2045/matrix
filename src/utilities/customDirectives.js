import { MOUSE_TOUCH_EVENT as EVENT } from '@/utils/event_functions'

export default {
  // スクロールイベント
  'scroll': {
    mounted (el, binding) {
      const fn = evt => {
        if (binding?.value(evt, el)) {
          el.removeEventListener('scroll', fn)
        }
      }
      el.addEventListener('scroll', fn, { passive: true })
    }
  },
  // windowのresizeイベント
  'window-resize': {
    mounted (el, binding) {
      const fn = evt => {
        if (binding?.value(evt, el)) {
          window.removeEventListener('resize', fn)
        }
      }
      window.addEventListener('resize', fn, { passive: true })
    }
  },
  // elementのresizeイベント
  'resize': {
    mounted (el, binding) {
      const observer = new MutationObserver((_, instance) => {
        const width = el.getBoundingClientRect().width
        const height = el.getBoundingClientRect().height
        binding?.value(width, height, el) && instance.disconnect()
      })
      const options = {
        attributes: true,
        attributeFilter: ['style'],
      }
      observer.observe(el, options)
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