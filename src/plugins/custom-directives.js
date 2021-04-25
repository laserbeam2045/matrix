import { MOUSE_TOUCH_EVENT as EVENT } from '@/utilities/v_event_functions'
import useDraggable from '@/composables/useDraggable'
import useResizable from '@/composables/useResizable'

export default function registerCustomDirectives(vm) {
  // カスタムディレクティブを設定する
  for (const directiveName in customDirectives) {
    vm.directive(directiveName, customDirectives[directiveName])
  }
}

const customDirectives = {
  // v-pin:[direction]="pinPadding"
  'pin': (el, binding) => {
    el.style.position = 'fixed'
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  },

  // 上下中央配置にするディレクティブ
  'center': {
    mounted (el) {
      const doc = document.documentElement
      const top = Math.floor((doc.offsetHeight - el.offsetHeight) / 2)
      const left = Math.floor((doc.offsetWidth - el.offsetWidth) / 2)
      el.style.top = top + 'px'
      el.style.left = left + 'px'
      el.style.position = 'absolute'
    }
  },

  // elementのドラッグ移動を可能にするディレクティブ
  'draggable': {
    mounted (el) {
      const handleSelector = '.draggable-handle'
      const { addDragEvent2Handle } = useDraggable(el)

      el.style.position = 'absolute'
      el.querySelectorAll(handleSelector).forEach(handle => {
        handle.style.cursor = 'grab'
        addDragEvent2Handle(handle)
      })
    }
  },

  // elementのリサイズを可能にするディレクティブ
  'resizable': {
    mounted (el) {
      const {
        resizerTop,
        resizerLeft,
        resizerRight,
        resizerBottom,
        resizerTopLeft,
        resizerTopRight,
        resizerBottomLeft,
        resizerBottomRight,
      } = useResizable(el)

      el.style.position = 'absolute'
      el.appendChild(resizerTop)
      el.appendChild(resizerLeft)
      el.appendChild(resizerRight)
      el.appendChild(resizerBottom)
      el.appendChild(resizerTopLeft)
      el.appendChild(resizerTopRight)
      el.appendChild(resizerBottomLeft)
      el.appendChild(resizerBottomRight)
    }
  },

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

  // elementのresize(イベントではない)を感知するディレクティブ
  'resize': {
    mounted (el, binding) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (binding?.value(entry.target)) {
            resizeObserver.unobserve(entry.targetl)
          }
        }
      })
      const options = {}
      resizeObserver.observe(el, options)
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