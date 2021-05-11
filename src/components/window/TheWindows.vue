<template>
  <p>
    <span
      v-for="window in windows"
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

<script>
import { defineComponent } from 'vue'
import { injectStore as injectAudio, AUDIOS } from '@/store/audio'
import { injectStore as injectWindowManager } from '@/store/windowManager'

export default defineComponent({
  setup() {
    const { windows, moveToLast } = injectWindowManager()

    const { playAudio } = injectAudio()

    const pullUp = window => {
      if (moveToLast(window)) {
        playAudio(AUDIOS.ETC.CYBER_15_3)
      }
    }

    return { windows, pullUp }
  },
})
</script>
