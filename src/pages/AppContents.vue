<template>
  <!-- <teleport
    v-for="name in matrix.state.frontWindows"
    :key="name"
    :to="`#layer-${matrix.state[name].level}`"
  > -->
  <!-- <template
    v-for="(window, index) in windows"
    :key="index"
  >
    <component
      :is="window"
      @touch="pullUpWindow"
    />
  </template> -->
  <!-- </teleport> -->
  <div class="main" :class="theme" @click.once="loadAudios">
    <TheWindows />
  </div>

  <!-- <teleport to="#layer-3">
    <div id="windows-tab">
      <AppVirtualWindowLegend
        v-for="name in matrix.state.hiddenWindows"
        :key="name"
        :legend="{ text: name, type: 'outside' }"
        style="position: relative;"
        @touch="teleportToFront(name)"
      />
    </div>
  </teleport> -->
</template>

<script>
import { defineComponent } from 'vue'
import { WINDOWS } from '@/store/windowManager'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import { injectStore as injectWindowManager } from '@/store/windowManager'
import TheWindows from '@/components/window/TheWindows'
import { useTheme } from '@/composables/useTheme'

export default defineComponent({
  components: { TheWindows },
  async setup() {
    const { theme } = useTheme()

    const { loadAudio } = useAudio()

    const loadAudios = () => {
      loadAudio(AUDIOS.QUIZ)
      loadAudio(AUDIOS.ETC)
    }

    const {
      windows,
      open: openWindow,
    } = injectWindowManager()

    openWindow(WINDOWS.THE_MATRIX)

    // const teleportToFront = name => {
    //   if (matrix.state.frontWindows.last !== name) {
    //     playAudio(AUDIOS.ETC.CYBER_15_3)
    //     matrix.teleportToFront(name)
    //   }
    // }

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

#windows-tab {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
}
</style>
