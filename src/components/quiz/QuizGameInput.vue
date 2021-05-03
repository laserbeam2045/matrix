<template>
  <div v-if="isPC" class="pc-input-container">
    <AppInputText
      ref="baseInputText"
      :value="state.inputText"
      @update:value="onUpdateText"
      @keydown="pressKeyEvent"
      @keydown.enter="pressEnterKeyEvent"
    />
    <AppButton @focus="pressTabKeyEvent" />
  </div>

  <div v-else-if="isMobile" class="mobile-input-container">
    <div v-if="choices.length" class="button-container">
      <AppButton
        v-for="char in choices"
        :key="char"
        @click="onPressButton(char)"
      >
        {{ char }}
      </AppButton>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, nextTick } from 'vue'
import { useStore as useMatrix } from '@/store/matrix'
import { useStore as useAudio, AUDIOS }   from '@/store/audio'
import { HIRAGANA, KATAKANA, ALPHABETS, NUMERICS, isHiragana, isKatakana, isAlphabet, isNumeric } from '@/utilities/v_string_functions'
import { shuffle } from '@/utilities/v_array_functions'
import SuperArray from '@/utilities/SuperArray'

// 選択肢候補から除外する文字リスト
const EXCLUDE_HIRAGANA = ['ゎ', 'ゐ', 'ゑ', 'ゔ', 'ゕ', 'ゖ']
const EXCLUDE_KATAKANA = ['ヮ', 'ヰ', 'ヱ', 'ヴ', 'ヵ', 'ヶ', 'ヷ', 'ヸ', 'ヹ', 'ヺ']

// 選択肢候補の文字リスト
const CHARACTORS = {
  HIRAGANA : HIRAGANA.filter(c => !EXCLUDE_HIRAGANA.includes(c)),
  KATAKANA : KATAKANA.filter(c => !EXCLUDE_KATAKANA.includes(c)),
  ALPHABETS: ALPHABETS.concat(),
  NUMERICS : NUMERICS.concat(),
}

export default defineComponent({
  props: {
    answer: {
      type    : String,
      required: true,
    },
  },
  emits: [
    'push',
    'enter',
    'tab',
  ],
  setup(props, { emit }) {
    const { isPC, isMobile } = useMatrix()
    const { playAudio } = useAudio()

    const state = reactive({
      inputText  : '',      // 回答者が入力した文字列
      isPressed  : false,   // 現在の問題について、ボタンが押されたかどうか
      answerIndex: 0,       // 現在回答済みの文字数
    })

    const addRandomChoices = (set, choices, size) => {
      while (set.size !== size) {
        const index = Math.floor(Math.random() * choices.length)
        const chara = choices[index]
        set.add(chara)
      }
    }

    const answerChar = computed(() => props.answer[state.answerIndex])

    const choices = computed(() => {
      const data = new SuperArray()
      if (answerChar.value === undefined) return data

      data.add(answerChar.value)

      // eslint-disable-next-line indent
           if (isHiragana(answerChar.value)) addRandomChoices(data, CHARACTORS.HIRAGANA, 4)
      else if (isKatakana(answerChar.value)) addRandomChoices(data, CHARACTORS.KATAKANA, 4)
      else if (isAlphabet(answerChar.value)) addRandomChoices(data, CHARACTORS.ALPHABETS, 4)
      else if (isNumeric(answerChar.value))  addRandomChoices(data, CHARACTORS.NUMERICS, 4)

      return shuffle(data)
    })

    const baseInputText = ref(null)

    const focus = () => {
      if (isPC.value) baseInputText.value.focus()
    }

    const initialize = () => {
      state.inputText = ''
      state.isPressed = false
      state.answerIndex = 0
    }

    const onPressButton = char => {
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
    const onUpdateText = value => {
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
      choices,
      isPC,
      isMobile,
      baseInputText,
      onUpdateText,
      pressKeyEvent,
      pressEnterKeyEvent,
      pressTabKeyEvent,
      onPressButton,
      state,
      focus,
      initialize,
    }
  },
})
</script>

<style lang="scss" scoped>
.pc-input-container {
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

.mobile-input-container {
  height: 56px;
  margin: 30px 0 0;

  & > .button-container {
    display: flex;
    justify-content: space-around;

    // ::v-deep(button) {
    //   width: 45px;
    //   height: 45px;
    // }
  }
}
</style>
