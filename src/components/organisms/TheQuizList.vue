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
          <HeaderItem type="quora" @click="startQuiz" />
          <HeaderItem type="plus"  @click="openCreator" />
          <HeaderItem type="times" @click="closeWindow" />
        </HeaderItemBox>
        <TheQuizListQueryBox
          v-model:query="state.query"
          :hitCount="quizzes.length"
        />
      </template>
      <template #default>
        <TemplateTableQuiz
          :quizzes="quizzes"
          @click-question="openEditor"
        />
      </template>
    </VirtualWindow>

    <TheQuizCreator
      ref="theQuizCreator"
      @inserted="onInsertQuiz"
    />
    <TheQuizEditor
      ref="theQuizEditor"
      :quizId="state.quizId4Update"
      @updated="onUpdateQuiz"
      @deleted="onDeleteQuiz"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, computed } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { useStore as useQuiz } from '@/store/quiz'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import TheQuizListQueryBox from '@/components/organisms/TheQuizListQueryBox'
import TemplateTableQuiz from '@/components/organisms/TemplateTableQuiz'
import TheQuizCreator from '@/components/organisms/TheQuizCreator'
import TheQuizEditor from '@/components/organisms/TheQuizEditor'

export default defineComponent({
  name: 'TheQuizList',
  components: {
    TheQuizListQueryBox,
    TemplateTableQuiz,
    TheQuizCreator,
    TheQuizEditor,
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    const store = reactive({
      matrix: useMatrix(),
      sound: useSound(),
      quiz: useQuiz(),
    })

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '100%',
      height: '95%',
      useResizeV: true,
      draggable: true,
      legend: {
        text: 'QUIZ LIST',
        type: 'inside',
      },
    })
    const windowEvents = {
      [MOUSE_TOUCH_EVENT.START]() { emit('touch') },
    }

    // コンポーネントの参照用
    const theQuizEditor = ref(null)
    const theQuizCreator = ref(null)

    const state = reactive({
      query: '',              // 検索ワード
      quizId4Update: 0,       // 更新・削除の対象となるクイズのid
      activeTagIds: [],
    })

    // 特定の文字列を含む問題に絞るフィルター
    const filterByStr = (quizzes, str) => {
      const exp = new RegExp('.?' + str + '.?')
      return quizzes.filter(quiz => (
        quiz.question.match(exp) ||
        quiz.answer1.match(exp) ||
        quiz.answer2.match(exp)
      ))
    }
    // 特定のタグを持つ問題に絞るフィルター
    const filterByTag = (quizzes, set) => {
      return quizzes.filter(quiz => quiz.tagIds.some(id => set.has(id)))
    }
    // どのタグにも属さない問題に絞るフィルター
    const filterByNotBelong = quizzes => {
      return quizzes.filter(quiz => quiz.tagIds.length === 0)
    }
    // フィルタリングされた問題
    const quizzes = computed(() => {
      const strCondition = !!state.query
      const tagCondition = !!state.activeTagIds.size
      let quizzes = store.quiz.data

      if (strCondition) quizzes = filterByStr(quizzes, state.query)
      if (tagCondition) quizzes = filterByTag(quizzes, state.activeTagIds)
      if (!strCondition && !tagCondition) quizzes = filterByNotBelong(quizzes)

      return quizzes
    })

    // 問題の作成ウィンドウを開く処理
    const openCreator = () => {
      theQuizCreator.value.showModal()
    }
    // 問題の作成が完了した時の処理
    const onInsertQuiz = () => {
      store.quiz.load()
    }

    // 問題の編集ウィンドウを開く処理
    const openEditor = id => {
      state.quizId4Update = id
      theQuizEditor.value.showModal()
    }
    // 問題の編集が完了した時の処理
    const onUpdateQuiz = () => {
      store.quiz.load()
    }
    // 問題の削除が完了した時の処理
    const onDeleteQuiz = () => {
      store.quiz.load()
    }

    // クイズを開始する関数
    const startQuiz = () => {
      store.matrix.activate(WINDOWS.THE_QUIZ_GAME)
    }

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      store.matrix.deactivate(WINDOWS.THE_QUIZ_LIST)
      store.sound.playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    return {
      state,
      windowState,
      windowEvents,
      theQuizEditor,
      theQuizCreator,
      quizzes,
      openCreator,
      onInsertQuiz,
      openEditor,
      onUpdateQuiz,
      onDeleteQuiz,
      startQuiz,
      closeWindow,
    }
  },
})
</script>