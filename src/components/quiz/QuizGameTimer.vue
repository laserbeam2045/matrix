<template>
  <div id="timer-box">
    <div id="time-gauge">
      <div id="time" :style="timeGaugeStyle" />
    </div>
    <div id="quiz-number">
      {{ `${currentNumber}／${maxNumber}` }}
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
import { useStore as useSound, AUDIOS } from '@/store/audio'
import TWEEN from '@tweenjs/tween.js'
import Color from 'color-js'

const TIME_LIMIT = 10000         // 一問あたりの制限時間
const INITIAL_COLOR = '#14e6fa'  // ゲージの初期状態の色
const FINAL_COLOR = 'red'        // ゲージの最終状態の色

export default defineComponent({
  props: {
    currentNumber: {
      type    : Number,
      required: true,
    },
    maxNumber: {
      type    : Number,
      required: true,
    },
  },
  emits: [
    'timeover',
  ],
  setup(props, { emit }) {
    const { playAudio, stopAudio } = useSound()

    const state = reactive({
      isInitial   : true,   // 初期状態かどうか
      timer       : {},     // 残り時間（timeLeft: Number/ms）
      tweenedColor: {},     // 現在のゲージの色（{red, gree, blue, alpha}属性を持つ）
      finalColor  : {},     // 変化後のゲージの色（{red, gree, blue, alpha}属性を持つ）
      colorTween  : {},     // Tweenインスタンス
      numberTween : {},     // Tweenインスタンス
      timeoutId   : 0,      // setTimeoutの解除用のid
    })

    // 残り時間(百分率)
    const timePercentage = computed(() => {
      return (state.timer.timeLeft / TIME_LIMIT) * 100
    })
    // タイムゲージの背景色
    const tweenedCSSColor = computed(() => {
      return new Color({
        red  : state.tweenedColor.red,
        green: state.tweenedColor.green,
        blue : state.tweenedColor.blue,
        alpha: state.tweenedColor.alpha,
      }).toCSS()
    })
    // タイムゲージのスタイル
    const timeGaugeStyle = computed(() => {
      return {
        width     : timePercentage.value + '%',
        background: tweenedCSSColor.value,
      }
    })

    // タイマーを初期化する関数
    const initialize = () => {
      TWEEN.removeAll()
      state.isInitial = true
      state.timer.timeLeft = TIME_LIMIT
      state.tweenedColor = new Color(INITIAL_COLOR).toRGB()
      state.finalColor = new Color(FINAL_COLOR).toRGB()
    }
    // タイマーを始動させる関数
    const start = (delay = 0) => {
      state.timeoutId = setTimeout(() => {
        if (state.isInitial) {
          state.isInitial = false
          startTween()
        } else {
          restartTween()
        }
        playAudio(AUDIOS.QUIZ.COUNT_DOWN)
      }, delay)
    }
    // タイマーを一時停止させる関数
    const pause = () => {
      clearTimeout(state.timeoutId)
      if (!state.isInitial) {
        stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
        state.colorTween.pause()
        state.numberTween.pause()
      }
    }
    // ループ関数
    const animate = () => {
      if (TWEEN.update()) {
        requestAnimationFrame(animate)
      }
    }
    // アニメーションを始動させる関数
    const startTween = () => {
      state.colorTween = new TWEEN.Tween(state.tweenedColor)
        .to(state.finalColor, TIME_LIMIT)
        .start()
      state.numberTween = new TWEEN.Tween(state.timer)
        .to({timeLeft: 0}, TIME_LIMIT)
        .onComplete(() => emit('timeover'))
        .start()
      animate()
    }
    // アニメーションを再開させる関数
    const restartTween = () => {
      state.colorTween.resume()
      state.numberTween.resume()
      animate()
    }

    // 初期化する
    initialize()

    return {
      timeGaugeStyle,
      initialize,
      start,
      pause,
    }
  },
})
</script>

<style lang="scss" scoped>
$height: 12px;  // タイムゲージの高さ(border含む)
$radius: 5px;   // タイムゲージのborder-radius

#timer-box {
  display: flex;
  align-items: center;

  #time-gauge {
    width: 100%;
    height: $height;
    overflow: hidden;
    border: 1px solid white;
    border-radius: $radius;
    box-shadow: white 0 0 3px;

    #time {
      height: 100%;
      border-radius: $radius 0 0 $radius;
    }
  }

  #quiz-number {
    flex-shrink: 0;
    margin-left: 10px;
    font: 17px/#{$height} $font-family-orbitron;
    color: $greenLikeColor4;
  }
}
</style>
