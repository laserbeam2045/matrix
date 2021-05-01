<template>
  <component
    :is="matrixComponent"
    @touch="pullUp(matrixComponent)"
    @windowCommand="openWindow"
    @themeCommand="changeTheme"
    @invalidCommand="reject"
  />
</template>

<script>
import { defineComponent, computed, markRaw } from 'vue'
import { DEVICE_TYPE } from '@/utilities/v_event_functions'

import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { injectStore as injectWindowManager } from '@/store/windowManager'

import TheMatrix from '@/components/TheMatrix'
import TheMatrix2 from '@/components/TheMatrix2'

export default defineComponent({
  setup() {
    const { state, setPageTheme } = useMatrix()
    const { open, pullUp } = injectWindowManager()
    const { playAudio } = useSound()

    const matrixComponent = computed(() =>
      (state.deviceType === DEVICE_TYPE.PC) ?
        markRaw(TheMatrix) :
        markRaw(TheMatrix2)
    )

    // 最前面に表示された時に自動的にフォーカスする
    // TODO: mousedownからmouseupまでに時間がかかるとフォーカスが外れる
    // watch(() => state[WINDOWS.THE_MATRIX].level, level => {
    //   if (level === 5) {
    //     setTimeout(() => {
    //       editableWindow.value.focus()
    //     }, 300)
    //   }
    // })

    // ウィンドウを開く関数
    const openWindow = windowName => {
      open(WINDOWS[windowName])
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // ページテーマを変更する関数
    const changeTheme = themeName => {
      setPageTheme(themeName)
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // 無効なコマンド
    const reject = () => {
      playAudio(AUDIOS.ETC.CYBER_06_4)
    }

    return {
      matrixComponent,
      openWindow,
      changeTheme,
      reject,
      pullUp,
    }
  },
})
</script>
