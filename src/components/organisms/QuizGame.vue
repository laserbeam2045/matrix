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
          <HeaderItem type="times" @click="closeWindow" />
        </HeaderItemBox>
      </template>
      <template #default>
        <QuizGameTimer
          ref="quizGameTimer"
          :timeLimit="state.timeLimit"
          :currentNumber="state.currentQuizNumber"
          :maxNumber="maxQuizNumber"
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
          :isAnswered="state.isAnswered"
        />
        <BaseInputText
          ref="baseInputText"
          :value="state.inputText"
          :style="inputTextStyle"
          @update:value="onUpdateText"
          @keydown="pressKeyEvent"
          @keydown.enter="pressEnterKeyEvent"
        />
        <ButtonBasicAtom
          :style="buttonStyle"
          @focus="openHint"
        />
      </template>
    </VirtualWindow>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useStore as useMatrix, WINDOWS } from '@/store/matrix'
import { useStore as useSound, AUDIOS }   from '@/store/audio'
import { useStore as useQuiz }            from '@/store/quiz'
import { MOUSE_TOUCH_EVENT }              from '@/store/constants'
import QuizGameTimer    from '@/components/organisms/QuizGameTimer'
import QuizGameQuestion from '@/components/organisms/QuizGameQuestion'
import QuizGameAnswer   from '@/components/organisms/QuizGameAnswer'
import QuizGameInfo     from '@/components/organisms/QuizGameInfo'
import BaseInputText   from '@/components/atoms/BaseInputText'
import ButtonBasicAtom from '@/components/atoms/button-basic-atom'
import { hira2kata }   from '@/utils/string_functions'
import { shuffle }     from '@/utils/array_functions'

const TIME_LIMIT = 10000         // 一問あたりの制限時間
const PUSH_KEY_DELAY = 3000      // ボタンを押してからゲージが動き出すまでの待機時間
const NEXT_QUIZ_DELAY = 2000     // 問題が終了してから次の問題までの待機時間
const GAME_START_DELAY = 1000    // ゲーム開始までの待機時間
const DISPLAY_Q_INTERVAL_1 = 100 // 問題文を一文字ごとに表示する間隔（通常時）
const DISPLAY_Q_INTERVAL_2 = 5   // 問題文を一文字ごとに表示する間隔（回答後）

const STATE_WAITING = 0   // 待機状態
const STATE_PLAYING = 1   // ゲーム中の状態
const STATE_ENDGAME = 2   // ゲームが終了した状態

