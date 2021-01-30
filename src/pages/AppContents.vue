<template>
  <div id="contents" @click.once="loadAudios">
    <teleport
      v-for="name in matrix.state.frontWindows"
      :key="name"
      :to="`#layer-${matrix.state[name].level}`"
    >
      <component
        :is="matrix.state[name].component"
        @touch="teleportToFront(name)"
      />
    </teleport>

    <teleport to="#layer-3">
      <div id="windows-tab">
        <AppVirtualWindowLegend
          v-for="name in matrix.state.hiddenWindows"
          :key="name"
          :legend="{ text: name, type: 'outside' }"
          @touch="teleportToFront(name)"
        />
      </div>
    </teleport>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore as useMatrix } from '@/store/matrix'
import { useStore as useAudio, AUDIOS } from '@/store/audio'

export default defineComponent({
  async setup() {
    const matrix = useMatrix()
    const { loadAudio, playAudio } = useAudio()

    const loadAudios = () => {
      loadAudio(AUDIOS.QUIZ)
      loadAudio(AUDIOS.ETC)
    }

    const teleportToFront = name => {
      if (matrix.state.frontWindows.last !== name) {
        playAudio(AUDIOS.ETC.CYBER_15_3)
        matrix.teleportToFront(name)
      }
    }

    return {
      matrix,
      loadAudios,
      teleportToFront,
    }
  }
})
</script>

<style lang="scss" scoped>
#contents {
  position: relative;
  height: 100%;
}
#windows-tab {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;

  & > ::v-deep(legend) {
    position: relative;
  }
}
</style>