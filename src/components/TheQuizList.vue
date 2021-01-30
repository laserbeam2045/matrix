<template>
  <div v-on="windowEvents">
    <QuizListTable @click-question="openEditor" />

    <TheQuizCreator
      ref="theQuizCreator"
      @inserted="onInsertQuiz"
    />
    <TheQuizEditor
      ref="theQuizEditor"
      :quizId="quizId4Update"
      @updated="onUpdateQuiz"
      @deleted="onDeleteQuiz"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { MOUSE_TOUCH_EVENT } from '@/utils/event_functions'
import QuizListTable from '@/components/QuizListTable'
import TheQuizCreator from '@/components/TheQuizCreator'
import TheQuizEditor from '@/components/TheQuizEditor'

export default defineComponent({
  components: {
    QuizListTable,
    TheQuizCreator,
    TheQuizEditor,
  },
  emits: ['touch' ],

  setup(props, { emit }) {
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    // コンポーネントの参照用
    const theQuizEditor = ref(null)
    const theQuizCreator = ref(null)

    // 更新・削除の対象となるクイズのid
    const quizId4Update = ref(0)

    // 問題の作成ウィンドウを開く処理
    const openCreator = () => {
      theQuizCreator.value.showModal()
    }
    // 問題の編集ウィンドウを開く処理
    const openEditor = id => {
      quizId4Update.value = id
      theQuizEditor.value.showModal()
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
      quizId4Update,
      openCreator,
      openEditor,
      onInsertQuiz,
      onUpdateQuiz,
      onDeleteQuiz,
    }
  }
})
</script>