<template>
  <div id="contents">
    <Teleporter
      v-for="name in matrix.state.frontWindows"
      :key="name"
      :level="matrix.state[name].level"
    >
      <component
        :is="matrix.state[name].component"
        @touch="teleportToFront(name)"
      />
    </Teleporter>
    
    <Teleporter :level="3">
      <div id="windows-tab">
        <VirtualWindowLegend
          v-for="name in matrix.state.hiddenWindows"
          :key="name"
          :legend="{ text: name, type: 'outside' }"
          @touch="teleportToFront(name)"
        />
      </div>
    </Teleporter>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { provideStore as provideMatrix, useStore as useMatrix } from '@/store/matrix'
import { provideStore as provideAudio, useStore as useAudio, AUDIOS } from '@/store/audio'
import { provideStore as provideQuiz, useStore as useQuiz } from '@/store/quiz'
import { provideStore as provideTag, useStore as useTag } from '@/store/quiz_tag'
import VirtualWindowLegend from '@/components/organisms/VirtualWindowLegend'
import Teleporter from '@/components/atoms/Teleporter'

export default defineComponent({
  name: 'AppContents',
  components: {
    VirtualWindowLegend,
    Teleporter,
  },
  async setup() {
    provideMatrix()
    provideAudio()
    provideQuiz()
    provideTag()

    const store = {
      matrix: useMatrix(),
      audio: useAudio(),
      quiz: useQuiz(),
      tag: useTag(),
    }

    // await store.audio.loadAudio(AUDIOS.AVALON)
    await store.audio.loadAudio(AUDIOS.QUIZ)
    await store.audio.loadAudio(AUDIOS.ETC)
    await store.quiz.load()
    await store.tag.load()

    const teleportToFront = name => {
      if (store.matrix.state.frontWindows.tail !== name) {
        store.audio.playAudio(AUDIOS.ETC.CYBER_15_3)
        store.matrix.teleportToFront(name)
      }
    }

    return {
      matrix: store.matrix,
      teleportToFront,
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
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;

  & > ::v-deep(legend) {
    position: relative;
  }
}
</style>