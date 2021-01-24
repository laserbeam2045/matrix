<template>
  <div>
    <p>{{ answer1ToShow }}</p><br>
    <p>{{ answer2ToShow }}</p>
  </div>
</template>

<script>
import { defineComponent, toRefs, ref, computed } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import { GAME_STATE } from '@/composables/useQuizGame'
import { hira2kata } from '@/utils/string_functions'

export default defineComponent({
  props: {
    answer1: {
      type: String,
      required: true,
    },
    answer2: {
      type: String,
      required: true,
    },
    gameData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { playAudio } = useSound()

    const { answer1, answer2, gameData } = toRefs(props)

    // 表示しているヒントの文字数
    const currentHintPosition = ref(0)

    // 完全回答と回答が異なるかどうか
    const isDiffAnswer = computed(() => hira2kata(answer1.value) !== hira2kata(answer2.value))

    // ユーザーの回答が終了した状態かどうか
    const isAnswered = computed(() => gameData.value.state === GAME_STATE.RESPONDED)

    // 表示させる答え（上部分）
    const answer1ToShow = computed(() => isAnswered.value ? ('A. ' + answer1.value) : '')

    // 表示させる答え（下部分）
    const answer2ToShow = computed(() => {
      if (isAnswered.value) {
        return isDiffAnswer.value ? answer2.value : ''
      } else {
        return answer2.value.slice(0, currentHintPosition.value)
      }
    })

    // ヒントを全て表示したかどうか
    const isAnswerOpened = computed(() => answer2.value.length <= currentHintPosition.value)

    // 位置変数を初期化する関数
    const initialize = () => currentHintPosition.value = 0
    
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
  }
})
</script>

<style lang="scss" scoped>

div {
  height: 50px;
  text-align: right;

  p {
    @include textStyleA;
    display: inline-block;
    margin: 1px 20px 0 0;
  }
}
</style>