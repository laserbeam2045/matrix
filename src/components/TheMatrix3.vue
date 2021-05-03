<template>
  <component
    :is="matrixComponent"
    ref="matrix"
    @touch="pullUpMyself"
    @themeCommand="changeTheme"
    @windowCommand="openWindow"
    @invalidCommand="reject"
  />
</template>

<script>
import { defineComponent, ref, computed, markRaw } from 'vue'
import { DEVICE_TYPE } from '@/utilities/v_event_functions'

import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useMatrix, PAGE_THEME } from '@/store/matrix'
import { injectStore as injectWindowManager, WINDOWS } from '@/store/windowManager'

import { useTheme } from '@/composables/useTheme'

import TheMatrix from '@/components/TheMatrix'
import TheMatrix2 from '@/components/TheMatrix2'

export default defineComponent({
  name: 'TheMatrix3',
  setup() {
    const matrix = ref(null)

    const { state } = useMatrix()
    const { playAudio } = useSound()
    const { open, moveToLast } = injectWindowManager()

    const { setTheme } = useTheme()

    const matrixComponent = computed(() =>
      (state.deviceType === DEVICE_TYPE.PC) ?
        markRaw(TheMatrix) :
        markRaw(TheMatrix2)
    )

    const pullUpMyself = () => {
      if (moveToLast(WINDOWS.THE_MATRIX)) {
        playAudio(AUDIOS.ETC.CYBER_15_3)
        if (state.deviceType === DEVICE_TYPE.PC) {
          // TODO: mousedownからmouseupまでに時間がかかるとフォーカスが外れる
          setTimeout(matrix.value.focus, 300)
        }
      }
    }

    // ウィンドウを開く関数
    const openWindow = windowName => {
      open(WINDOWS[windowName])
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // ページテーマを変更する関数
    const changeTheme = themeName => {
      setTheme(PAGE_THEME[themeName])
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // 無効なコマンド
    const reject = () => {
      playAudio(AUDIOS.ETC.CYBER_06_4)
    }

    return {
      matrix,
      matrixComponent,
      openWindow,
      changeTheme,
      reject,
      pullUpMyself,
    }
  },
})
</script>
