<template>
  <ModalWindow
    ref="modalRef"
    v-bind="windowState"
  >
    <div id="quiz-creator">
      <TemplateFormQuiz
        ref="tableRef"
        v-model:question="data.question"
        v-model:answer1="data.answer1"
        v-model:answer2="data.answer2"
      />
      <ButtonBasicAtom @click="onClickSubmit">
        Submit
      </ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickCancel">
        Cancel
      </ButtonBasicAtom>
    </div>
  </ModalWindow>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import ButtonBasicAtom from '@/components/atoms/ButtonBasicAtom'
import TemplateFormQuiz from '@/components/organisms/TemplateFormQuiz'

export default defineComponent({
  name: 'TheQuizCreator',
  components: {
    ButtonBasicAtom,
    TemplateFormQuiz,
  },
  emits: [
    'inserted',
  ],
  setup(props, { emit }) {
    // ModalWindowに渡すプロパティ
    const windowState = {
      legend: {
        text: 'QUIZ CREATOR',
        type: 'inside',
      },
    }
    // 表示・編集の対象となるデータ
    const data = reactive({
      question: '',
      answer1: '',
      answer2: '',
    })

    // コンポーネントの参照用
    const modalRef = ref(null)
    const tableRef = ref(null)

    // ModalWindowの表示・非表示を行うラッパー関数
    const showModal = () => modalRef.value.showModal()
    const hideModal = () => modalRef.value.hideModal()

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
        tableRef.value.focusQuestion()
        emit('inserted')
      })
    }
    // Cancelボタン押下時の処理
    const onClickCancel = () => {
      hideModal()
    }

    return {
      windowState,
      data,
      modalRef,
      tableRef,
      showModal,
      hideModal,
      onClickSubmit,
      onClickCancel,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-creator {
  padding: 0 10px 20px;

  ::v-deep(input[type="text"]) {
    width: 100%;
  }
  button {
    margin: 10px;
  }
}
</style>