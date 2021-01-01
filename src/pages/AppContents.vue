<template>
  <div
    id="contents"
    @click.once="loadAudios"
  >
    <TeleporterAtom
      v-for="name in matrix.state.frontWindows"
      :key="name"
      :level="matrix.state[name].level"
    >
      <component
        :is="matrix.state[name].component"
        @touch="teleportToFront(name)"
      />
    </TeleporterAtom>
    
    <TeleporterAtom :level="3">
      <div id="windows-tab">
        <VirtualWindowLegend
          v-for="name in matrix.state.hiddenWindows"
          :key="name"
          :legend="{ text: name, type: 'outside' }"
          @touch="teleportToFront(name)"
        />
      </div>
    </TeleporterAtom>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore as useMatrix } from '@/store/matrix'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import VirtualWindowLegend from '@/components/organisms/VirtualWindowLegend'

export default defineComponent({
  name: 'AppContents',
  components: {
    VirtualWindowLegend,
  },
  async setup() {
    const store = {
      matrix: useMatrix(),
      audio: useAudio(),
    }

    const loadAudios = () => {
      store.audio.loadAudio(AUDIOS.QUIZ)
      store.audio.loadAudio(AUDIOS.ETC)
    }

    const teleportToFront = name => {
      if (store.matrix.state.frontWindows.last !== name) {
        store.audio.playAudio(AUDIOS.ETC.CYBER_15_3)
        store.matrix.teleportToFront(name)
      }
    }

    return {
      matrix: store.matrix,
      teleportToFront,
      loadAudios,
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