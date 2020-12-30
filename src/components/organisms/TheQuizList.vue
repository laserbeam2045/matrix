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
          <HeaderItem
            v-for="item in headerItems"
            :key="item.type"
            :type="item.type"
            v-on="item.events"
          />
        </HeaderItemBox>
        <TheQuizListQueryBox
          v-model:query="searchQuery"
          :hit-count="quizzes.length"
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
      :quiz-id="quizId4Update"
      @updated="onUpdateQuiz"
      @deleted="onDeleteQuiz"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, provide } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import useUserQuizzes from '@/composables/useUserQuizzes'
import useQuizStringSearch from '@/composables/useQuizStringSearch'
import useQuizFilters from '@/composables/useQuizFilters'
import TheQuizListQueryBox from '@/components/organisms/TheQuizListQueryBox'
import TemplateTableQuiz from '@/components/organisms/TemplateTableQuiz'
import TheQuizCreator from '@/components/organisms/TheQuizCreator'
import TheQuizEditor from '@/components/organisms/TheQuizEditor'

export default defineComponent({
  name: 'QuizList',
  components: {
    TheQuizListQueryBox,
    TemplateTableQuiz,
    TheQuizCreator,
    TheQuizEditor,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    const store = reactive({
      matrix: useMatrix(),
      sound: useSound(),
    })

    const { user } = toRefs(props)

    const { quizzes } = useUserQuizzes(user)

    const {
      searchQuery,
      quizzesMatchingSearchQuery
    } = useQuizStringSearch(quizzes)

    const {
      // filters,
      // updateFilters,
      activeTagIds,
      filteredQuizzes,
    } = useQuizFilters(quizzesMatchingSearchQuery)

    provide('activeTagIds', activeTagIds)

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: 'auto',
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

    // クイズを開始する関数
    const startQuiz = () => {

    }

    // ウィンドウを閉じる処理
    const closeWindow = () => {
      store.matrix.deactivate(WINDOWS.THE_QUIZ_LIST)
      store.sound.playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    const headerItems = [
      { type: 'quora', events: { click: startQuiz }},
      { type: 'plus',  events: { click: openCreator }},
      { type: 'times', events: { click: closeWindow }},
    ]

    return {
      quizzes: filteredQuizzes,
      searchQuery,
      activeTagIds,
      quizId4Update,
      windowState,
      windowEvents,
      theQuizEditor,
      theQuizCreator,
      openEditor,
      onInsertQuiz,
      onUpdateQuiz,
      onDeleteQuiz,
      headerItems,
    }
  }
})
</script>