<template>
  <div v-on="windowEvents">
    <span class="private">{{ command }}</span>
    <AppVirtualWindow
      v-model:top="windowState.top"
      v-model:left="windowState.left"
      v-model:width="windowState.width"
      v-model:height="windowState.height"
      v-bind="windowState"
    >
      <div class="wrapper">
        <AppReadable
          ref="readable"
          @predict="onPredict"
        />
      </div>
    </AppVirtualWindow>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { PAGE_THEME } from '@/store/constants'
import useCommand from '@/composables/useCommand'
import { isAlphabet } from '@/utils/string_functions'
import { MOUSE_TOUCH_EVENT } from '@/utils/event_functions'

export default defineComponent({
  emits: ['touch'],

  setup(props, { emit }) {
    const readable = ref(null)

    const { playAudio } = useSound()
    const { activate, setPageTheme } = useMatrix()

    const cmdManager = useCommand()

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: 'auto',
      height: 'auto',
      draggable: true,
      legend: {
        text: 'MATRIX',
        type: 'inside',
      },
    })
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const onPredict = ({ data, isFresh }) => {
      if (data === 'DEL') {
        if (isFresh) {
          cmdManager.delCommand()
        }
        readable.value.clear()
        playAudio(AUDIOS.ETC.CYBER_15_2)
      } else if (isAlphabet(data)) {
        readable.value.clear()
        cmdManager.addCommand(data)
        if (!execCommand()) {
          playAudio(AUDIOS.ETC.CYBER_14_1)
        }
      }
    }

    // ウィンドウを開くコマンド
    const openWindow = name => {
      playAudio(AUDIOS.ETC.DECISION_33)
      activate(name)
    }

    // コマンド実行処理
    const execCommand = () => {
      const command = cmdManager.currentCommand.value.toUpperCase()

      switch (command) {
      case 'DATA':
        openWindow(WINDOWS.THE_USER_DATA)
        cmdManager.execute()
        break
      case 'OCR':
        openWindow(WINDOWS.THE_READABLE)
        cmdManager.execute()
        break
      case 'GPT2':
        openWindow(WINDOWS.THE_GPT_2)
        cmdManager.execute()
        break
      case 'AUDIO':
        openWindow(WINDOWS.THE_AUDIOS)
        cmdManager.execute()
        break
      case 'DARK':
        setPageTheme(PAGE_THEME.DARK)
        cmdManager.execute()
        break
      case 'LIGHT':
        setPageTheme(PAGE_THEME.LIGHT)
        cmdManager.execute()
        break
      case 'CLASSIC':
        setPageTheme(PAGE_THEME.CLASSIC)
        cmdManager.execute()
        break
      default:
        return false
      }
      return true
    }

    return {
      readable,
      command: cmdManager.currentCommand,
      windowState,
      windowEvents,
      onPredict,
    }
  }
})
</script>

<style lang="scss" scoped>
body.light-theme {
  .wrapper {
    background: $windowLightBackgroundEditor;
  }
}
body.dark-theme {
  .wrapper {
    background: $windowDarkBackgroundEditor;
  }
}

span.private {
  @include textStyleA;
  display: block;
  position: absolute;
  font-size: 24px;
  top: 10%;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  // margin-left: 0.1px;
}

.wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 10px 10px;
}
</style>