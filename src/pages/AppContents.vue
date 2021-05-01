<template>
  <!-- <div id="contents" @click.once="loadAudios"> -->
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
  <TheWindows />

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
  <!-- </div> -->
</template>

<script>
import { defineComponent } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import { injectStore as injectWindowManager } from '@/store/windowManager'
import TheWindows from '@/components/window/TheWindows'

export default defineComponent({
  components: { TheWindows },
  async setup() {
    const matrix = useMatrix()
    const { loadAudio } = useAudio()

    const loadAudios = () => {
      loadAudio(AUDIOS.QUIZ)
      loadAudio(AUDIOS.ETC)
    }

    const {
      stack: windows,
      open: openWindow,
      pullUp: pullUpWindow,
    } = injectWindowManager()

    openWindow(WINDOWS.THE_MATRIX)

    // const teleportToFront = name => {
    //   if (matrix.state.frontWindows.last !== name) {
    //     playAudio(AUDIOS.ETC.CYBER_15_3)
    //     matrix.teleportToFront(name)
    //   }
    // }

    return {
      matrix,
      loadAudios,
      windows,
      pullUpWindow,
    }
  },
})
</script>

<style lang="scss" scoped>
#contents {
  position: relative;
  height: 100%;
}
#windows-tab {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
}
</style>
