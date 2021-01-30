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
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'
import QuizTag from '@/components/QuizTag'
import TreeAlpha from '@/components/TreeAlpha'
import TheTagCreator from '@/components/TheTagCreator'
import TheTagEditor from '@/components/TheTagEditor'
import useTree from '@/composables/useTree'

export default defineComponent({
  components: {
    Tree: TreeAlpha,
    TheTagCreator,
    TheTagEditor,
  },
  emits: [ 'touch' ],

  setup(props, { emit }) {
    const { playAudio } = useAudio()

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const editId = ref(0)
    const theTagEditor = ref(null)
    const theTagCreator = ref(null)

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
        theTagEditor.value.open()
        break
      }
    }

    // タグが更新された時の処理
    const onUpdated = () => {
      // loadTree()
      theTagEditor.value.close()
    }
    // タグが削除された時の処理
    const onDeleted = () => {
      // loadTree()
      theTagEditor.value.close()
    }
    // EditorのCreateボタン押下時の処理
    const onClickCreate = () => {
      theTagCreator.value.open()
    }
    // EditorのCancelボタン押下時の処理
    const onClickCancelEditor = () => {
      theTagEditor.value.close()
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    // タグが挿入された時の処理
    const onInserted = () => {
      // loadTree()
      theTagCreator.value.close()
    }
    // CreatorのCancelボタン押下時の処理
    const onClickCancelCreator = () => {
      theTagCreator.value.close()
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
  }
})
</script>