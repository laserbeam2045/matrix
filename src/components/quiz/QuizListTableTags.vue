<template>
  <div class="quiz-list-table-tags">
    <div
      v-for="tagId in quiz.tagIds"
      :key="tagId"
      class="container"
    >
      <AppQuizTag :id="tagId" :showCount="false" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    quiz: {
      type    : Object,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.quiz-list-table-tags {
  display: inline-block;
  max-width: 3000px;
  padding: 15px 20px;
  white-space: nowrap;

  .container:not(:first-child) {
    margin: 15px auto 0;
  }
}
</style>
