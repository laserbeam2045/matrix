import { MOUSE_TOUCH_EVENT as EVENT } from '@/utilities/v_event_functions'
import useDraggable from '@/composables/directive/useDraggable'
import useResizable from '@/composables/directive/useResizable'

export default function registerCustomDirectives(vm) {
  // カスタムディレクティブを設定する
  for (const directiveName in customDirectives) {
    vm.directive(directiveName, customDirectives[directiveName])
  }
}

const customDirectives = {
  // position: fixedで固定する
  // v-pin:[direction]="pinPadding"
  'pin': (el, { arg, value }) => {
    const s = arg || 'top'
    el.style[s] = value + 'px'
    el.style.position = 'fixed'
  },

  // position: absoluteで中央配置にする
  // v-center             縦横中央配置
  // v-center:vertical    上下中央配置
  // v-center:horizontal  左右中央配置
  'center': {
    mounted (el, { arg }) {
      const doc = document.documentElement
      el.style.position = 'absolute'

      if (arg === 'vertical' || !arg) {
        const top = Math.floor((doc.offsetHeight - el.offsetHeight) / 2)
        el.style.top = top + 'px'
      }
      if (arg === 'horizontal' || !arg) {
        const left = Math.floor((doc.offsetWidth - el.offsetWidth) / 2)
        el.style.left = left + 'px'
      }
    },
  },

  // elementのドラッグ移動を可能にする
  // v-draggable
  'draggable': {
    mounted (el) {
      const handleSelector = '.draggable-handle'
      const { addDragEvent2Handle } = useDraggable(el)

      el.style.position = 'absolute'
      el.querySelectorAll(handleSelector).forEach(handle => {
        handle.style.cursor = 'grab'
        addDragEvent2Handle(handle)
      })
    },
  },

  // elementのリサイズを可能にする
  // v-resizable            全方位
  // v-resizable:vertical   縦方向
  // v-resizable:horizontal 横方向
  // v-resizable:diagonal   斜め方向
  'resizable': {
    mounted (el, { arg }) {
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

      if (arg === 'vertical' || !arg) {
        el.appendChild(resizerTop)
        el.appendChild(resizerBottom)
      }
      if (arg === 'horizontal' || !arg) {
        el.appendChild(resizerLeft)
        el.appendChild(resizerRight)
      }
      if (arg === 'diagonal' || !arg) {
        el.appendChild(resizerTopLeft)
        el.appendChild(resizerTopRight)
        el.appendChild(resizerBottomLeft)
        el.appendChild(resizerBottomRight)
      }
    },
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
    },
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
    },
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
    },
  },

  // mount時に自動的にfocusするディレクティブ
  'focus': {
    mounted (el, binding) {
      el.focus()
      binding?.value(el)
    },
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
    },
  },
}
