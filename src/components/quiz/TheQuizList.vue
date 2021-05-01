<template>
  <div v-on="windowEvents">
    <QuizListTable @clickQuestion="setQuizId, openEditor" />

    <TheQuizCreator
      ref="theQuizCreator"
      @inserted="onInsertQuiz"
    />
    <TheQuizEditor
      ref="theQuizEditor"
      :quizId="quizId"
      @updated="onUpdateQuiz"
      @deleted="onDeleteQuiz"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'
import QuizListTable from './QuizListTable'
import TheQuizCreator from './TheQuizCreator'
import TheQuizEditor from './TheQuizEditor'
import useWindowManager from '@/store/windowManager'

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

    const { open: openEditor } = useWindowManager(theQuizEditor)
    const { open: openCreator } = useWindowManager(theQuizCreator)

    // 更新・削除の対象となるクイズのid
    const quizId = ref(0)

    const setQuizId = id => quizId.value = id

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
      openCreator,
      onInsertQuiz,
      onUpdateQuiz,
      onDeleteQuiz,
    }
  },
})
</script>
