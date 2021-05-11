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

import { useTheme } from '@/store/useTheme'
import { injectStore as injectAudio, AUDIOS } from '@/store/audio'
import { injectStore as injectMatrix } from '@/store/matrix'
import { injectStore as injectWindowManager, WINDOWS } from '@/store/windowManager'

import TheMatrix from '@/components/TheMatrix'
import TheMatrix2 from '@/components/TheMatrix2'

export default defineComponent({
  name: 'TheMatrix3',
  setup() {
    const matrix = ref(null)

    const { isPC } = injectMatrix()
    const { playAudio } = injectAudio()
    const { open, moveToLast } = injectWindowManager()

    const { setTheme } = useTheme()

    const matrixComponent = computed(() =>
      isPC.value ? markRaw(TheMatrix) : markRaw(TheMatrix2)
    )

    // ウィンドウを開く関数
    const openWindow = windowName => {
      open(WINDOWS[windowName])
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // ページテーマを変更する関数
    const changeTheme = theme => {
      setTheme(theme)
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // 無効なコマンド
    const reject = () => {
      playAudio(AUDIOS.ETC.CYBER_06_4)
    }

    // 自身のウィンドウを最前面に表示させる関数
    const pullUpMyself = () => {
      if (moveToLast(WINDOWS.THE_MATRIX)) {
        playAudio(AUDIOS.ETC.CYBER_15_3)
      }
      if (isPC.value) {
        // TODO: mousedownからmouseupまでに時間がかかるとフォーカスが外れる
        setTimeout(matrix.value.focus, 300)
      }
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
