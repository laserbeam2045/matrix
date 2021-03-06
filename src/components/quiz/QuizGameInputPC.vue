<template>
  <div class="quiz-game-input-pc">
    <AppInputText
      ref="baseInputText"
      :value="state.inputText"
      @update:value="onUpdateText"
      @keydown="pressKeyEvent"
      @keydown.enter="pressEnterKeyEvent"
    />
    <AppButton @focus="pressTabKeyEvent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick } from 'vue'
import { useAudio, AUDIOS } from 'store/useAudio'

export default defineComponent({
  props: {
    answer: {
      type    : String,
      required: true,
    },
    gameData: {
      type    : Object,
      required: true,
    },
  },
  emits: [
    'push',
    'enter',
    'tab',
  ],
  setup(props, { emit }) {
    const { playAudio } = useAudio()

    const state = reactive({
      inputText  : '',      // 回答者が入力した文字列
      isPressed  : false,   // 現在の問題について、ボタンが押されたかどうか
      answerIndex: 0,       // 現在回答済みの文字数
    })

    const baseInputText = ref(null)
    const focus = () => baseInputText.value.focus()

    const initialize = () => {
      state.inputText = ''
      state.isPressed = false
      state.answerIndex = 0
    }

    const onPressButton = (char: string) => {
      if (!state.isPressed) {
        state.isPressed = true
        emit('push')
      } else {
        playAudio(AUDIOS.ETC.POP_1)
      }
      state.inputText += char
      state.answerIndex++

      if (
        state.inputText.length === props.answer.length ||
        state.inputText !== props.answer.slice(0, state.inputText.length)
      ) {
        emit('enter')
      }
    }

    // 回答欄に変化が生じたときのイベント
    const onUpdateText = (value: string) => {
      state.inputText = value
      nextTick(() => state.inputText = value.trim())
    }

    // 何らかのキー押下時のイベント
    const pressKeyEvent = () => {
      if (!state.isPressed) {
        state.isPressed = true
        emit('push')
      }
    }

    // Enterキー押下時のイベント
    const pressEnterKeyEvent = () => {
      if (state.isPressed && state.inputText) {
        emit('enter')
      }
    }

    // Tabキー押下時のイベント
    const pressTabKeyEvent = () => {
      emit('tab')
    }

    return {
      baseInputText,
      focus,
      initialize,
      onPressButton,
      onUpdateText,
      pressKeyEvent,
      pressEnterKeyEvent,
      pressTabKeyEvent,
    }
  },
})
</script>

<style lang="scss" scoped>
.quiz-game-input-pc {
  margin: 30px 0 0;

  input: {
    width: 100%;
  }
  button {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
}
</style>
