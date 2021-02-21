<template>
  <div
    v-if="filteredQuizzes.length && tree"
    class="user-data-quiz"
    v-on="windowEvents"
  >
    <AppVirtualWindow
      v-model:top="windowState.top"
      v-model:left="windowState.left"
      v-model:width="windowState.width"
      v-model:height="windowState.height"
      v-bind="windowState"
    >
      <template #header>
        <AppHeaderItemBox>
          <AppHeaderItem
            v-for="item in headerItems"
            :key="item.type"
            :name="item.name"
            v-on="item.events"
          />
        </AppHeaderItemBox>
        <QuizListQuery />
      </template>
      <template #default>
        <!-- <div class="menu">
          question tag
        </div> -->
        <div class="container">
          <AppScrollable
            :width="windowState.width"
            :height="windowState.height"
            position="Left"
          >
            <TheQuizList />
          </AppScrollable>
          <AppScrollable
            :width="windowState.width"
            :height="windowState.height"
          >
            <TheTagTree />
          </AppScrollable>
        </div>
      </template>
    </AppVirtualWindow>

    <QuizGame v-if="quizMode" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, provide } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'
import useUserQuizzes from '@/composables/useUserQuizzes'
import useQuizStringSearch from '@/composables/useQuizStringSearch'
import useQuizFilters from '@/composables/useQuizFilters'
import useQuizTags from '@/composables/useQuizTags'
import QuizListQuery from '@/components/QuizListQuery'
import TheQuizList from '@/components/TheQuizList'
import TheTagTree from '@/components/TheTagTree'
import QuizGame from '@/components/QuizGame'

export default defineComponent({
  components: {
    QuizListQuery,
    TheQuizList,
    TheTagTree,
    QuizGame
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['touch'],

  setup(props, { emit }) {
    const { user } = toRefs(props)

    const { quizzes, getUserQuiz } = useUserQuizzes(user)

    const { searchQuery, quizzesMatchingSearchQuery } = useQuizStringSearch(
      quizzes
    )

    const {
      // filters,
      // updateFilters,
      filteredQuizzes
    } = useQuizFilters(quizzesMatchingSearchQuery)

    const {
      tags,
      tree,
      activeTagIds,
      getQuizTag,
      toggleActiveTagId
    } = useQuizTags(user)

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
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() {
        emit('touch')
      }
    }
    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: 'auto',
      height: '95%',
      legend: {
        text: 'QUIZ',
        type: 'inside'
      }
    })

    const { deactivate } = useMatrix()
    const { playAudio } = useSound()

    const quizMode = ref(false)

    // クイズを開始する関数
    const startQuiz = () => {
      quizMode.value = true
    }
    // ウィンドウを閉じる処理
    const closeWindow = () => {
      deactivate(WINDOWS.THE_USER_DATA)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }
    const headerItems = [
      { name: 'quora', events: { click: startQuiz } },
      { name: 'times', events: { click: closeWindow } }
    ]

    return {
      windowEvents,
      windowState,
      headerItems,
      quizMode,
      filteredQuizzes,
      tree
    }
  }
})
</script>

<style lang="scss" scoped>
.user-data-quiz {
  .container {
    display: flex;
    justify-content: space-around;
    overflow: hidden;
  }
}
</style>
