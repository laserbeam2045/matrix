<template>
  <AppVirtualWindow
    v-bind="windowState"
    v-on="windowEvents"
  >
    <template #header>
      <AppHeaderItemBox>
        <AppHeaderItem name="times" @click="closeWindow" />
      </AppHeaderItemBox>
    </template>
    <template #default>
      <div class="container">
        <AppButton>AppButton</AppButton>
        <AppButtonCircle>AppButtonCircle</AppButtonCircle>
        <AppButtonNeon>AppButtonNeon</AppButtonNeon>
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
      legend: {
        text: 'Buttons',
        type: 'inside',
      },
    })

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      deactivate(WINDOWS.BUTTONS)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return {
      windowState,
      windowEvents,
      closeWindow,
    }
  }
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