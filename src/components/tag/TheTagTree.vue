<template>
  <div v-on="windowEvents">
    <Tree
      :root="tree"
      :itemComponent="QuizTag"
      @mousedown="onTouchTag"
      @click="onClickTag"
    />

    <TheTagEditor
      ref="theTagEditor"
      :tagId="editId"
      @updated="onUpdated"
      @deleted="onDeleted"
      @click-create="onClickCreate"
      @click-cancel="onClickCancelEditor"
    />
    <TheTagCreator
      ref="theTagCreator"
      :tagId="editId"
      @inserted="onInserted"
      @click-cancel="onClickCancelCreator"
    />
  </div>
</template>

<script>
import { defineComponent, ref, provide, inject } from 'vue'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import useWindowManager from '@/store/windowManager'

import QuizTag from '@/components/quiz/QuizTag'
import TreeAlpha from '@/components/tree/TreeAlpha'
import TheTagCreator from './TheTagCreator'
import TheTagEditor from './TheTagEditor'

import useTree from '@/composables/useTree'

import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

export default defineComponent({
  components: {
    Tree: TreeAlpha,
    TheTagCreator,
    TheTagEditor,
  },
  emits: ['touch'],

  setup(props, { emit }) {
    const { playAudio } = useAudio()

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const editId = ref(0)
    const theTagEditor = ref(null)
    const theTagCreator = ref(null)

    const {
      open: openEditor,
      close: closeEditor,
    } = useWindowManager(theTagEditor)

    const {
      open: openCreator,
      close: closeCreator,
    } = useWindowManager(theTagCreator)

    const {
      TREE_STATE,
      state: treeState,
      dragOptionSingle,
      dragOptionUnit,
    } = useTree()

    provide('treeState', treeState)
    provide('dragOptionSingle', dragOptionSingle)
    provide('dragOptionUnit', dragOptionUnit)

    const tree = inject('tree')
    const toggleActiveTagId = inject('toggleActiveTagId')

    // タグへの(mousedown/touchstart)時の処理
    const onTouchTag = id => {
      switch (treeState.mode) {
      case TREE_STATE.LOCK_MODE:
        if (toggleActiveTagId(id))
          playAudio(AUDIOS.ETC.CYBER_15_1)
        else
          playAudio(AUDIOS.ETC.CYBER_15_2)
        break
      case TREE_STATE.DROP_MODE:
        // TODO: something
        break
      case TREE_STATE.EDIT_MODE:
        // editId.value = id
        break
      }
    }

    // タグのclick時の処理
    const onClickTag = id => {
      switch (treeState.mode) {
      case TREE_STATE.LOCK_MODE:
        // TODO: something
        break
      case TREE_STATE.DROP_MODE:
        // TODO: something
        break
      case TREE_STATE.EDIT_MODE:
        editId.value = id
        openEditor()
        break
      }
    }

    // タグが更新された時の処理
    const onUpdated = () => {
      // loadTree()
      closeEditor()
    }
    // タグが削除された時の処理
    const onDeleted = () => {
      // loadTree()
      closeEditor()
    }
    // EditorのCreateボタン押下時の処理
    const onClickCreate = () => {
      openCreator()
    }
    // EditorのCancelボタン押下時の処理
    const onClickCancelEditor = () => {
      closeEditor()
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    // タグが挿入された時の処理
    const onInserted = () => {
      // loadTree()
      closeCreator()
    }
    // CreatorのCancelボタン押下時の処理
    const onClickCancelCreator = () => {
      closeCreator()
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return {
      windowEvents,
      editId,
      theTagEditor,
      theTagCreator,
      QuizTag,
      tree,
      onTouchTag,
      onClickTag,
      onUpdated,
      onDeleted,
      onClickCreate,
      onClickCancelEditor,
      onInserted,
      onClickCancelCreator,
    }
  },
})
</script>
