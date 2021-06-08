<template>
  <div class="quiz-game-question">
    <span>Q.&nbsp;</span>
    <div>{{ openedQuestion }}</div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, computed } from 'vue'

// 文字を表示する間隔(ms)
const OPEN_INTERVAL = 100

export default defineComponent({
  props: {
    question: {
      type    : String,
      required: true,
    },
  },
  emits: [
    'all-displayed',
  ],
  setup(props, { emit }) {
    // 親コンポーネントから受け取る問題文
    const question = toRef(props, 'question')

    const state = reactive({
      intervalId     : 0,   // 問題表示のインターバルID
      currentPosition: 0,   // 問題文のうち、表示されている文字数
    })

    // 現在の問題文の長さ
    const QuestionLength = computed(() => {
      return question.value.length
    })
    // 問題文から現在の表示位置までを切り取った部分文字列
    const openedQuestion = computed(() => {
      return question.value.slice(0, state.currentPosition)
    })
    // 未表示の文字があるかどうか
    const isThereHiddenCharacter = computed(() => {
      return state.currentPosition < QuestionLength.value
    })

    // 位置変数を初期化する関数
    const initialize = () => {
      state.currentPosition = 0
    }
    // 問題文の表示を開始する関数
    const startOpen = (interval = OPEN_INTERVAL) => {
      if (isThereHiddenCharacter.value)
        state.intervalId = setInterval(showNextChar, interval)
    }
    // 問題文の表示を停止させる関数
    const stopOpen = () => {
      clearInterval(state.intervalId)
    }
    // 問題文の次の文字を表示させる関数
    const showNextChar = () => {
      if (isThereHiddenCharacter.value) {
        state.currentPosition++
      } else {
        stopOpen()
        emit('all-displayed')
      }
    }

    return {
      openedQuestion,
      initialize,
      startOpen,
      stopOpen,
    }
  },
})
</script>

<style lang="scss" scoped>
.quiz-game-question {
  @include textStyleB;

  display: flex;
  height: 176px;
  margin: 15px 0 0;
  text-align: left;
  white-space: pre-wrap;
}
</style>
