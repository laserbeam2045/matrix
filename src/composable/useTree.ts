import { reactive, computed, readonly } from 'vue'

// Treeのモードフラグ
export type TreeState = 0 | 1 | 2

export interface TreeStates {
  LOCK_MODE: TreeState
  DROP_MODE: TreeState
  EDIT_MODE: TreeState
}

export const TREE_STATES: TreeStates = {
  LOCK_MODE: 0,
  DROP_MODE: 1,
  EDIT_MODE: 2,
}

// DnDを無効化するオプション
const optionDisabled = {
  disabled: true,
}

// 単一のノードごとにDnDさせることを可能にするオプション
const optionSingle = {
  forceFallback: true,
  disabled     : false,
  sort         : false,
  animation    : 200,
  group        : {
    name: 'treeNode',
    pull: 'clone',
    put : false,
  },
}

// ブランチごとDnDさせることを可能にするオプション
const optionUnit = {
  forceFallback: true,
  disabled     : false,
  sort         : true,
  animation    : 250,
  group        : {
    name: 'treeBranch',
    pull: true,
    put : true,
  },
}

export default function useTree() {
  const state = reactive({
    mode  : TREE_STATES.LOCK_MODE, // ツリー全体のモード
    handle: 'tree-node',           // DnDのハンドルとなるclass
  })

  const rootClass = computed(() => {
    switch (state.mode) {
    case TREE_STATES.LOCK_MODE: return 'lock-mode'
    case TREE_STATES.DROP_MODE: return 'drop-mode'
    case TREE_STATES.EDIT_MODE: return 'edit-mode'
    default                   : return 'lock-mode'
    }
  })

  const dragOptionSingle = computed(() => {
    const handle = `.${state.handle}`
    switch (state.mode) {
    case TREE_STATES.LOCK_MODE: return optionDisabled
    case TREE_STATES.DROP_MODE: return { ...optionSingle, handle }
    case TREE_STATES.EDIT_MODE: return optionDisabled
    default                   : return optionDisabled
    }
  })

  const dragOptionUnit = computed(() => {
    const handle = `.${state.handle}`
    switch (state.mode) {
    case TREE_STATES.LOCK_MODE: return optionDisabled
    case TREE_STATES.DROP_MODE: return optionDisabled
    case TREE_STATES.EDIT_MODE: return { ...optionUnit, handle }
    default                   : return optionDisabled
    }
  })

  // Treeのモードフラグを変更する関数
  const switchMode = (mode: TreeState) => state.mode = mode

  return {
    state: readonly(state),
    rootClass,
    dragOptionSingle,
    dragOptionUnit,
    switchMode,
  }
}
