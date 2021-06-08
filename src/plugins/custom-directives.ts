import { MOUSE_TOUCH_EVENT as EVENT } from 'utilities/v_event_functions'
import useDraggable from 'composable/directive/useDraggable'
import useResizable from 'composable/directive/useResizable'

/**
 * カスタムディレクティブを設定する関数
 * @param vm Vueインスタンス
 */
export default function registerCustomDirectives(vm: { directive: Function }) {
  for (const directiveName in customDirectives) {
    const directive = customDirectives[directiveName]
    vm.directive(directiveName, directive)
  }
}

// https://v3.ja.vuejs.org/api/application-api.html#directive
type Binding = {
  instance: object  // ディレクティブが使われているコンポーネントのインスタンス。
  arg: any          // 引数がある場合はそれを含むオブジェクト。例えば v-my-directive:foo の場合、 arg は "foo" となります。
  value: any        // ディレクティブの値。例えば v-my-directive="1 + 1" の場合、 value は 2となります。
  oldValue: any     // 以前の値であり、 beforeUpdate および updated でのみ利用できます。値が変更されているかを判別できます。
  modifiers: object // 修飾子がある場合はそれを含むオブジェクト。例えば v-my-directive.foo.bar の場合、 modifiers オブジェクトは { foo: true, bar: true } となります。
  dir: object       // ディレクティブが登録されたとき、パラメータとして渡されるオブジェクト。
}

type AnyPropertyObject = {
  [key: string]: any
}

const customDirectives: AnyPropertyObject = {
  /**
   * position: fixedで固定する
   * v-pin:[direction]="pinPadding"
   */
  'pin': (el: HTMLElement, { arg, value }: Binding) => {
    const s = arg || 'top'
    el.style[s] = value + 'px'
    el.style.position = 'fixed'
  },

  /**
   * position: absoluteで中央配置にする
   * v-center             縦横中央配置
   * v-center:vertical    上下中央配置
   * v-center:horizontal  左右中央配置
   */
  'center': {
    mounted (el: HTMLElement, { arg }: Binding) {
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

  /**
   * elementのドラッグ移動を可能にする
   * v-draggable
   */
  'draggable': {
    mounted (el: HTMLElement) {
      const handleSelector = '.draggable-handle'
      const { addDragEvent2Handle } = useDraggable(el)

      el.style.position = 'absolute'
      el.querySelectorAll<HTMLElement>(handleSelector)
        .forEach((handle: HTMLElement) => {
          handle.style.cursor = 'grab'
          addDragEvent2Handle(handle)
        })
    },
  },

  /**
   * HTMLElementのリサイズを可能にする
   * v-resizable            全方向
   * v-resizable:vertical   上下だけ
   * v-resizable:horizontal 左右だけ
   * v-resizable:diagonal   斜めだけ
   */
  'resizable': {
    mounted (el: HTMLElement, { arg }: Binding) {
      const {
        resizerTop,
        resizerLeft,
        resizerRight,
        resizerBottom,
        resizerTopLeft,
        resizerTopRight,
        resizerBottomLeft,
        resizerBottomRight,
      } = useResizable({ el }) as AnyPropertyObject

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

  /**
   * elementのスクロールイベントを感知するディレクティブ
   * v-scroll="callbackFunction"
   */
  'scroll': {
    mounted (el: HTMLElement, binding: Binding) {
      const fn = (evt: Event) => {
        if (binding?.value(evt, el)) {
          el.removeEventListener('scroll', fn)
        }
      }
      el.addEventListener('scroll', fn)
    },
  },

  /**
   * elementのresize(イベントではない)を感知するディレクティブ
   * v-resize="callbackFunction"
   */
  'resize': {
    mounted (el: HTMLElement, binding: Binding) {
      const resizeObserver = new ResizeObserver((entries: any) => {
        for (const entry of entries) {
          if (binding?.value(entry.target)) {
            resizeObserver.unobserve(entry.target)
          }
        }
      })
      const options = {}
      resizeObserver.observe(el, options)
    },
  },

  /**
   * windowのresizeイベントを感知するディレクティブ
   * v-window-resize="callbackFunction"
   */
  'window-resize': {
    mounted (el: HTMLElement, binding: Binding) {
      const fn = (evt: Event) => {
        if (binding?.value(evt, el)) {
          window.removeEventListener('resize', fn)
        }
      }
      window.addEventListener('resize', fn)
    },
  },

  /**
   * mount時に自動的にfocusするディレクティブ
   * v-focus[="callbackFunction"]
   */
  'focus': {
    mounted (el: HTMLElement, binding: Binding) {
      el.focus()
      binding?.value(el)
    },
  },

  /**
   * モバイル端末での素早いfocusを可能にするディレクティブ
   * v-quick-focus[="callbackFunction"]
   */
  'quick-focus': {
    mounted (el: HTMLElement, binding: Binding) {
      const focus = (evt: Event) => {
        if (evt.target === el) el.focus()

        if (binding?.value(evt, el)) {
          el.removeEventListener(EVENT.START, focus)
          window.removeEventListener(EVENT.END, blur)
        }
      }

      const blur = (evt: Event) => {
        if (evt.target !== el) el.blur()
      }

      el.addEventListener(EVENT.START, focus)
      window.addEventListener(EVENT.END, blur)
    },
  },
}
