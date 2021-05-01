<template>
  <div
    v-if="filteredQuizzes.length && tree"
    v-on="windowEvents"
  >
    <AppVirtualWindow legend="QUIZ" height="75vh">
      <template #buttons>
        <AppHeaderItem
          v-for="item in headerItems"
          :key="item.type"
          :name="item.name"
          v-on="item.events"
        />
      </template>
      <template #header>
        <QuizListQuery />
      </template>
      <template #default>
        <!-- <div class="menu">
          question tag
        </div> -->
        <div class="flex w-full h-full">
          <AppScrollable position="left">
            <TheQuizList />
          </AppScrollable>
          <AppScrollable position="right">
            <TheTagTree />
          </AppScrollable>
        </div>
      </template>
    </AppVirtualWindow>

    <QuizGame v-if="quizMode" />
  </div>
</template>

<script>
import { defineComponent, ref, provide } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'

import useUserQuizzes from '@/composables/useUserQuizzes'
import useQuizStringSearch from '@/composables/useQuizStringSearch'
import useQuizFilters from '@/composables/useQuizFilters'
import useQuizTags from '@/composables/useQuizTags'

import QuizGame from './QuizGame'
import TheQuizList from './TheQuizList'
import QuizListQuery from './QuizListQuery'
import TheTagTree from '@/components/tag/TheTagTree'

export default defineComponent({
  components: {
    QuizListQuery,
    TheQuizList,
    TheTagTree,
    QuizGame,
  },
  emits: ['touch'],

  setup(props, { emit }) {
    const {
      quizzes,
      getUserQuiz,
    } = useUserQuizzes()

    const {
      searchQuery,
      quizzesMatchingSearchQuery,
    } = useQuizStringSearch(quizzes)

    const {
      // filters,
      // updateFilters,
      filteredQuizzes,
    } = useQuizFilters(quizzesMatchingSearchQuery)

    const {
      tags,
      tree,
      activeTagIds,
      getQuizTag,
      toggleActiveTagId,
    } = useQuizTags()

    provide('quizzes', quizzes)
    provide('getUserQuiz', getUserQuiz)
    provide('searchQuery', searchQuery)
    provide('filteredQuizzes', filteredQuizzes)
    provide('tags', tags)
    provide('tree', tree)
    provide('activeTagIds', activeTagIds)
    provide('getQuizTag', getQuizTag)
    provide('toggleActiveTagId', toggleActiveTagId)

    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const { playAudio } = useSound()

    const quizMode = ref(false)

    // クイズを開始する関数
    const startQuiz = () => {
      quizMode.value = true
    }
    // ウィンドウを閉じる処理
    const closeWindow = () => {
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }
    const headerItems = [
      { name: 'quora', events: { click: startQuiz } },
      { name: 'times', events: { click: closeWindow } },
    ]

    return {
      windowEvents,
      headerItems,
      quizMode,
      filteredQuizzes,
      tree,
    }
  },
})
</script>
