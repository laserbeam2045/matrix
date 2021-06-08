<template>
  <div v-on="windowEvents">
    <QuizListTable @clickQuestion="setQuizId($event), openEditor()" />

    <TheQuizCreator
      ref="theQuizCreator"
      @inserted="onInsertQuiz"
    />
    <AppModalWindow ref="theQuizEditor" legend="QUIZ EDITOR">
      <TheQuizEditor
        :quizId="quizId"
        @close="closeEditor"
        @updated="onUpdateQuiz"
        @deleted="onDeleteQuiz"
      />
    </AppModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { useWindowManager } from 'store/useWindowManager'

import QuizListTable from './QuizListTable.vue'
import TheQuizCreator from './TheQuizCreator.vue'
import TheQuizEditor from './TheQuizEditor.vue'

import { MOUSE_TOUCH_EVENT } from 'utilities/v_event_functions'

export default defineComponent({
  components: {
    QuizListTable,
    TheQuizCreator,
    TheQuizEditor,
  },
  emits: ['touch'],

  setup(props, { emit }) {
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    // コンポーネントの参照用
    const theQuizEditor = ref(null)
    const theQuizCreator = ref(null)

    const {
      open: openEditor,
      close: closeEditor,
    } = useWindowManager(theQuizEditor)

    const { open: openCreator } = useWindowManager(theQuizCreator)

    // 更新・削除の対象となるクイズのid
    const quizId = ref(0)

    const setQuizId = (id: number) => {
      quizId.value = id
      console.log(1, quizId.value)
    }

    // 問題の作成が完了した時の処理
    const onInsertQuiz = () => {
      // getUserQuizzes()
    }
    // 問題の編集が完了した時の処理
    const onUpdateQuiz = () => {
      // getUserQuizzes()
    }
    // 問題の削除が完了した時の処理
    const onDeleteQuiz = () => {
      // getUserQuizzes()
    }

    return {
      windowEvents,
      theQuizEditor,
      theQuizCreator,
      quizId,
      setQuizId,
      openEditor,
      closeEditor,
      openCreator,
      onInsertQuiz,
      onUpdateQuiz,
      onDeleteQuiz,
    }
  },
})
</script>
