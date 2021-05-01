import { reactive, computed, provide, inject, markRaw } from 'vue'
import { PAGE_THEME } from '@/store/constants'
import { DEVICE_TYPE, getDeviceType } from '@/utilities/v_event_functions'

import TheMatrix3 from '@/components/TheMatrix3'
import TheAudios from '@/components/TheAudios'
import TheButtons from '@/components/TheButtons'
import TheEditor from '@/components/editor/TheEditor'
import GPT2 from '@/components/editor/GPT2'
import TheUser from '@/components/user/TheUser'
import TheQuiz from '@/components/quiz/TheQuiz'

const storeSymbol = Symbol('matrix')

export const provideStore = () => provide(storeSymbol, createStore())

export const useStore = () => inject(storeSymbol)

export const WINDOWS = {
  THE_MATRIX: markRaw(TheMatrix3),
  THE_AUDIO : markRaw(TheAudios),
  THE_BUTTON: markRaw(TheButtons),
  THE_EDITOR: markRaw(TheEditor),
  THE_GPT_2 : markRaw(GPT2),
  THE_USER  : markRaw(TheUser),
  THE_QUIZ  : markRaw(TheQuiz),
}

const createStore = () => {
  const state = reactive({
    pageTheme : PAGE_THEME.DARK,
    deviceType: getDeviceType(),
  })

  // ユーザーの端末がPCの場合に真となる
  const isPC = computed(() =>
    state.deviceType === DEVICE_TYPE.PC
  )

  // ユーザーの端末がモバイルの場合に真となる
  const isMobile = computed(() => (
    state.deviceType === DEVICE_TYPE.SMART_PHONE ||
    state.deviceType === DEVICE_TYPE.TABLET
  ))

  // ページテーマを変更する関数
  const setPageTheme = theme => {
    if (state.pageTheme !== theme) {
      state.pageTheme = theme
    } else {
      return
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
    state, //: readonly(state),
    isPC,
    isMobile,
    setPageTheme,
  }
}
