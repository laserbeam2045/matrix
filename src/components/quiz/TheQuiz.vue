<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <div
    v-if="tree"
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
        <div class="menu h-full">
          <h1 class="headingA">Question</h1>
          <h1 class="headingB">Tag</h1>
          <AppScrollable class="question" position="left">
            <TheQuizList />
          </AppScrollable>
          <AppScrollable class="tag-tree" position="right">
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
  name      : 'TheQuiz',
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
      updateFilters,
      filteredQuizzes,
    } = useQuizFilters(quizzesMatchingSearchQuery)

    const {
      tags,
      tree,
      getQuizTag,
      activeTagIds,
      toggleActiveTagId,
    } = useQuizTags()

    updateFilters([
      // quiz => quiz.tagIds.length === 0,
      quiz => quiz.tagIds.some(id => activeTagIds.value.includes(id)),
    ])

    provide('quizzes', quizzes)
    provide('getUserQuiz', getUserQuiz)
    provide('searchQuery', searchQuery)
    provide('filteredQuizzes', filteredQuizzes)
    provide('tags', tags)
    provide('tree', tree)
    provide('getQuizTag', getQuizTag)
    provide('activeTagIds', activeTagIds)
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

<style lang="scss" scoped>
$headingHeight: 40px;

%heading {
  line-height: $headingHeight;
  color: $green-poison;
  border-bottom: 1px solid $blueLikeColor6;
}

.menu {
  display: grid;
  grid-template-areas:
    "headingA headingB"
    "question tagTree";
  grid-template-rows: $headingHeight repeat(auto-fit, minmax(100px, 1fr));
  grid-template-columns: 1fr 1fr;

  .headingA {
    grid-area: headingA;
    @extend %heading;
  }
  .headingB {
    grid-area: headingB;
    border-left: 1px solid $blueLikeColor6;
    @extend %heading;
  }
  .question {
    grid-area: question;
    overflow: hidden;
  }
  .tag-tree {
    grid-area: tagTree;
    border-left: 1px solid $blueLikeColor6;
  }
}
</style>
