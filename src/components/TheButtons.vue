<template>
  <AppVirtualWindow legend="Buttons" v-on="windowEvents">
    <template #buttons>
      <AppHeaderItem name="times" @click="closeWindow" />
    </template>
    <template #default>
      <div class="container">
        <AppButton>
          AppButton
        </AppButton>
        <AppButtonCircle>
          AppButtonCircle
        </AppButtonCircle>
        <AppButtonNeon>
          AppButtonNeon
        </AppButtonNeon>
        <AppButtonNeon class="-pink">
          AppButtonNeon
        </AppButtonNeon>
        <AppButtonNeon class="-green">
          AppButtonNeon
        </AppButtonNeon>
      </div>
    </template>
  </AppVirtualWindow>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAudio, AUDIOS } from 'store/useAudio'
import { useWindowManager, WINDOWS } from 'store/useWindowManager'
import { MOUSE_TOUCH_EVENT } from 'utilities/v_event_functions'

export default defineComponent({
  name : 'TheButtons',
  emits: ['touch'],
  setup(_, { emit }) {
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const { close } = useWindowManager()

    const { playAudio } = useAudio()

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      close(WINDOWS.THE_BUTTON)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return {
      windowEvents,
      closeWindow,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: $white;

  & > * {
    margin-top: 50px;
  }
}
</style>
