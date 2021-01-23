<template>
  <VirtualWindow
    v-model:top="windowState.top"
    v-model:left="windowState.left"
    v-model:width="windowState.width"
    v-model:height="windowState.height"
    v-bind="windowState"
    v-on="windowEvents"
  >
    <template #header>
      <HeaderItemBox>
        <HeaderItem
          name="times"
          @click="closeWindow"
        />
      </HeaderItemBox>
    </template>
    <template #default>
      <ContentWrapper>
        <div
          v-for="(value, key) in AUDIOS"
          :key="key"
        >
          <div
            v-for="(value2, key2) in value"
            :key="key2"
            class="sound"
          >
            <AppButton @[`${MOUSE_TOUCH_EVENT.START}Passive`]="playAudio(value2)">
              {{ key2 }}
            </AppButton>
          </div>
          <br><br>
        </div>
      </ContentWrapper>
    </template>
  </VirtualWindow>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { MOUSE_TOUCH_EVENT } from '@/utils/event_functions'

export default defineComponent({
  name: 'TheAudios',
  emits: [ 'touch' ],
  setup(props, { emit }) {
    const { deactivate } = useMatrix()
    const { playAudio } = useSound()

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '100%',
      height: '80%',
      draggable: true,
      resizableV: true,
      legend: {
        text: 'Audios',
        type: 'inside',
      },
    })
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }
    // ウィンドウを閉じる処理
    const closeWindow = () => {
      deactivate(WINDOWS.THE_AUDIOS)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return {
      AUDIOS,
      playAudio,
      windowState,
      windowEvents,
      closeWindow,
      MOUSE_TOUCH_EVENT,
    }
  }
})
</script>

<style scoped>
.sound {
  display: inline-block;
  margin: 5px;
}
</style>