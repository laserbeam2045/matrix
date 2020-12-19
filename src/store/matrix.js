import { reactive, computed, readonly, provide, inject, nextTick, markRaw } from 'vue'
import { DEVICE_TYPE, PAGE_THEME } from './constants'
import { getDeviceType } from '@/utils/event_functions'
import TheMatrix from '@/components/organisms/TheMatrix'
import TheMatrix2 from '@/components/organisms/TheMatrix2'
import TheQuizList from '@/components/organisms/TheQuizList'
import TheTagTree from '@/components/organisms/TheTagTree'
import TheAudios from '@/components/organisms/TheAudios'
import QuizGame from '@/components/organisms/QuizGame'
import GPT2 from '@/components/organisms/GPT2'
import Aset from '@/utils/AsetClass'

const storeSymbol = Symbol('matrix')

export const WINDOWS = {
  THE_MATRIX    : 'MATRIX',
  THE_QUIZ_LIST : 'QUIZ LIST',
  THE_QUIZ_TAGS : 'QUIZ TAGS',
  THE_QUIZ_GAME : 'QUIZ',
  THE_AUDIOS    : 'AUDIOS',
  THE_GPT_2     : 'GPT-2',
}

const createStore = () => {
  const deviceType = getDeviceType()
  const matrixComponent = (deviceType === DEVICE_TYPE.PC) ? TheMatrix : TheMatrix2

  const state = reactive({
    pageTheme: PAGE_THEME.DARK,
    deviceType,
    windowNumber: 0,
    teleporting: false,
    frontWindows: new Aset([WINDOWS.THE_MATRIX]),
    hiddenWindows: new Aset(),
    [WINDOWS.THE_MATRIX]: {
      level: 5,
      component: markRaw(matrixComponent),
    },
    [WINDOWS.THE_QUIZ_LIST]: {
      level: 5,
      component: markRaw(TheQuizList),
    },
    [WINDOWS.THE_QUIZ_TAGS]: {
      level: 5,
      component: markRaw(TheTagTree),
    },
    [WINDOWS.THE_QUIZ_GAME]: {
      level: 5,
      component: markRaw(QuizGame),
    },
    [WINDOWS.THE_GPT_2]: {
      level: 5,
      component: markRaw(GPT2),
    },
    [WINDOWS.THE_AUDIOS]: {
      level: 5,
      component: markRaw(TheAudios),
    },
  })

  // ユーザーの端末がPCの場合に真となる
  const isPC = computed(() => {
    return state.deviceType === DEVICE_TYPE.PC
  })
  // ユーザーの端末がモバイルの場合に真となる
  const isMobile = computed(() => {
    return (
      state.deviceType === DEVICE_TYPE.SMART_PHONE ||
      state.deviceType === DEVICE_TYPE.TABLET
    )
  })
  // 引数のウィンドウが表示されている状態かどうか
  const isActive = name => state.frontWindows.has(name)

  // ウィンドウを開く関数
  const activate = name => {
    if (state.hiddenWindows.size === 0) {
      state.hiddenWindows.add(WINDOWS.THE_MATRIX)
    }
    if (state.frontWindows.has(name)) {
      teleportToFront(name)
    } else {
      state.hiddenWindows.add(name)
      teleportToFront(name)
      state.frontWindows.add(name)
    }
  }

  // ウィンドウを閉じる関数
  const deactivate = name => {
    state.frontWindows.delete(name)
    state.hiddenWindows.delete(name)
  }

  // 一時的に移動させることで、最前面に表示させる
  const teleportToFront = async name => {
    if (state.frontWindows.tail !== name) {
      const window = state[name]
      const level = window.level
      state.teleporting = true
      state.frontWindows.delete(name)
      state.frontWindows.add(name)
      window.level -= 1
      await nextTick()
      window.level = level
      await nextTick()
      state.teleporting = false
    }
  }

  // ページテーマを変更する関数
  const setPageTheme = theme => {
    if (state.pageTheme === theme) {
      return
    } else {
      state.pageTheme = theme
    }
    switch (theme) {
    case PAGE_THEME.DARK:
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
      document.body.classList.remove('classic-theme')
      break
    case PAGE_THEME.LIGHT:
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
      document.body.classList.remove('classic-theme')
      break
    case PAGE_THEME.CLASSIC:
      document.body.classList.add('classic-theme')
      document.body.classList.remove('dark-theme')
      document.body.classList.remove('light-theme')
      break
    }
  }

  // ウィンドウを使用する際の重複しない値を得る関数
  const getNextWindowNumber = () => ++state.windowNumber

  return {
    state: readonly(state),
    isPC,
    isMobile,
    isActive,
    activate,
    deactivate,
    teleportToFront,
    setPageTheme,
    getNextWindowNumber,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)