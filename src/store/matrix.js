import { reactive, computed, provide, inject } from 'vue'
import { DEVICE_TYPE, getDeviceType } from '@/utilities/v_event_functions'

const storeSymbol = Symbol('matrix')

export const provideStore = () => provide(storeSymbol, createStore())

export const useStore = () => inject(storeSymbol)

// ページテーマ
export const PAGE_THEME = {
  DARK   : 'dark',
  LIGHT  : 'light',
  CLASSIC: 'classic',
}

const createStore = () => {
  const state = reactive({
    deviceType: getDeviceType(),
  })

  // ユーザーの端末がPCの場合に真となる
  const isPC = computed(() => (
    state.deviceType === DEVICE_TYPE.PC
  ))

  // ユーザーの端末がモバイルの場合に真となる
  const isMobile = computed(() => (
    state.deviceType === DEVICE_TYPE.SMART_PHONE ||
    state.deviceType === DEVICE_TYPE.TABLET
  ))

  return {
    state, //: readonly(state),
    isPC,
    isMobile,
  }
}
