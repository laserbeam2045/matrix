<template>
  <div class="quiz-list-table-tags-molecule">
    <div
      v-for="tagId in quiz.tagIds"
      :key="tagId"
      class="container"
    >
      <QuizTagAtom
        :id="tagId"
        :show-count="false"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuizListTableTagsMolecule',
  props: {
    quiz: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.quiz-list-table-tags-molecule {
  display: inline-block;
  max-width: 3000px;
  white-space: nowrap;
  padding: 15px 20px (15 - $windowScrollbarWidth);

  .container:not(:first-child) {
    margin: 15px auto 0;
  }
}
</style>