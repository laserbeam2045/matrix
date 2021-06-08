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

<script lang="ts">
import { defineComponent, Ref, ref, computed, markRaw } from 'vue'

import { Theme } from 'types/theme'
import { WindowName } from 'types/windows'

import { useMatrix } from 'store/useMatrix'
import { useWindowManager, WINDOWS } from 'store/useWindowManager'
import { useAudio, AUDIOS } from 'store/useAudio'
import { useTheme } from 'store/useTheme'

import TheMatrix from 'components/TheMatrix.vue'
import TheMatrix2 from 'components/TheMatrix2.vue'

type Matrix = Ref<null |
  InstanceType<typeof TheMatrix> |
  InstanceType<typeof TheMatrix2>
>

export default defineComponent({
  name: 'TheMatrix3',
  setup() {
    const matrix: Matrix = ref(null)

    const { isPC } = useMatrix()
    const { playAudio } = useAudio()
    const { open, moveToLast } = useWindowManager()

    const { setTheme } = useTheme()

    const matrixComponent = computed(() =>
      isPC.value ? markRaw(TheMatrix) : markRaw(TheMatrix2)
    )

    // ウィンドウを開く関数
    const openWindow = (windowName: WindowName) => {
      open(WINDOWS[windowName])
      playAudio(AUDIOS.ETC.DECISION_33)
    }

    // ページテーマを変更する関数
    const changeTheme = (theme: Theme) => {
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
        setTimeout(() => matrix.value?.focus(), 300)
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
