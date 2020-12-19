import { reactive, computed, readonly, provide, inject } from 'vue'
import Aset from '@/utils/AsetClass'

const storeSymbol = Symbol('tree')

// TheTagTreeのモードフラグ
export const TREE_STATE = {
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

const createStore = () => {
  const state = reactive({
    mode: TREE_STATE.EDIT_MODE,   // ツリー全体のモード
    changed: false,               // 木構造に変更が加えられたかどうか
    changing: false,              // 木構造の変更中かどうか
    handleClass: 'tree-node',     // DnDのハンドルとなるclass
    activeTagIds: new Aset(),     // 選択中のタグのidの配列
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
  // TheTagTreeのモードフラグを変更する関数
  const switchMode = mode => state.mode = mode

  // QuizTagクリック時の処理
  const toggleActiveTagId = id => state.activeTagIds.toggle(id)
 
  return {
    state: readonly(state),
    rootClass,
    dragOptionSingle,
    dragOptionUnit,
    switchMode,
    toggleActiveTagId,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)