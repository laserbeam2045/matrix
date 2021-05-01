<template>
  <table>
    <tr>
      <th><label>Question</label></th>
      <td>
        <AppTextarea
          ref="textarea"
          v-model:value="questionRef"
        />
      </td>
    </tr>
    <tr>
      <th><label>Answer1</label></th>
      <td><AppInputText v-model:value="answer1Ref" /></td>
    </tr>
    <tr>
      <th><label>Answer2</label></th>
      <td><AppInputText v-model:value="answer2Ref" /></td>
    </tr>
    <tr v-if="tagIdsRef">
      <th><label>Tags</label></th>
      <td>
        <AppQuizTag
          v-for="tagId of tagIdsRef"
          :id="tagId"
          :key="tagId"
          :showCount="false"
          @click="onClickTag"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useModelValue from '@/composables/useModelValue'

export default defineComponent({
  props: {
    question: {
      type    : String,
      required: true,
    },
    answer1: {
      type    : String,
      required: true,
    },
    answer2: {
      type    : String,
      required: true,
    },
    tagIds: {
      type   : Array,
      default: null,
    },
  },
  emits: [
    'update:question',
    'update:answer1',
    'update:answer2',
    'click',
  ],
  setup(props, {emit}) {
    const textarea = ref(null)

    const questionRef = useModelValue(props, emit, 'question')
    const answer1Ref  = useModelValue(props, emit, 'answer1')
    const answer2Ref  = useModelValue(props, emit, 'answer2')
    const tagIdsRef   = useModelValue(props, emit, 'tagIds')

    const onClickTag = value => emit('click', value)
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
