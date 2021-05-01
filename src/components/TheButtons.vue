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

<script>
import { defineComponent } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

export default defineComponent({
  emits: ['touch'],
  setup(_, { emit }) {
    const { deactivate } = useMatrix()
    const { playAudio } = useSound()

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      deactivate(WINDOWS.BUTTONS)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return { windowEvents, closeWindow }
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
