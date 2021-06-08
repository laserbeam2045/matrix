import { InjectionKey, reactive, computed, readonly, provide, inject } from 'vue'
import { DEVICE_TYPE, getDeviceType } from 'utilities/v_event_functions'

const MatrixSymbol: InjectionKey<null> = Symbol('matrix')

// ルートコンポーネントで一度だけ実行します
export const provideMatrix = () => provide(MatrixSymbol, createStore())

// storeを使用するコンポーネント内で実行します
export const useMatrix = (): any => {
  const matrixStore = inject(MatrixSymbol)
  if (!matrixStore) {
    throw new Error('useMatrix() is called without provider.')
  }

  return matrixStore
}

// storeを作成する関数(呼び出し不要)
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
    state: readonly(state),
    isPC,
    isMobile,
  }
}
