<template>
  <AppModalWindow ref="modal" legend="QUIZ CREATOR">
    <div id="quiz-creator">
      <TemplateFormQuiz
        ref="table"
        v-model:question="data.question"
        v-model:answer1="data.answer1"
        v-model:answer2="data.answer2"
      />
      <AppButton @click="onClickSubmit">
        Submit
      </AppButton>
      <AppButton @click="onClickCancel">
        Cancel
      </AppButton>
    </div>
  </AppModalWindow>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import TemplateFormQuiz from './TemplateFormQuiz'
import useWindowManager from '@/store/windowManager'

export default defineComponent({
  name: 'TheQuizCreator',

  components: {
    TemplateFormQuiz,
  },
  emits: [
    'inserted',
  ],
  setup(props, { emit }) {
    // 表示・編集の対象となるデータ
    const data = reactive({
      question: '',
      answer1 : '',
      answer2 : '',
    })

    // コンポーネントの参照用
    const modal = ref(null)
    const table = ref(null)

    // AppModalWindowの表示・非表示を行うラッパー関数
    const { open, close } = useWindowManager(modal)

    // クイズを作成する処理
    // TODO: REST API呼び出しへの置き換え
    const insertQuiz = async() => {
      await console.log('以下のデータでクイズを作成する')
      await console.table(data)
    }
    // フォームを初期化する処理
    const resetData = () => {
      data.question = ''
      data.answer1 = ''
      data.answer2 = ''
    }

    // Submitボタン押下時の処理
    const onClickSubmit = () => {
      insertQuiz().then(() => {
        resetData()
        table.value.focusQuestion()
        emit('inserted')
      })
    }
    // Cancelボタン押下時の処理
    const onClickCancel = () => {
      close()
    }

    return {
      data,
      modal,
      table,
      open,
      close,
      onClickSubmit,
      onClickCancel,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-creator {
  padding: 0 10px 20px;

  // ::v-deep(input[type="text"]) {
  //   width: 100%;
  // }
  button {
    margin: 10px;
  }
}
</style>
