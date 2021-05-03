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
import { injectStore } from '@/store/windowManager'
import { useStore as useAudio, AUDIOS } from '@/store/audio'

export default defineComponent({
  setup() {
    const { windows, moveToLast } = injectStore()

    const { playAudio } = useAudio()

    const pullUp = window => {
      if (moveToLast(window)) {
        playAudio(AUDIOS.ETC.CYBER_15_3)
      }
    }

    return { windows, pullUp }
  },
})
</script>
