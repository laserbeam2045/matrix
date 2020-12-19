<template>
  <ModalWindow
    ref="modalWindowRef"
    v-bind="windowState"
  >
    <div id="quiz-editor">
      <TemplateFormQuiz
        v-model:question="data.question"
        v-model:answer1="data.answer1"
        v-model:answer2="data.answer2"
        v-model:tagIds="data.tagIds"
        @click="onClickQuizTag"
      />
      <ButtonBasicAtom @click="onClickUpdate">Update</ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickDelete">Delete</ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickCancel">Cancel</ButtonBasicAtom>
    </div>
  </ModalWindow>

  <ConfirmWindow
    ref="confirmWindowRef"
    @positive="onClickPositive"
    @negative="onClickNegative"
  />
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { useStore as useQuiz } from '@/store/quiz'
import ConfirmWindow from '@/components/organisms/ConfirmWindow'
import ButtonBasicAtom from '@/components/atoms/button-basic-atom'
import TemplateFormQuiz from '@/components/organisms/TemplateFormQuiz'

// 確認ダイアログがどのボタンによって表示されたかを表す定数
const UPDATE_QUIZ_MODE = 0
const DELETE_QUIZ_MODE = 1
const DELETE_TAG_MODE  = 2

export default defineComponent({
  name: 'TheQuizEditor',
  components: {
    ConfirmWindow,
    ButtonBasicAtom,
    TemplateFormQuiz,
  },
  emits: [
    'updated',
    'deleted',
  ],
  props: {
    quizId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const quizStore = useQuiz()

    // ModalWindowに渡すプロパティ
    const windowState = {
      legend: {
        text: 'QUIZ EDITOR',
        type: 'inside',
      },
    }
    // 表示・編集の対象となるデータ
    const data = reactive({
      id: props.quizId,
      question: '',
      answer1: '',
      answer2: '',
      tagIds: [],
    })

    // 親コンポーネントから受け取るクイズIDを監視し、変化時にデータを更新する
    watch(() => props.quizId, (id) => {
      const quiz = quizStore.find(id)
      if (quiz) {
        const { question, answer1, answer2, tagIds } = quiz
        Object.assign(data, { id, question, answer1, answer2, tagIds })
      }
    })

    // 確認ダイアログがどのボタンによって表示されたかを表す状態変数
    const modeRef = ref(null)
    // どのタグが押されたかを表す値
    const tagIdRef = ref(null)

    // コンポーネントの参照用
    const modalWindowRef = ref(null)
    const confirmWindowRef = ref(null)

    // ModalWindowの表示・非表示を行うラッパー関数
    const showModal = () => modalWindowRef.value.showModal()
    const hideModal = () => modalWindowRef.value.hideModal()
    const showConfirm = () => confirmWindowRef.value.showModal()
    const hideConfirm = () => confirmWindowRef.value.hideModal()

    // 関係を削除する処理
    // TODO: REST API呼び出しへの置き換え
    const deleteRelation = async() => {
      await console.log(`クイズ(id=${data.id})と、タグ(id=${tagIdRef.value})の関係を断つ`)
    }
    // クイズを更新する処理
    // TODO: REST API呼び出しへの置き換え
    const updateQuiz = async() => {
      await console.log(`以下のデータでクイズ(id=${data.id})を更新する`)
      await console.table(data)
    }
    // クイズを削除する処理
    // TODO: REST API呼び出しへの置き換え
    const deleteQuiz = async() => {
      await console.log(`クイズ(id=${data.id})を削除する`)
    }

    // タグ押下時の処理
    const onClickQuizTag = tagId => {
      modeRef.value = DELETE_TAG_MODE
      tagIdRef.value = tagId
      showConfirm()
    }

    // Updateボタン押下時の処理
    const onClickUpdate = () => {
      modeRef.value = UPDATE_QUIZ_MODE
      showConfirm()
    }
    // Deleteボタン押下時の処理
    const onClickDelete = () => {
      modeRef.value = DELETE_QUIZ_MODE
      showConfirm()
    }
    // Cancelボタン押下時の処理
    const onClickCancel = () => {
      hideModal()
    }

    // 確認ダイアログのOKボタン押下時の処理
    const onClickPositive = async() => {
      switch (modeRef.value) {
      case UPDATE_QUIZ_MODE:
        updateQuiz().then(() => {
          hideConfirm()
          hideModal()
          emit('updated')
        })
        break
      case DELETE_QUIZ_MODE:
        deleteQuiz().then(() => {
          hideConfirm()
          hideModal()
          emit('deleted')
        })
        break
      case DELETE_TAG_MODE:
        deleteRelation().then(() => {
          hideConfirm()
        })
        break
      }
    }
    // 確認ダイアログのCancelボタン押下時の処理
    const onClickNegative = () => {
      hideConfirm()
    }

    return {
      windowState,
      data,
      modalWindowRef,
      confirmWindowRef,
      showModal,
      hideModal,
      onClickQuizTag,
      onClickUpdate,
      onClickDelete,
      onClickCancel,
      onClickPositive,
      onClickNegative,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-editor {
  padding: 0 10px 10px;

  ::v-deep(input[type="text"]) {
    width: 100%;
  }
  button {
    margin: 15px 0 10px 15px;
  }
}
</style>