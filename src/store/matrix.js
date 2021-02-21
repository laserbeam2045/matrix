import { reactive, computed, provide, inject, nextTick, markRaw } from 'vue'
import { PAGE_THEME } from '@/constants'
import { DEVICE_TYPE, getDeviceType } from '@/utilities/v_event_functions'
import TheMatrix from '@/components/TheMatrix'
import TheMatrix2 from '@/components/TheMatrix2'
import TheAudios from '@/components/TheAudios'
import TheButtons from '@/components/TheButtons'
import TheUserDataWindows from '@/components/TheUserDataWindows'
import GPT2 from '@/components/GPT2'
import Aset from '@/utilities/Aset'

const storeSymbol = Symbol('matrix')

export const WINDOWS = {
  THE_MATRIX    : 'MATRIX',
  THE_AUDIOS    : 'AUDIOS',
  THE_BUTTONS   : 'BUTTONS',
  THE_GPT_2     : 'GPT2',
  THE_USER_DATA : 'USER DATA',
}

const createStore = () => {
  const deviceType = getDeviceType()
  const matrixComponent = (deviceType === DEVICE_TYPE.PC) ? TheMatrix : TheMatrix2
  // const matrixComponent = (deviceType === DEVICE_TYPE.PC) ? TheMatrix2 : TheMatrix

  const state = reactive({
    pageTheme: PAGE_THEME.DARK,
    deviceType,
    teleporting: false,
    frontWindows: new Aset([ WINDOWS.THE_MATRIX ]),
    hiddenWindows: new Aset(),
    [WINDOWS.THE_MATRIX]: {
      level: 5,
      component: markRaw(matrixComponent),
    },
    [WINDOWS.THE_USER_DATA]: {
      level: 5,
      component: markRaw(TheUserDataWindows),
      userIds: new Aset([ 0 ]),
    },
    [WINDOWS.THE_GPT_2]: {
      level: 5,
      component: markRaw(GPT2),
    },
    [WINDOWS.THE_AUDIOS]: {
      level: 5,
      component: markRaw(TheAudios),
    },
    [WINDOWS.THE_BUTTONS]: {
      level: 5,
      component: markRaw(TheButtons),
    }
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
    if (state.frontWindows.last !== name) {
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

  return {
    state,//: readonly(state),
    isPC,
    isMobile,
    isActive,
    activate,
    deactivate,
    teleportToFront,
    setPageTheme,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)