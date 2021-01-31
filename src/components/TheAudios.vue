<template>
  <AppVirtualWindow
    v-model:top="windowState.top"
    v-model:left="windowState.left"
    v-model:width="windowState.width"
    v-model:height="windowState.height"
    v-bind="windowState"
    v-on="windowEvents"
  >
    <template #header>
      <AppHeaderItemBox>
        <AppHeaderItem name="times" @click="closeWindow" />
      </AppHeaderItemBox>
    </template>
    <template #default>
      <AppScrollable
        :width="windowState.width"
        :height="windowState.height"
      >
        <div
          v-for="(value, key) in AUDIOS"
          :key="key"
          class="flex flex-wrap justify-center mt-6"
        >
          <div
            v-for="(value2, key2) in value"
            :key="key2"
            class="m-3"
          >
            <AppButtonEffects @[`${MOUSE_TOUCH_EVENT.START}Passive`]="playAudio(value2)">
              {{ key2 }}
            </AppButtonEffects>
          </div>
        </div>
      </AppScrollable>
    </template>
  </AppVirtualWindow>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

export default defineComponent({
  emits: [ 'touch' ],
  setup(_, { emit }) {
    const { deactivate } = useMatrix()
    const { playAudio } = useSound()

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '100%',
      height: '90%',
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
