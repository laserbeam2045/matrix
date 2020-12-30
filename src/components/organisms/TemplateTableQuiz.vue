<template>
  <ul
    v-if="quizzes.length"
    class="quiz-list-template"
  >
    <li class="container">
      <div class="question">
        Question
      </div>
      <div class="tag">
        Tags
      </div>
    </li>
    <li
      v-for="quiz in quizzes"
      :key="quiz.id"
      class="container"
    >
      <div
        class="question"
        @dblclick="onClickQuestion(quiz.id)"
      >
        <pre>{{ quiz.question }}</pre>
      </div>
      <div class="tag">
        <TemplateTableQuizAnswer :quiz="quiz" />
      </div>
    </li>
  </ul>
</template>

<script>
import { defineComponent } from 'vue'
import TemplateTableQuizAnswer from '@/components/organisms/TemplateTableQuizAnswer'

export default defineComponent({
  name: "TemplateTableQuiz",
  components: {
    TemplateTableQuizAnswer,
  },
  props: {
    quizzes: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'click-question',
  ],
  setup(props, { emit }) {
    // 問題文をクリックした時の処理
    const onClickQuestion = quizId => {
      console.log(quizId)
      emit('click-question', quizId)
    }

    return {
      onClickQuestion,
    }
  },
})
</script>

<style lang="scss" scoped>
body.light-theme {
  th, td {
    border-color: $blueLikeColor6;
    background: transparent;
  }
  th {
    color: $blueLikeColor6;
  }
  td {
    color: $blueLikeColor4;
  }
}

body.dark-theme {
  th, td {
    border-color: $windowDarkTextColor;
    background: transparent;
  }
  th {
    color: $windowDarkTextColor;
  }
  td {
    color: $windowDarkTextColor;
  }
}

.quiz-list-template {
  margin: 0 auto 30px;
  max-width: 100%;
  font-size: 16px;
  font-family: $font-family-normal;

  .container {
    display: flex;
    width: 100%;
    border: 1px solid;
  }

  .question, .tag {
    vertical-align: middle;
    text-align: center;
    user-select: none;
  }
  .question {
    width: 62%;
    min-width: 240px;
    max-width: 300px;
    padding: 15px 20px;
    text-align: left;

    pre {
      font-family: inherit;
      white-space: pre-wrap;
    }
  }
  .tag {
    width: 37%;
    max-width: 250px;
    border-left: 1px solid;
    overflow-x: scroll;

    // スクロールバーのスタイル
    &::-webkit-scrollbar {
      position: absolute;
      width: 0;
      height: $windowScrollbarWidth;
      background: transparent;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-track {
      border: none;
      box-shadow: none;
      background: transparent;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: $blueLikeColor4;
      box-shadow: $windowScrollbarBoxShadow;
      border-radius: 3px;
    }
  }
}
</style>