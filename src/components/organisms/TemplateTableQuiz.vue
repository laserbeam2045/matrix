<template>
  <table v-if="quizzes.length">
    <tr>
      <th>Question</th>
      <th>Answer</th>
    </tr>
    <tr v-for="quiz in quizzes" :key="quiz.id">
      <td @dblclick="onClickQuestion(quiz.id)">
        <pre>{{ quiz.question }}</pre>
      </td>
      <td>
        <TemplateTableQuizAnswer :quiz="quiz" />
      </td>
    </tr>
  </table>
</template>

<script>
import { defineComponent } from 'vue'
import TemplateTableQuizAnswer from '@/components/organisms/TemplateTableQuizAnswer'

export default defineComponent({
  name: "TemplateTableQuiz",
  components: {
    TemplateTableQuizAnswer,
  },
  emits: [
    'click-question',
  ],
  props: {
    quizzes: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    // 問題文をクリックした時の処理
    const onClickQuestion = quizId => {
      emit('click-question', quizId)
    }

    return {
      onClickQuestion,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/colors';
@import '@/assets/style/window';

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

table {
  margin: 0 auto 30px;

  th, td {
    text-align: center;
    box-sizing: border-box;
    border: 1px solid;
  }
  th {
    padding: 15px 20px;
    font-weight: normal;
  }
  td {
    font-size: 16px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  td:nth-child(1) {
    width: 361px;
    height: 100px;
    padding: 15px 20px;
    text-align: left;
    user-select: none;

    pre {
      margin: 0;
      font-family: inherit;
      white-space: pre-wrap;
    }
  }
  td:nth-child(2) {
    max-width: 180px;
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