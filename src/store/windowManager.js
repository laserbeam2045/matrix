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
    stack,
    open,
    close,
    toggle,
    pullUp,
    closeAll,
  } = injectStore()

  return {
    stack,
    open  : () => open(window),
    close : () => close(window),
    toggle: () => toggle(window),
    pullUp: () => pullUp(window),
    closeAll,
  }
}

const createStore = () => {
  const stack = reactive([])

  const pop = () => stack.pop()

  const push = window => stack.push(window)

  const remove = window => stack.splice(stack.indexOf(window), 1)

  const moveAt = (window, at) => {
    if (stack.length <= at) return stack

    const index = stack.indexOf(window)
    const tail = stack.slice(index + 1)

    stack.splice(index)
    stack.push(...tail)
    stack.splice(at, 0, window)
  }

  const isOpened = window => stack.includes(window)

  const isClosed = window => !stack.includes(window)

  const openable = window => typeof(unref(window).open) === 'function'

  const closable = window => typeof(unref(window).close) === 'function'

  /**
   * 第一引数のwindowを開く関数
   * @param {object} window // windowオブジェクト
   * @param {object}
   * @prop {number} delay   // windowを開くまでの待機時間(ms)
   */
  const open = async (window, { delay = 0 } = {}) => {
    if (isClosed(window)) {
      await sleep(delay)
      push(window)
      if (openable(window)) {
        unref(window).open()
      }
    }
  }

  /**
   * 第一引数のwindowを閉じる関数
   * @param {object} window // windowオブジェクト
   * @param {object}
   * @prop {number} delay   // windowを閉じるまでの待機時間(ms)
   */
  const close = async (window, { delay = 0 } = {}) => {
    if (isOpened(window)) {
      await sleep(delay)
      remove(window)
      if (closable(window)) {
        unref(window).close()
      }
    }
  }

  /**
   * 第一引数のwindowが、閉じていたら開き、開いていたら閉じる関数
   * @param {object} window // windowオブジェクト
   * @param {object}
   * @prop {number} delay   // windowを(開く/閉じる)までの待機時間(ms)
   */
  const toggle = async (window, { delay = 0 } = {}) => {
    if (isClosed(window)) {
      open(window, { delay })
    } else {
      close(window, { delay })
    }
  }

  /**
   * 開かれている全てのwindowを閉じる関数
   * @param {object}
   * @prop {number} delay     // 最初に処理を開始するまでの待機時間(ms)
   * @prop {number} interval  // 次のwindowを閉じるまでの待機時間(ms)
   */
  const closeAll = async ({ delay = 0, interval = 0 } = {}) => {
    await sleep(delay)

    while (stack.length) {
      const window = pop()
      if (closable(window)) {
        unref(window).close()
      }
      if (stack.length) {
        await sleep(interval)
      }
    }
  }

  /**
   * 第一引数のwindowを、最前面に表示する関数
   * @param {object} window
   */
  const pullUp = window => {
    moveAt(window, stack.length)
  }

  return { stack, open, close, toggle, closeAll, pullUp }
}
