<template>
  <transition-group tag="ul" class="quiz-list">
    <li v-if="quizzes.length === 0" class="zero">
      <p>No data</p>
    </li>
    <li v-for="quiz in quizzes" :key="quiz.id" class="item">
      <div class="question" @click="onClickQuestion(quiz.id)">
        <pre>{{ quiz.question }}</pre>
      </div>
    </li>
  </transition-group>
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
.quiz-list {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 5px 5px 5px 0;
  font-family: $font-family-normal;
  font-size: 16px;

  .zero {
    position: absolute;
    left: 0;
    width: 100%;
    padding-top: 15px;
    text-align: center;
    transition: all 0.8s ease;
    @include unSelectable;
  }

  .item {
    display: inline-block;
    width: 100%;
    border: 1px solid;
    transition: all 0.8s ease;

    &:nth-child(n + 2) {
      margin-top: -1px;
    }

    .question {
      width: 100%;
      width: 300px;
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
  }
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.v-leave-active {
  position: absolute;
}
</style>
