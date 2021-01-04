<template>
  <div>
    <VirtualWindow
      v-model:top="windowState.top"
      v-model:left="windowState.left"
      v-model:width="windowState.width"
      v-model:height="windowState.height"
      v-bind="windowState"
      v-on="windowEvents"
    >
      <EditableWindow
        ref="editableWindow"
        :value="command"
        @input="onInput"
        @keydown.up.exact="onKeydownUp"
        @keydown.down.exact="onKeydownDown"
        @keydown.enter.exact="onKeydownEnter"
      />
    </VirtualWindow>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { PAGE_THEME, MOUSE_TOUCH_EVENT } from '@/store/constants'
import EditableWindow from '@/components/organisms/EditableWindow'
import useCommand from '@/composables/useCommand'

export default defineComponent({
  name: 'TheMatrix',
  components: { EditableWindow },
  emits: [ 'touch' ],
  
  setup(props, { emit }) {
    const editableWindow = ref(null)

    const cmdManager = useCommand()
    const { playAudio } = useSound()
    const { state, activate, setPageTheme } = useMatrix()

    // 最前面に表示された時に自動的にフォーカスする
    // TODO: mousedownからmouseupまでに時間がかかるとフォーカスが外れる
    watch(() => state[WINDOWS.THE_MATRIX].level, level => {
      if (level === 5) {
        setTimeout(() => {
          editableWindow.value.focus()
        }, 300)
      }
    })

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '300px',
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

    // ウィンドウを開く関数
    const openWindow = name => {
      activate(name)
      playAudio(AUDIOS.ETC.DECISION_33)
      editableWindow.value.blur()
    }

    // ページテーマを変更する関数
    const changeTheme = theme => {
      setPageTheme(theme)
      editableWindow.value.blur()
    }

    // inputイベント時の処理
    const onInput = value => {
      if (!(event.type === 'keydown' && event.key === 'Enter')) {
        cmdManager.setCommand(value)
      }
    }

    // 上矢印キー押下時の処理
    const onKeydownUp = () => cmdManager.back2prev()

    // 下矢印キー押下時の処理
    const onKeydownDown = () => cmdManager.go2next()

    // Enterキー押下時の処理
    const onKeydownEnter = () => execCommand()

    // コマンド実行処理
    const execCommand = () => {
      const command = cmdManager.execute()
      switch (command.trim().toUpperCase()) {
      case 'DATA'   : openWindow(WINDOWS.THE_USER_DATA); break
      case 'AUDIO'  : openWindow(WINDOWS.THE_AUDIOS); break
      case 'GPT-2'  : openWindow(WINDOWS.THE_GPT_2); break
      case 'DARK'   : changeTheme(PAGE_THEME.DARK); break
      case 'LIGHT'  : changeTheme(PAGE_THEME.LIGHT); break
      case 'CLASSIC': changeTheme(PAGE_THEME.CLASSIC); break
      default       : playAudio(AUDIOS.ETC.CYBER_06_4); return false
      }
      return true
    }

    return {
      editableWindow,
      windowState,
      windowEvents,
      command: cmdManager.currentCommand,
      onInput,
      onKeydownUp,
      onKeydownDown,
      onKeydownEnter,
    }
  }
})
</script>