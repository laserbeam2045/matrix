// @ts-nocheck
import { reactive, unref, markRaw, provide, inject, readonly } from 'vue'
import { sleep } from '@/utilities/useDateTime'
import SuperArray from '@/utilities/SuperArray'

import TheMatrix3 from '@/components/TheMatrix3'
import TheAudios  from '@/components/TheAudios'
import TheButtons from '@/components/TheButtons'
import TheEditor  from '@/components/editor/TheEditor'
import GPT2       from '@/components/editor/GPT2'
import TheUser    from '@/components/user/TheUser'
import TheQuiz    from '@/components/quiz/TheQuiz'

const storeSymbol = Symbol('windowManager')

// ルートコンポーネントで一度だけ実行します
export const provideStore = () => provide(storeSymbol, createStore())

// 遅延などの特殊な処理が必要な時はinjectします
export const injectStore = () => inject(storeSymbol)

// injectStoreを介すのが面倒な時はこれを使います
export default function useWindowManager(window) {
  const {
    windows,
    open,
    close,
    toggle,
    moveToLast,
    closeAll,
  } = injectStore()

  return {
    windows,
    open      : () => open(window),
    close     : () => close(window),
    toggle    : () => toggle(window),
    moveToLast: () => moveToLast(window),
    closeAll,
  }
}

const createStore = () => {
  const stack = reactive(new SuperArray())

  const isOpened = window => stack.includes(window)

  const isClosed = window => !stack.includes(window)

  const openable = window => typeof(unref(window)?.open) === 'function'

  const closable = window => typeof(unref(window)?.close) === 'function'

  /**
   * 第一引数のwindowを開く関数
   * @param {object} window // windowオブジェクト
   * @param {object}
   * @prop {number} delay   // windowを開くまでの待機時間(ms)
   */
  const open = async (window, { delay = 0 } = {}) => {
    if (isClosed(window)) {
      await sleep(delay)
      stack.push(window)

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
      stack.delete(window)

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

    while (stack.size) {
      const window = stack.pop()
      if (closable(window)) {
        unref(window).close()
      }
      if (stack.size) {
        await sleep(interval)
      }
    }
  }

  /**
   * 第一引数のwindowを配列の末尾に移動させる関数
   * @param {object} window   対象となるwindow
   * @return {boolen}         移動できたかどうか
   */
  const moveToLast = window => {
    const from = stack.indexOf(window)
    const to = stack.lastIndex
    return stack.move(from, to)
  }

  return {
    windows: readonly(stack),
    open,
    close,
    toggle,
    closeAll,
    moveToLast,
  }
}

export const WINDOWS = {
  THE_MATRIX: markRaw(TheMatrix3),
  THE_AUDIO : markRaw(TheAudios),
  THE_BUTTON: markRaw(TheButtons),
  THE_EDITOR: markRaw(TheEditor),
  THE_GPT_2 : markRaw(GPT2),
  THE_USER  : markRaw(TheUser),
  THE_QUIZ  : markRaw(TheQuiz),
}
