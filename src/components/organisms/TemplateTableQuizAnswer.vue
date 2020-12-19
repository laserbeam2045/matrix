<template>
  <div class="quiz-list-answer">
    <div class="answer1">{{ quiz.answer1 }}</div>
    <div v-if="isDiffAnswerRef">{{ quiz.answer2 }}</div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TemplateTableQuizAnswer',
  props: {
    quiz: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isDiffAnswerRef = computed(() => {
      return (props.quiz.answer1 !== props.quiz.answer2)
    })

    return { isDiffAnswerRef }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/colors';
@import '@/assets/style/window';

body.light-theme {
  .answer1 {
    color: $answer-light-color;
  }
}
body.dark-theme {
  .answer1 {
    color: $answer-dark-color;
  }
}

.quiz-list-answer {
  display: inline-block;
  max-width: 3000px;
  white-space: nowrap;
  padding: 15px 20px (15 - $windowScrollbarWidth);
}
</style>