export default defineComponent({
  name: 'QuizGame',
  components: {
    QuizGameTimer,
    QuizGameAnswer,
    QuizGameQuestion,
    QuizGameInfo,
    BaseInputText,
    ButtonBasicAtom,
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    const matrix = useMatrix()
    const quizStore = useQuiz()
    const { playAudio } = useSound()

    const state = reactive({
      stage: STATE_WAITING,     // 状態フラグ
      isPressed: false,         // 現在の問題について、ボタンが押されたかどうか
      isAnswered: false,        // 現在の問題について、回答済みかどうか
      inputText: '',            // 回答者が入力した文字列
      timeLimit: TIME_LIMIT,    // 制限時間
      currentQuizNumber: 0,     // 現在の問題が何問目であるか
      activeTagIds: [],
    })

    const windowState = reactive({
      top: 'center',
      left: 'center',
      width: '382px',
      height: 'auto',
      draggable: true,
      legend: {
        text: 'QUIZ',
        type: 'inside',
      },
      contentsStyle: {
        padding: '0 30px 30px',
      },
    })
    const windowEvents = {
      [MOUSE_TOUCH_EVENT.START]() { emit('touch') },
    }
    const inputTextStyle = {
      'width' : '100%',
      'margin': '30px 0 0',
    }
    const buttonStyle = {
      'position': 'absolute',
      'z-index' : -1,
      'opacity' : 0,
    }

    // 選択タグが０ならなし、０以外なら選択タグに絞る
    const quizzes = computed(() => {
      if (state.activeTagIds.size) {
        return shuffle(quizStore.data.value.map(quiz =>
          (quiz.tagIds.some(id => state.activeTagIds.has(id))) && quiz
        )
        .filter(elm => elm))
      } else {
        return []
      }
    })
    // 総問題数
    const maxQuizNumber = computed(() => {
      return quizzes.value.length
    })
    // 現在の問題
    const currentQuiz = computed(() => {
      return quizzes.value[state.currentQuizNumber - 1]
    })
    // 次の問題
    const nextQuiz = computed(() => {
      return quizzes.value[state.currentQuizNumber]
    })
    // 答えの文字列（ひらがなをカタカナに変換したもの）
    const answerAsKatakana = computed(() => {
      return hira2kata(currentQuiz.value.answer2)
    })
    // 入力された文字列（ひらがなをカタカナに変換したもの）
    const inputTextAsKatakana = computed(() => {
      return hira2kata(state.inputText)
    })
    // 現在入力されている文字列が、正解と等しいかどうか
    const isCorrect = computed(() => {
      const exp = new RegExp(`^${answerAsKatakana.value}.*`)
      return inputTextAsKatakana.value.match(exp)
    })
    // 正誤に応じたサウンド名
    const resultSound = computed(() => {
      return isCorrect.value ? AUDIOS.QUIZ.CORRECT : AUDIOS.QUIZ.WRONG
    })

    // コンポーネントの参照用
    const quizGameTimer = ref(null)
    const quizGameAnswer = ref(null)
    const quizGameQuestion = ref(null)
    const baseInputText = ref(null)

    // 各種状態変数を初期化する関数
    const initialize = () => {
      state.isPressed = false
      state.isAnswered = false
      state.inputText = ''
      quizGameTimer.value.initialize()
      quizGameAnswer.value.initialize()
      quizGameQuestion.value.initialize()
    }
    // ゲームを開始する関数
    const startGame = () => {
      if (maxQuizNumber.value) {
        state.stage = STATE_PLAYING
        state.currentQuizNumber = 0
        startNextGame()
        setTimeout(() => baseInputText.value.focus(), 100)
      }
    }
    // 次の問題を開始する関数
    const startNextGame = () => {
      state.currentQuizNumber++
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
      if (!state.isAnswered) {
        quizGameTimer.value.pause()
        quizGameTimer.value.start(delay)
      }
    }
    // ヒントを表示させるメソッド
    const openHint = () => {
      quizGameAnswer.value.openHint()
      baseInputText.value.focus()
    }

    // 回答欄に変化が生じたときのイベント
    const onUpdateText = value => {
      state.inputText = value
      nextTick(() => state.inputText = value.trim())
    }
    // 何らかのキー押下時のイベント
    const pressKeyEvent = () => {
      if (!state.isPressed) {
        state.isPressed = true
        quizGameQuestion.value.stopOpen()
        startTimer(PUSH_KEY_DELAY)
        playAudio(AUDIOS.QUIZ.PRESS_BUTTON)
      }
    }
    // エンターキー押下時のイベント
    const pressEnterKeyEvent = () => {
      if (state.isPressed && state.inputText) {
        checkAnswer()
      }
    }
    // 正誤判定
    const checkAnswer = () => {
      if (state.isAnswered) return
      state.isAnswered = true
      quizGameTimer.value.pause()
      startOpenQuestion(DISPLAY_Q_INTERVAL_2)
      playAudio(resultSound.value)
      if (nextQuiz.value) {
        loadNextGame()
      } else {
        state.stage = STATE_ENDGAME
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
      matrix.deactivate(WINDOWS.THE_QUIZ_GAME)
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    watch(() => matrix.isActive(WINDOWS.THE_QUIZ_GAME), isActive => {
      if (isActive) startGame()
    })

    onMounted(() => {
      startGame()
    })

    return {
      state,
      windowState,
      windowEvents,
      buttonStyle,
      inputTextStyle,
      onUpdateText,
      maxQuizNumber,
      quizGameTimer,
      quizGameQuestion,
      quizGameAnswer,
      baseInputText,
      checkAnswer,
      currentQuiz,
      pressKeyEvent,
      pressEnterKeyEvent,
      openHint,
      startGame,
      startTimer,
      closeWindow,
    }
  },
})
</script>