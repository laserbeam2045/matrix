
import { InjectionKey, reactive, unref, markRaw, provide, inject, readonly } from 'vue'
import { sleep } from 'utilities/useDateTime'
import SuperArray from 'utilities/SuperArray'
import { Windows } from 'types/windows'

import TheMatrix3 from 'components/TheMatrix3.vue'
import TheAudios  from 'components/TheAudios.vue'
import TheButtons from 'components/TheButtons.vue'
import TheEditor  from 'components/editor/TheEditor.vue'
import GPT2       from 'components/editor/GPT2.vue'
import TheUser    from 'components/user/TheUser.vue'
import TheQuiz    from 'components/quiz/TheQuiz.vue'

export interface State {
  stack: any
}

interface WindowManager {
  state: State
  open: (window: any, option?: { delay?: number }) => void
  close: (window: any, option?: { delay?: number }) => void
  toggle: (window: any, option?: { delay?: number }) => void
  closeAll: (window: any, option?: { delay?: number, interval?: number }) => void
  moveToLast: (window: any, option?: { delay?: number }) => Promise<boolean>
}

const storeSymbol: InjectionKey<null> = Symbol('windowManager')

export const provideWindowManager = () => provide(storeSymbol, createStore())

export const useWindowManager = (): WindowManager => {
  const storeValues = inject(storeSymbol)
  if (!storeValues) {
    throw new Error('useWindowManager is called without provider.')
  }
  return storeValues
}

const createStore = (): WindowManager => {
  const state = reactive<State>({
    stack: new SuperArray<any>(),
  })

  const isOpened = (window: any) => state.stack.includes(window)

  const isClosed = (window: any) => !state.stack.includes(window)

  const openable = (window: any) => typeof(unref(window)?.open) === 'function'

  const closable = (window: any) => typeof(unref(window)?.close) === 'function'

  /**
   * 第一引数のwindowを開く関数
   * @param {object} window // windowオブジェクト
   * @param {object}
   * @prop {number} delay   // windowを開くまでの待機時間(ms)
   */
  const open = async (window: any, { delay = 0 } = {}) => {
    if (isClosed(window)) {
      await sleep(delay)
      state.stack.push(window)

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
  const close = async (window: any, { delay = 0 } = {}) => {
    if (isOpened(window)) {
      await sleep(delay)
      state.stack.delete(window)

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
  const toggle = async (window: any, { delay = 0 } = {}) => {
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

    while (state.stack.size) {
      const window = state.stack.pop()
      if (closable(window)) {
        unref(window).close()
      }
      if (state.stack.size) {
        await sleep(interval)
      }
    }
  }

  /**
   * 第一引数のwindowを配列の末尾に移動させる関数
   * @param {object} window   対象となるwindow
   * @return {boolean}        移動できたかどうか
   */
  const moveToLast = async (window: any, { delay = 0 } = {}): Promise<boolean> => {
    const from = state.stack.indexOf(window)
    const to = state.stack.lastIndex
    await sleep(delay)
    return state.stack.move(from, to)
  }

  return {
    state,
    open,
    close,
    toggle,
    closeAll,
    moveToLast,
  }
}

export const WINDOWS: Windows = {
  THE_MATRIX: markRaw(TheMatrix3),
  THE_AUDIO : markRaw(TheAudios),
  THE_BUTTON: markRaw(TheButtons),
  THE_EDITOR: markRaw(TheEditor),
  THE_GPT_2 : markRaw(GPT2),
  THE_USER  : markRaw(TheUser),
  THE_QUIZ  : markRaw(TheQuiz),
}
