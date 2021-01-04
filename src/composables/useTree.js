import { reactive, computed, readonly } from 'vue'

// DnDを無効化するオプション
const optionDisabled = {
  disabled: true,
}

// 単一のノードごとにDnDさせることを可能にするオプション
const optionSingle = {
  forceFallback: true,
  disabled: false,
  sort: false,
  animation: 200,
  group: {
    name: 'treenode',
    pull: 'clone',
    put: false,
  },
}

// ブランチごとDnDさせることを可能にするオプション
const optionUnit = {
  forceFallback: true,
  disabled: false,
  sort: true,
  animation: 250,
  group: {
    name: 'treebranch',
    pull: true,
    put: true,
  },
}

export default function useTree() {
  // Treeのモードフラグ
  const TREE_STATE = {
    LOCK_MODE: 0,
    DROP_MODE: 1,
    EDIT_MODE: 2,
  }
  const state = reactive({
    mode: TREE_STATE.LOCK_MODE,   // ツリー全体のモード
    handleClass: 'tree-node',     // DnDのハンドルとなるclass
  })

  const rootClass = computed(() => {
    switch (state.mode) {
      case TREE_STATE.LOCK_MODE: return 'lock-mode'
      case TREE_STATE.DROP_MODE: return 'drop-mode'
      case TREE_STATE.EDIT_MODE: return 'edit-mode'
    }
  })
  const dragOptionSingle = computed(() => {
    switch (state.mode) {
      case TREE_STATE.LOCK_MODE: return optionDisabled
      case TREE_STATE.DROP_MODE: return { ...optionSingle, handle: `.${state.handleClass}` }
      case TREE_STATE.EDIT_MODE: return optionDisabled
    }
  })
  const dragOptionUnit = computed(() => {
    switch (state.mode) {
      case TREE_STATE.LOCK_MODE: return optionDisabled
      case TREE_STATE.DROP_MODE: return optionDisabled
      case TREE_STATE.EDIT_MODE: return { ...optionUnit, handle: `.${state.handleClass}` }
    }
  })

  // Treeのモードフラグを変更する関数
  const switchMode = mode => state.mode = mode

  return {
    TREE_STATE,
    state: readonly(state),
    rootClass,
    dragOptionSingle,
    dragOptionUnit,
    switchMode,
  }
}