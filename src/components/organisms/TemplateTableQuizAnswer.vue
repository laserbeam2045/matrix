<template>
  <div class="quiz-list-tags">
    <div
      v-for="tagId in quiz.tagIds"
      :key="tagId"
      class="container"
    >
      <QuizTag
        :id="tagId"
        :show-count="false"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import QuizTag from '@/components/atoms/QuizTag'

export default defineComponent({
  name: 'TemplateTableQuizAnswer',
  components: {
    QuizTag,
  },
  props: {
    quiz: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
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

.quiz-list-tags {
  display: inline-block;
  max-width: 3000px;
  white-space: nowrap;
  padding: 15px 20px (15 - $windowScrollbarWidth);

  .container:not(:first-child) {
    margin: 15px auto 0;
  }
}
</style>