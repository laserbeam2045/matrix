<template>
  <div v-on="windowEvents">
    <QuizGameInfo
      v-if="maxQuizNumber === 0"
      @close="closeWindow"
    />

    <VirtualWindow
      v-if="maxQuizNumber && currentQuiz"
      v-model:top="windowState.top"
      v-model:left="windowState.left"
      v-model:width="windowState.width"
      v-model:height="windowState.height"
      v-bind="windowState"
    >
      <template #header>
        <HeaderItemBox>
          <HeaderItem
            type="times"
            @click="closeWindow"
          />
        </HeaderItemBox>
      </template>
      <template #default>
        <ContentWrapper>
          <QuizGameTimer
            ref="quizGameTimer"
            :current-number="gameData.currentQuizNumber"
            :max-number="maxQuizNumber"
            @timeover="checkAnswer"
          />
          <QuizGameQuestion
            ref="quizGameQuestion"
            :question="currentQuiz.question"
            @all-displayed="startTimer"
          />
          <QuizGameAnswer
            ref="quizGameAnswer"
            :answer1="currentQuiz.answer1"
            :answer2="currentQuiz.answer2"
            :game-data="gameData"
          />
          <QuizGameInput
            ref="quizGameInput"
            :answer="answer"
            @push="onPush"
            @tab="openHint"
            @enter="checkAnswer"
          />
        </ContentWrapper>
      </template>
    </VirtualWindow>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, inject } from 'vue'
import { useStore as useSound, AUDIOS }   from '@/store/audio'
import { MOUSE_TOUCH_EVENT }              from '@/store/constants'
import { default as useQuizGame, GAME_STATE } from '@/composables/useQuizGame'
import QuizGameTimer    from '@/components/QuizGameTimer'
import QuizGameQuestion from '@/components/QuizGameQuestion'
import QuizGameAnswer   from '@/components/QuizGameAnswer'
import QuizGameInput    from '@/components/QuizGameInput'
import QuizGameInfo     from '@/components/QuizGameInfo'
import { shuffle }      from '@/utils/array_functions'

const PUSH_KEY_DELAY = 3000      // ボタンを押してからゲージが動き出すまでの待機時間
const NEXT_QUIZ_DELAY = 2000     // 問題が終了してから次の問題までの待機時間
const GAME_START_DELAY = 1000    // ゲーム開始までの待機時間
const DISPLAY_Q_INTERVAL_1 = 100 // 問題文を一文字ごとに表示する間隔（通常時）
const DISPLAY_Q_INTERVAL_2 = 5   // 問題文を一文字ごとに表示する間隔（回答後）

export default defineComponent({
  name: 'QuizGame',
  components: {
    QuizGameTimer,
    QuizGameAnswer,
    QuizGameQuestion,
    QuizGameInput,
    QuizGameInfo,
  },
  emits: [ 'touch' ],
  setup(props, { emit }) {
    const { playAudio } = useSound()

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '352px',
      height: 'auto',
      draggable: true,
      legend: {
        text: 'QUIZ',
        type: 'inside',
      },
      contentsStyle: {
        padding: '15px 20px 20px',
      },
    })
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const filteredQuizzes = inject('filteredQuizzes')

    const quizzes = computed(() => {
      return shuffle(filteredQuizzes.value)
    })

    const {
      gameData,
      maxQuizNumber,
      currentQuiz,
      nextQuiz,
      isCorrect,
    } = useQuizGame(quizzes)

    // 正解の文字列
    const answer = computed(() => currentQuiz.value.answer2)

    // コンポーネントの参照用
    const quizGameTimer = ref(null)
    const quizGameAnswer = ref(null)
    const quizGameQuestion = ref(null)
    const quizGameInput = ref(null)

    // 各種状態変数を初期化する関数
    const initialize = () => {
      quizGameInput.value.initialize()
      quizGameTimer.value.initialize()
      quizGameAnswer.value.initialize()
      quizGameQuestion.value.initialize()
    }
    // ゲームを開始する関数
    const startGame = () => {
      if (maxQuizNumber.value) {
        gameData.state = GAME_STATE.WAITING
        gameData.currentQuizNumber = 0
        startNextGame()
        setTimeout(() => quizGameInput.value.focus(), 100)
      }
    }
    // 次の問題を開始する関数
    const startNextGame = () => {
      gameData.currentQuizNumber++
      playAudio(AUDIOS.QUIZ.QUESTION)
      setTimeout(startOpenQuestion, GAME_START_DELAY)
    }
    // 問題文を表示させるメソッド
    const startOpenQuestion = (interval = DISPLAY_Q_INTERVAL_1) => {
      quizGameQuestion.value.stopOpen()
      quizGameQuestion.value.startOpen(interval)
    }
    // タイマーを始動させるメソッド
    const startTimer = (delay = 0) => {
      quizGameTimer.value.pause()
      quizGameTimer.value.start(delay)
    }
    // 回答ボタン押下時の処理
    const onPush = () => {
      quizGameQuestion.value.stopOpen()
      startTimer(PUSH_KEY_DELAY)
      playAudio(AUDIOS.QUIZ.PRESS_BUTTON)
    }
    // ヒントを表示させるメソッド
    const openHint = () => {
      quizGameAnswer.value.openHint()
      quizGameInput.value.focus()
    }
    // 正誤判定
    const checkAnswer = () => {
      if (gameData.state === GAME_STATE.RESPONDING) {
        quizGameTimer.value.pause()
        startOpenQuestion(DISPLAY_Q_INTERVAL_2)
        playAudio(isCorrect(answer) ? AUDIOS.QUIZ.CORRECT : AUDIOS.QUIZ.WRONG)
        gameData.state = nextQuiz.value ? GAME_STATE.WAITING : GAME_STATE.ENDING
        if (nextQuiz.value) loadNextGame()
      }
    }
    // 次の問題へ移行する関数
    const loadNextGame = () => {
      setTimeout(() => {
        initialize()
        startNextGame()
      }, NEXT_QUIZ_DELAY)
    }
    // ウィンドウを閉じる処理
    const closeWindow = () => {
      // matrix.deactivate()
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    onMounted(() => {
      startGame()
    })

    return {
      windowState,
      windowEvents,
      quizGameTimer,
      quizGameQuestion,
      quizGameAnswer,
      quizGameInput,
      gameData,
      maxQuizNumber,
      currentQuiz,
      answer,
      onPush,
      checkAnswer,
      openHint,
      startGame,
      startTimer,
      closeWindow,
    }
  }
})
</script>