<template>
  <AppVirtualWindow v-bind="windowState" v-on="windowEvents">
    <template #buttons>
      <AppHeaderItem name="times" @click="closeWindow" />
    </template>
    <template #default>
      <AppScrollable>
        <div v-for="(value, key) in AUDIOS" :key="key" class="flex flex-wrap justify-center mt-6">
          {{ key }}
          <div v-for="(value2, key2) in value" :key="key2" class="m-3">
            <component :is="'AppButtonCircle'" @[`${MOUSE_TOUCH_EVENT.START}Passive`]="playAudio(value2)">
              {{ key2 }}
            </component>
          </div>
        </div>
      </AppScrollable>
    </template>
  </AppVirtualWindow>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useAudio, AUDIOS } from 'store/useAudio'
import { useWindowManager, WINDOWS } from 'store/useWindowManager'
import { MOUSE_TOUCH_EVENT } from 'utilities/v_event_functions'

export default defineComponent({
  name : 'TheAudios',
  emits: [
    'touch',
  ],
  setup(_, { emit }) {
    const { playAudio } = useAudio()

    const windowState = reactive({
      width : '99vw',
      height: '90vh',
      legend: 'Audios',
    })

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const { close } = useWindowManager()

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      close(WINDOWS.THE_AUDIO)
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
  },
})
</script>
