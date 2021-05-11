import { reactive, computed, readonly, provide, inject } from 'vue'

const storeSymbol = Symbol('tree')

// TheTagTreeのモードフラグ
export const TREE_STATES = {
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
    name: 'treenode',
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
    name: 'treebranch',
    pull: true,
    put : true,
  },
}

const createStore = () => {
  const state = reactive({
    mode  : TREE_STATES.EDIT_MODE,   // ツリー全体のモード
    handle: 'tree-node',     // DnDのハンドルとなるclass
  })
  const rootClass = computed(() => {
    switch (state.mode) {
    case TREE_STATES.LOCK_MODE: return 'lock-mode'
    case TREE_STATES.DROP_MODE: return 'drop-mode'
    case TREE_STATES.EDIT_MODE: return 'edit-mode'
    }
  })
  const dragOptionSingle = computed(() => {
    switch (state.mode) {
    case TREE_STATES.LOCK_MODE: return optionDisabled
    case TREE_STATES.DROP_MODE: return { ...optionSingle, handle: `.${state.handle}` }
    case TREE_STATES.EDIT_MODE: return optionDisabled
    }
  })
  const dragOptionUnit = computed(() => {
    switch (state.mode) {
    case TREE_STATES.LOCK_MODE: return optionDisabled
    case TREE_STATES.DROP_MODE: return optionDisabled
    case TREE_STATES.EDIT_MODE: return { ...optionUnit, handle: `.${state.handle}` }
    }
  })
  // TheTagTreeのモードフラグを変更する関数
  const switchMode = mode => state.mode = mode

  return {
    state: readonly(state),
    rootClass,
    dragOptionSingle,
    dragOptionUnit,
    switchMode,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)
