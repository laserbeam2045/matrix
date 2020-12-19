<template>
  <div v-on="windowEvents">
    <VirtualWindow
      v-model:top="windowState.top"
      v-model:left="windowState.left"
      v-model:width="windowState.width"
      v-model:height="windowState.height"
      v-bind="windowState"
    >
      <template #header>
        <HeaderItemBox>
          <HeaderItem type="times" @click="closeWindow" />
        </HeaderItemBox>
      </template>
      <template #default>
        <Tree
          :root="tree"
          :itemComponent="QuizTag"
          @mousedown="onTouchTag"
          @click="onClickTag"
        />
      </template>
    </VirtualWindow>

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
import { defineComponent, ref, reactive, computed } from 'vue'
import { provideStore as provideTree, useStore as useTree, TREE_STATE } from '@/store/tree'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useAudio, AUDIOS } from '@/store/audio'
import { useStore as useTag } from '@/store/quiz_tag'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import TheTagCreator from '@/components/organisms/TheTagCreator'
import TheTagEditor from '@/components/organisms/TheTagEditor'
import TreeTypeA from '@/components/organisms/TreeTypeA'
import QuizTag from '@/components/organisms/QuizTag'

export default defineComponent({
  name: 'TheTagTree',
  components: {
    TheTagCreator,
    TheTagEditor,
    Tree: TreeTypeA,
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    provideTree()

    const store = {
      matrix: useMatrix(),
      tree: useTree(),
      tag: useTag(),
    }
    const { playAudio } = useAudio()
    const tree = computed(() => store.tag.tree.value)

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: 'auto',
      height: '90%',
      position: 'fixed',
      useResizeV: true,
      draggable: true,
      legend: {
        text: 'QUIZ TAGS',
        type: 'inside',
      },
    })
    const windowEvents = {
      [MOUSE_TOUCH_EVENT.START]() { emit('touch') },
    }

    const editId = ref(0)
    const theTagEditor = ref(null)
    const theTagCreator = ref(null)

    // タグへの(mousedown/touchstart)時の処理
    const onTouchTag = id => {
      switch (store.tree.state.mode) {
      case TREE_STATE.LOCK_MODE:
        if (store.tree.toggleActiveTagId(id)) {
          playAudio(AUDIOS.ETC.CYBER_15_1)
        } else {
          playAudio(AUDIOS.ETC.CYBER_15_2)
        }
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
      switch (store.tree.state.mode) {
      case TREE_STATE.LOCK_MODE:
        // TODO: something
        break
      case TREE_STATE.DROP_MODE:
        // TODO: something
        break
      case TREE_STATE.EDIT_MODE:
        editId.value = id
        theTagEditor.value.showModal()
        break
      }
    }

    // タグが更新された時の処理
    const onUpdated = () => {
      store.tree.load()
      theTagEditor.value.hideModal()
    }
    // タグが削除された時の処理
    const onDeleted = () => {
      store.tree.load()
      theTagEditor.value.hideModal()
    }
    // EditorのCreateボタン押下時の処理
    const onClickCreate = () => {
      theTagCreator.value.showModal()
    }
    // EditorのCancelボタン押下時の処理
    const onClickCancelEditor = () => {
      theTagEditor.value.hideModal()
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    // タグが挿入された時の処理
    const onInserted = () => {
      store.tree.load()
      theTagCreator.value.hideModal()
    }
    // CreatorのCancelボタン押下時の処理
    const onClickCancelCreator = () => {
      theTagCreator.value.hideModal()
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      store.matrix.deactivate(WINDOWS.THE_QUIZ_TAGS)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return {
      windowEvents,
      tree,
      QuizTag,
      TREE_STATE,
      windowState,
      editId,
      theTagEditor,
      theTagCreator,
      onTouchTag,
      onClickTag,
      onUpdated,
      onDeleted,
      onClickCreate,
      onClickCancelEditor,
      onInserted,
      onClickCancelCreator,
      closeWindow,
    }
  }
})
</script>