<template>
  <table>
    <tr>
      <th><label>Question</label></th>
      <td>
        <TextareaAtom
          ref="textarea"
          v-model:value="questionRef"
        />
      </td>
    </tr>
    <tr>
      <th><label>Answer1</label></th>
      <td><InputTextAtom v-model:value="answer1Ref" /></td>
    </tr>
    <tr>
      <th><label>Answer2</label></th>
      <td><InputTextAtom v-model:value="answer2Ref" /></td>
    </tr>
    <tr v-if="tagIdsRef">
      <th><label>Tags</label></th>
      <td>
        <QuizTagAtom
          v-for="tagId of tagIdsRef"
          :id="tagId"
          :key="tagId"
          :show-count="false"
          @click="onClickTag"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useVModel from '@/composables/useVModel'

export default defineComponent({
  name: 'TemplateFormQuiz',
  props: {
    question: {
      type: String,
      required: true,
    },
    answer1: {
      type: String,
      required: true,
    },
    answer2: {
      type: String,
      required: true,
    },
    tagIds: {
      type: Array,
      required: false,
      default: null,
    },
  },
  emits: [
    'update:question',
    'update:answer1',
    'update:answer2',
    'click',
  ],
  setup(props, context) {
    const textarea = ref(null)

    const questionRef = useVModel(props, context, 'question')
    const answer1Ref  = useVModel(props, context, 'answer1')
    const answer2Ref  = useVModel(props, context, 'answer2')
    const tagIdsRef   = useVModel(props, context, 'tagIds')

    const onClickTag = value => context.emit('click', value)
    const focusQuestion = () => textarea.value.focus()

    return {
      textarea,
      questionRef,
      answer1Ref,
      answer2Ref,
      tagIdsRef,
      onClickTag,
      focusQuestion,
    }
  },
})
</script>

<style lang="scss" scoped>
table {
  th {
    padding: 0 10px;
  }
  td {
    padding: 3px 0;
    text-align: left;

    div.quiz-tag {
      margin-right: 8px;
    }
  }
}
</style>