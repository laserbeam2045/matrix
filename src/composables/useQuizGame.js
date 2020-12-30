import { reactive, unref, computed } from 'vue'
import { hira2kata }   from '@/utils/string_functions'

export const GAME_STATE = {
  OPENING     : 0,  // ゲームを開始する段階
  BEFORE_GAME : 1,  // ユーザーが待機中の状態
  THINKING    : 2,  // ユーザーが考慮中の状態
  RESPONDING  : 3,  // ユーザーが回答中の状態
  RESPONDED   : 4,  // ユーザーの回答が終了した状態
  ENDING      : 5,  // ゲームが終了した状態
}

export default function useQuizGame(quizzes) {
  const gameData = reactive({
    state: GAME_STATE.OPENING,  // 状態フラグ
    currentQuizNumber: 0,       // 現在の問題が何問目であるか
    inputText: '',              // ユーザーの入力
  })

  // 総問題数
  const maxQuizNumber = computed(() => unref(quizzes).length)

  // 現在の問題
  const currentQuiz = computed(() => unref(quizzes)[gameData.currentQuizNumber - 1])

  // 次の問題
  const nextQuiz = computed(() => unref(quizzes)[gameData.currentQuizNumber])

  // 入力された文字列が、正解と等しいかどうかを返す関数
  const isCorrect = (answer) => {
    const convertedInput = hira2kata(gameData.inputText)
    const convertedAnswer = hira2kata(unref(answer))
    const exp = new RegExp(`^${convertedAnswer}.*`)

    return convertedInput.match(exp)
  }

  return {
    gameData,
    maxQuizNumber,
    currentQuiz,
    nextQuiz,
    isCorrect,
  }
}