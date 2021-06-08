<template>
  <div v-on="windowEvents">
    <span class="private">{{ currentCommand }}</span>
    <AppVirtualWindow legend="MATRIX">
      <div class="wrapper">
        <AppReadable ref="readable" @predict="onPredict" />
      </div>
    </AppVirtualWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'

import { Theme } from 'types/theme'
import { WindowName } from 'types/windows'

import { useAudio, AUDIOS } from 'store/useAudio'

import useCommand from 'composable/useCommand'

import AppReadable from 'components/AppReadable.vue'

import { isAlphabet } from 'utilities/v_string_functions'
import { MOUSE_TOUCH_EVENT } from 'utilities/v_event_functions'

type Readable = Ref<InstanceType<typeof AppReadable> | null>

export default defineComponent({
  emits: [
    'touch',
    'windowCommand',
    'themeCommand',
  ],
  setup(props, { emit }) {
    const readable: Readable = ref(null)

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const {
      currentCommand,
      addCommand,
      delCommand,
      execute,
    } = useCommand()

    const { playAudio } = useAudio()

    const onPredict = (
      { data, isFresh }:
      { data: string, isFresh: boolean }
    ) => {
      if (data === 'DEL') {
        if (isFresh) {
          delCommand()
        }
        readable.value?.clear()
        playAudio(AUDIOS.ETC.CYBER_15_2)
      } else if (isAlphabet(data)) {
        readable.value?.clear()
        addCommand(data)
        if (checkCommand()) {
          execute()
        }
      }
    }

    // ウィンドウを開くコマンド
    const windowCommand = (windowName: WindowName) => {
      emit('windowCommand', windowName)
      return true
    }

    // ページテーマを変更するコマンド
    const themeCommand = (theme: Theme) => {
      emit('themeCommand', theme)
      return true
    }

    // コマンド実行処理
    const checkCommand = () => {
      const command = currentCommand.value.toUpperCase()

      switch (command) {
      case 'AUDIO'  : return windowCommand('THE_AUDIO')
      case 'BUTTON' : return windowCommand('THE_BUTTON')
      case 'EDITOR' : return windowCommand('THE_EDITOR')
      case 'GPT2'   : return windowCommand('THE_GPT_2')
      case 'USER'   : return windowCommand('THE_USER')
      case 'QUIZ'   : return windowCommand('THE_QUIZ')
      case 'DARK'   : return themeCommand('dark')
      case 'LIGHT'  : return themeCommand('light')
      case 'CLASSIC': return themeCommand('classic')
      default       : return false
      }
    }

    // TheMatrixとメソッドを共通化する目的
    const focus = () => {}

    return {
      focus,
      readable,
      currentCommand,
      windowEvents,
      onPredict,
    }
  },
})
</script>

<style lang="scss" scoped>
.main.dark {
  .wrapper {
    background: $windowDarkBackgroundEditor;
  }
}
.main.light {
  .wrapper {
    background: $windowLightBackgroundEditor;
  }
}
.main.classic {
  .wrapper {
    background: $windowLightBackgroundEditor;
  }
}

span.private {
  @include textStyleA;

  position: absolute;
  top: 10%;
  right: 0;
  left: 0;
  display: block;
  margin: auto;
  font-size: 24px;
  text-align: center;
  // margin-left: 0.1px;
}

div.wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 10px 10px;
}
</style>
