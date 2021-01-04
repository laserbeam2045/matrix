<template>
  <ul
    v-if="quizzes.length"
    class="quiz-list-table-molecule"
  >
    <li class="container">
      <div class="question">
        Question
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
    </li>
  </ul>
</template>

<script>
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: "QuizListTableMolecule",
  emits: [
    'click-question',
  ],
  setup(props, { emit }) {
    const quizzes = inject('filteredQuizzes')

    // 問題文をクリックした時の処理
    const onClickQuestion = id => emit('click-question', id)

    return { quizzes, onClickQuestion }
  }
})
</script>

<style lang="scss" scoped>
.quiz-list-table-molecule {
  max-width: 100%;
  font-size: 16px;
  font-family: $font-family-normal;

  .container {
    display: flex;
    width: 100%;
    height: 100%;
    border: 1px solid;

    &:nth-child(n + 2) {
      border-top: none;
    }
  }

  .question {
    vertical-align: middle;
    text-align: center;
    user-select: none;
  }
  .question {
    width: 100%;
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