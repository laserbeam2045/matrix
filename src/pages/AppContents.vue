<template>
  <div class="main" :class="theme" @click.once="loadAudios">
    <TheWindows />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useTheme } from 'store/useTheme'
import { useAudio, AUDIOS } from 'store/useAudio'
import { useWindowManager, WINDOWS } from 'store/useWindowManager'

import TheWindows from 'components/window/TheWindows.vue'

export default defineComponent({
  components: {
    TheWindows,
  },
  async setup() {
    const { theme } = useTheme()

    const { loadAudio } = useAudio()

    const { open: openWindow } = useWindowManager()

    const loadAudios = () => {
      loadAudio(AUDIOS.QUIZ)
      loadAudio(AUDIOS.ETC)
    }

    openWindow(WINDOWS.THE_MATRIX)

    return {
      theme,
      loadAudios,
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
