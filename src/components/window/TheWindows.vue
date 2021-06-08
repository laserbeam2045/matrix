<template>
  <p>
    <span
      v-for="window in windows.stack"
      :key="window.name"
      @click="pullUp(window)"
    >
      /&nbsp;{{ window.name }}
    </span>
  </p>
  <template v-for="window in windows" :key="window.name">
    <component :is="window" @touch="pullUp(window)" />
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useAudio, AUDIOS } from 'store/useAudio'
import { useWindowManager } from 'store/useWindowManager'

export default defineComponent({
  setup() {
    const { playAudio } = useAudio()

    const { state: windows, moveToLast } = useWindowManager()

    const pullUp = (window: any) => {
      if (moveToLast(window)) {
        playAudio(AUDIOS.ETC.CYBER_15_3)
      }
    }

    return { windows, pullUp }
  },
})
</script>
