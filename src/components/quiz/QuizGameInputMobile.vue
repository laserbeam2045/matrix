<template>
  <div class="quiz-game-input-mobile">
    <div
      v-if="state.isPressed"
      class="button-container"
    >
      <AppButton
        v-for="char in choices"
        :key="char"
        @touchend="onSelectCharactor(char)"
      >
        {{ char }}
      </AppButton>
    </div>
    <div v-else>
      <AppButton @touchstart="onPressButton">
        PUSH
      </AppButton>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
import { useStore as useAudio, AUDIOS }   from '@/store/audio'
import { HIRAGANA, KATAKANA, ALPHABETS, NUMERICS, isHiragana, isKatakana, isAlphabet, isNumeric } from '@/utilities/v_string_functions'
import { shuffle } from '@/utilities/v_array_functions'
import Aset from '@/utilities/Aset'

// 選択肢候補から除外する文字リスト
const EXCLUDE_HIRAGANA = ['ゎ', 'ゐ', 'ゑ', 'ゔ', 'ゕ', 'ゖ']
const EXCLUDE_KATAKANA = ['ヮ', 'ヰ', 'ヱ', 'ヴ', 'ヵ', 'ヶ', 'ヷ', 'ヸ', 'ヹ', 'ヺ']

// 選択肢候補の文字リスト
const CHARACTORS = {
  HIRAGANA : HIRAGANA.filter(c => !EXCLUDE_HIRAGANA.includes(c)),
  KATAKANA : KATAKANA.filter(c => !EXCLUDE_KATAKANA.includes(c)),
  ALPHABETS: ALPHABETS,
  NUMERICS : NUMERICS,
}

export default defineComponent({
  props: {
    answer: {
      type    : String,
      required: true,
    },
    quizState: {
      type    : Number,
      required: true,
    },
  },
  emits: [
    'start-answer',
    'push',
    'enter',
  ],
  setup(props, { emit }) {
    const { playAudio } = useAudio()

    const state = reactive({
      inputText  : '',    // 回答者が入力した文字列
      answerIndex: 0,     // 現在回答済みの文字数
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
      const data = new Aset()
      if (answerChar.value === undefined) return data

      data.add(answerChar.value)

      // eslint-disable-next-line indent
           if (isHiragana(answerChar.value)) addRandomChoices(data, CHARACTORS.HIRAGANA, 4)
      else if (isKatakana(answerChar.value)) addRandomChoices(data, CHARACTORS.KATAKANA, 4)
      else if (isAlphabet(answerChar.value)) addRandomChoices(data, CHARACTORS.ALPHABETS, 4)
      else if (isNumeric(answerChar.value))  addRandomChoices(data, CHARACTORS.NUMERICS, 4)

      return shuffle(data)
    })

    const initialize = () => {
      state.inputText = ''
      state.isPressed = false
      state.answerIndex = 0
    }

    const onPressButton = () => emit('start-answer')

    const onSelectCharactor = char => {
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

    return {
      choices,
      initialize,
      onPressButton,
      onSelectCharactor,
    }
  },
})
</script>

<style lang="scss" scoped>
.quiz-game-input-mobile {
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
