<template>
  <AppVirtualWindow legend="MATRIX" width="300px" v-on="windowEvents">
    <EditableWindow
      ref="editable"
      :value="currentCommand"
      @input="onInput"
      @keydown.up.exact="onKeydownUp"
      @keydown.down.exact="onKeydownDown"
      @keydown.enter.exact="onKeydownEnter"
    />
  </AppVirtualWindow>
</template>

<script>
import { defineComponent, ref } from 'vue'

import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

import EditableWindow from '@/components/editor/EditableWindow'

import useCommand from '@/composables/useCommand'

export default defineComponent({
  components: {
    EditableWindow,
  },
  emits: [
    'touch',
    'windowCommand',
    'themeCommand',
    'invalidCommand',
  ],
  setup(props, { emit }) {
    const editable = ref(null)

    const {
      currentCommand,
      setCommand,
      back2prev,
      go2next,
      execute,
    } = useCommand()

    // 最前面に表示された時に自動的にフォーカスする
    // TODO: mousedownからmouseupまでに時間がかかるとフォーカスが外れる
    // watch(() => state[WINDOWS.THE_MATRIX].level, level => {
    //   if (level === 5) {
    //     setTimeout(() => {
    //       editable.value.focus()
    //     }, 300)
    //   }
    // })

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    // ウィンドウを開くコマンド
    const windowCommand = windowName => {
      emit('windowCommand', windowName)
      editable.value.blur()
      return true
    }

    // ページテーマを変更するコマンド
    const themeCommand = themeName => {
      emit('themeCommand', themeName)
      editable.value.blur()
      return true
    }

    // 無効なコマンド
    const invalidCommand = () => {
      emit('invalidCommand')
      return false
    }

    // コマンド実行処理
    const execCommand = () => {
      const command = execute()

      switch (command.trim().toUpperCase()) {
      case 'AUDIO'  : return windowCommand('THE_AUDIO')
      case 'BUTTON' : return windowCommand('THE_BUTTON')
      case 'EDITOR' : return windowCommand('THE_EDITOR')
      case 'GPT2'   : return windowCommand('THE_GPT_2')
      case 'USER'   : return windowCommand('THE_USER')
      case 'QUIZ'   : return windowCommand('THE_QUIZ')
      case 'DARK'   : return themeCommand('DARK')
      case 'LIGHT'  : return themeCommand('LIGHT')
      case 'CLASSIC': return themeCommand('CLASSIC')
      default       : return invalidCommand()
      }
    }

    // inputイベント時の処理
    const onInput = value => {
      if (!(event.type === 'keydown' && event.key === 'Enter')) {
        setCommand(value)
      }
    }

    // 上矢印キー押下時の処理
    const onKeydownUp = () => back2prev()

    // 下矢印キー押下時の処理
    const onKeydownDown = () => go2next()

    // Enterキー押下時の処理
    const onKeydownEnter = () => execCommand()

    return {
      editable,
      windowEvents,
      currentCommand,
      onInput,
      onKeydownUp,
      onKeydownDown,
      onKeydownEnter,
    }
  },
})
</script>
