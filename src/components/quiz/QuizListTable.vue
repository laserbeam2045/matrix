<template>
  <ul
    v-if="quizzes.length"
    class="quiz-list-table"
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
  emits: ['click-question'],
  setup(props, { emit }) {
    const quizzes = inject('filteredQuizzes')

    // 問題文をクリックした時の処理
    const onClickQuestion = id => emit('click-question', id)

    return { quizzes, onClickQuestion }
  },
})
</script>

<style lang="scss" scoped>
.quiz-list-table {
  max-width: 100%;
  font-family: $font-family-normal;
  font-size: 16px;

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
    width: 100%;
    min-width: 240px;
    max-width: 300px;
    padding: 15px 20px;
    text-align: center;
    text-align: left;
    vertical-align: middle;
    user-select: none;

    pre {
      font-family: inherit;
      white-space: pre-wrap;
    }
  }

  .tag {
    width: 37%;
    max-width: 250px;
    overflow-x: scroll;
    border-left: 1px solid;
  }
}
</style>
