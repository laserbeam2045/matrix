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

<script>
import { defineComponent, ref } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import useCommand from '@/composables/useCommand'

import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'
import { isAlphabet } from '@/utilities/v_string_functions'

export default defineComponent({
  emits: [
    'touch',
    'windowCommand',
    'themeCommand',
  ],
  setup(props, { emit }) {
    const readable = ref(null)

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const {
      currentCommand,
      addCommand,
      delCommand,
      execute,
    } = useCommand()

    const { playAudio } = useSound()

    const onPredict = ({ data, isFresh }) => {
      if (data === 'DEL') {
        if (isFresh) {
          delCommand()
        }
        readable.value.clear()
        playAudio(AUDIOS.ETC.CYBER_15_2)
      } else if (isAlphabet(data)) {
        readable.value.clear()
        addCommand(data)
        if (checkCommand()) {
          execute()
        }
      }
    }

    // ウィンドウを開くコマンド
    const windowCommand = windowName => {
      emit('windowCommand', windowName)
      return true
    }

    // ページテーマを変更するコマンド
    const themeCommand = themeName => {
      emit('themeCommand', themeName)
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
      case 'DARK'   : return themeCommand('DARK')
      case 'LIGHT'  : return themeCommand('LIGHT')
      case 'CLASSIC': return themeCommand('CLASSIC')
      default       : return false
      }
    }

    return {
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
