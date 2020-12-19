<template>
  <table>
    <tr>
      <th><label>Question</label></th>
      <td><BaseTextArea v-model:value="questionRef" ref="textarea" /></td>
    </tr>
    <tr>
      <th><label>Answer1</label></th>
      <td><BaseInputText v-model:value="answer1Ref" /></td>
    </tr>
    <tr>
      <th><label>Answer2</label></th>
      <td><BaseInputText v-model:value="answer2Ref" /></td>
    </tr>
    <tr v-if="tagIdsRef">
      <th><label>Tags</label></th>
      <td>
        <QuizTag
          v-for="tagId of tagIdsRef"
          :key="tagId"
          :id="tagId"
          :showCount="false"
          @click="onClickTag"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useVModelRef from '@/utils/vmodel'
import BaseTextArea from '@/components/atoms/BaseTextArea'
import BaseInputText from '@/components/atoms/BaseInputText'
import QuizTag from '@/components/organisms/QuizTag'

export default defineComponent({
  name: 'TemplateFormQuiz',
  components: {
    BaseTextArea,
    BaseInputText,
    QuizTag,
  },
  emits: [
    'update:question',
    'update:answer1',
    'update:answer2',
    'click',
  ],
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
  setup(props, context) {
    const textarea = ref(null)

    const questionRef = useVModelRef(props, context, 'question')
    const answer1Ref  = useVModelRef(props, context, 'answer1')
    const answer2Ref  = useVModelRef(props, context, 'answer2')
    const tagIdsRef   = useVModelRef(props, context, 'tagIds')

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