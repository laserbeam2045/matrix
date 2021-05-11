<template>
  <div class="main" :class="theme" @click.once="loadAudios">
    <TheWindows />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { WINDOWS } from '@/store/windowManager'
import { useTheme } from '@/store/useTheme'
import { injectStore as injectAudio, AUDIOS } from '@/store/audio'
import { injectStore as injectWindowManager } from '@/store/windowManager'
import TheWindows from '@/components/window/TheWindows'

export default defineComponent({
  components: { TheWindows },
  async setup() {
    const { theme } = useTheme()

    const { loadAudio } = injectAudio()

    const loadAudios = () => {
      loadAudio(AUDIOS.QUIZ)
      loadAudio(AUDIOS.ETC)
    }

    const {
      windows,
      open: openWindow,
    } = injectWindowManager()

    openWindow(WINDOWS.THE_MATRIX)

    return {
      theme,
      loadAudios,
      windows,
    }
  },
})
</script>

<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;

  &.dark {
    color: $blueLikeColor6;
    background: $black;
  }
  &.light {
    color: $black;
    background: $white;
  }
  &.classic {
    color: $black;
    background: $white;
  }
}
</style>
