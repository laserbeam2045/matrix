<template>
  <div>
    <p>{{ answer1ToShow }}</p><br>
    <p>{{ answer2ToShow }}</p>
  </div>
</template>

<script>
import { defineComponent, toRefs, ref, computed } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { hira2kata } from '@/utils/string_functions'

export default defineComponent({
  name: 'QuizGameAnswer',
  props: {
    answer1: {
      type: String,
      required: true,
    },
    answer2: {
      type: String,
      required: true,
    },
    isAnswered: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const { playAudio } = useSound()

    const refProps = toRefs(props)

    // 表示しているヒントの文字数
    const currentHintPosition = ref(0)

    // answer1（ひらがなをカタカナに変換したもの）
    const answer1AsKatakana = computed(() => {
      return hira2kata(refProps.answer1.value)
    })
    // answer2（ひらがなをカタカナに変換したもの）
    const answer2AsKatakana = computed(() => {
      return hira2kata(refProps.answer2.value)
    })
    // 完全回答と回答が異なるかどうか
    const isDiffAnswer = computed(() => {
      return answer1AsKatakana.value !== answer2AsKatakana.value
    })
    // 表示させる答え（上部分）
    const answer1ToShow = computed(() => {
      return refProps.isAnswered.value ?
             ('A. ' + refProps.answer1.value) : ''
    })
    // 表示させる答え（下部分）
    const answer2ToShow = computed(() => {
      if (refProps.isAnswered.value) {
        return isDiffAnswer.value ? refProps.answer2.value : ''
      } else {
        return refProps.answer2.value.slice(0, currentHintPosition.value)
      }
    })
    // ヒントを全て表示したかどうか
    const isAnswerOpened = computed(() => {
      return refProps.answer2.value.length <= currentHintPosition.value
    })

    // 位置変数を初期化する関数
    const initialize = () => {
      currentHintPosition.value = 0
    }
    // ヒントを一文字表示させる関数
    const openHint = () => {
      if (isAnswerOpened.value) return
      currentHintPosition.value++
      playAudio(AUDIOS.ETC.TYPE)
    }

    return {
      answer1ToShow,
      answer2ToShow,
      initialize,
      openHint,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/text';

div {
  height: 50px;
  text-align: right;

  p {
    @include textStyleA;
    display: inline-block;
    margin: 1px 20px 0 0;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>