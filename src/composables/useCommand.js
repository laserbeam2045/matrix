import { reactive, computed, readonly } from 'vue'

// コマンドマネージャー
export default function useCommand() {
  const state = reactive({
    commands: [''],   // コマンドの履歴
    cursor: 0,        // 現在入力中のコマンドの位置
  })

  // 現在のコマンド
  const currentCommand = computed({
    get: () => state.commands[state.cursor],
    set: cmd => state.commands[state.cursor] = cmd,
  })

  // コマンドをセットする
  const setCommand = cmd => state.commands[state.cursor] = cmd

  // コマンドをセットする(+1文字)
  const addCommand = char => state.commands[state.cursor] += char

  // コマンドを除去する(-1文字)
  const delCommand = () => currentCommand.value = currentCommand.value.slice(0, -1)

  // 一つ古いコマンドに戻る
  const back2prev = () => {
    if (state.cursor) state.cursor--
  }

  // 一つ新しいコマンドに戻る
  const go2next = () => {
    if ((state.cursor + 1) < state.commands.length) state.cursor++
  }

  // コマンドを実行する
  const execute = () => {
    const command = currentCommand.value
    state.commands.push('')
    state.cursor++
    return command
  }

  return {
    state: readonly(state),
    currentCommand,
    setCommand,
    addCommand,
    delCommand,
    back2prev,
    go2next,
    execute,
  }
}