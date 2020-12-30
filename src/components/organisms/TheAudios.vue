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
          type="times"
          @click="closeWindow"
        />
      </HeaderItemBox>
    </template>
    <template #default>
      <template
        v-for="(value, key) in AUDIOS"
        :key="key"
      >
        <template
          v-for="(value2, key2) in value"
          :key="key2"
        >
          <ButtonBasicAtom @[MOUSE_TOUCH_EVENT.START]="playAudio(value2)">
            {{ key2 }}
          </ButtonBasicAtom>
        </template>
        <br><br>
      </template>
    </template>
  </VirtualWindow>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import ButtonBasicAtom from '@/components/atoms/ButtonBasicAtom'

export default defineComponent({
  name: 'TheAudios',
  components: {
    ButtonBasicAtom,
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    const { deactivate } = useMatrix()
    const { playAudio } = useSound()

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '100%',
      height: '80%',
      draggable: true,
      legend: {
        text: 'Audios',
        type: 'outside',
      },
    })
    const windowEvents = {
      [MOUSE_TOUCH_EVENT.START]() { emit('touch') },
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
button {
  margin: 3px;
}
</style>