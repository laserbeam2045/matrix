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

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'

import { Theme } from 'types/theme'
import { WindowName } from 'types/windows'

import useCommand from 'composable/useCommand'

import EditableWindow from 'components/editor/EditableWindow.vue'

import { MOUSE_TOUCH_EVENT } from 'utilities/v_event_functions'

type Editable = Ref<InstanceType<typeof EditableWindow> | null>

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
    const editable: Editable = ref(null)

    const {
      currentCommand,
      setCommand,
      back2prev,
      go2next,
      execute,
    } = useCommand()

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    // ウィンドウを開くコマンド
    const windowCommand = (windowName: WindowName) => {
      emit('windowCommand', windowName)
      // editable.value.blur()
      return true
    }

    // ページテーマを変更するコマンド
    const themeCommand = (themeName: Theme) => {
      emit('themeCommand', themeName)
      // editable.value.blur()
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
      case 'DARK'   : return themeCommand('dark')
      case 'LIGHT'  : return themeCommand('light')
      case 'CLASSIC': return themeCommand('classic')
      default       : return invalidCommand()
      }
    }

    // inputイベント時の処理
    type InputArgs = { event: KeyboardEvent, value: string }
    const onInput = ({ event, value }: InputArgs) => {
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

    const focus = () => editable.value.focus()

    return {
      focus,
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
