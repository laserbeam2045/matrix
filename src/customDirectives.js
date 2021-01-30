import { MOUSE_TOUCH_EVENT as EVENT } from '@/utilities/v_event_functions'

export default {
  // elementのスクロールイベントを感知するディレクティブ
  'scroll': {
    mounted (el, binding) {
      const fn = evt => {
        if (binding?.value(evt, el)) {
          el.removeEventListener('scroll', fn)
        }
      }
      el.addEventListener('scroll', fn)
    }
  },

  // windowのresizeイベントを感知するディレクティブ
  'window-resize': {
    mounted (el, binding) {
      const fn = evt => {
        if (binding?.value(evt, el)) {
          window.removeEventListener('resize', fn)
        }
      }
      window.addEventListener('resize', fn)
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

  // mount時に自動的にfocusするディレクティブ
  'focus': {
    mounted (el, binding) {
      el.focus()
      binding?.value(el)
    }
  },

  // モバイル端末での素早いfocusを可能にするディレクティブ
  'quick-focus': {
    mounted (el, binding) {
      const focus = evt => {
        if (evt.target === el) el.focus()
        if (binding?.value(evt, el)) {
          el.removeEventListener(EVENT.START, focus)
          window.removeEventListener(EVENT.END, blur)
        }
      }
      const blur = evt => {
        if (evt.target !== el) el.blur()
      }
      el.addEventListener(EVENT.START, focus)
      window.addEventListener(EVENT.END, blur)
    }
  }
}