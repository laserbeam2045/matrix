import { reactive, unref, provide, inject } from 'vue'
import { sleep } from '@/utilities/useDateTime'

const storeSymbol = Symbol('windowManager')

// ルートコンポーネントで一度だけ実行します
export const provideStore = () => provide(storeSymbol, createStore())

// 遅延などの特殊な処理が必要な時はinjectします
export const injectStore = () => inject(storeSymbol)

// injectStoreを介すのが面倒な時はこれを使います
export default function useWindowManager(window) {
  const {
    open,
    close,
    toggle,
    closeAll,
  } = injectStore()

  return {
    open: () => open(window),
    close: () => close(window),
    toggle: () => toggle(window),
    closeAll, 
  }
}

const createStore = () => {
  const stack = reactive([])

  // Private functions
  const pop = () => stack.pop()

  const push = window => stack.push(window)

  const remove = window => stack.splice(stack.indexOf(window), 1)

  const isOpened = window => stack.includes(window)

  const isClosed = window => !stack.includes(window)

  // Public functions
  const open = async (window, delay = 0) => {
    await sleep(delay)
    if (isClosed(window)) {
      push(window)
      unref(window).open()
    }
  }

  const close = async (window, delay = 0) => {
    await sleep(delay)
    if (isOpened(window)) {
      remove(window)
      unref(window).close()
    }
  }

  const toggle = async (window, delay = 0) => {
    await sleep(delay)
    if (isOpened(window)) {
      close(window)
    } else {
      open(window)
    }
  }

  const closeAll = async (delay = 0) => {
    await sleep(delay)
    while (stack.length) {
      const window = pop()
      unref(window).close()
    }
  }

  return { open, close, toggle, closeAll }
}