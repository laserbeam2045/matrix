<template>
  <AppModalWindow
    ref="modalWindow"
    legend="QUIZ EDITOR"
  >
    <div id="quiz-editor">
      <TemplateFormQuiz
        v-model:question="data.question"
        v-model:answer1="data.answer1"
        v-model:answer2="data.answer2"
        v-model:tagIds="data.tagIds"
        @click="onClickQuizTag"
      />
      <AppButton
        v-for="button in buttons"
        :key="button.text"
        v-on="button.events"
      >
        {{ button.text }}
      </AppButton>
    </div>
  </AppModalWindow>

  <AppConfirmWindow
    ref="confirmWindow"
    @positive="onClickPositive"
    @negative="onClickNegative"
  />
</template>

<script>
import { defineComponent, ref, reactive, watch, inject } from 'vue'
import TemplateFormQuiz from './TemplateFormQuiz'
import useWindowManager from '@/store/windowManager'

// 確認ダイアログがどのボタンによって表示されたかを表す定数
const UPDATE_QUIZ_MODE = 0
const DELETE_QUIZ_MODE = 1
const DELETE_TAG_MODE  = 2

export default defineComponent({
  components: {
    TemplateFormQuiz,
  },
  props: {
    quizId: {
      type    : Number,
      required: true,
    },
  },
  emits: [
    'updated',
    'deleted',
  ],
  setup(props, { emit }) {
    const getUserQuiz = inject('getUserQuiz')

    // 表示・編集の対象となるデータ
    const data = reactive({
      id      : props.quizId,
      question: '',
      answer1 : '',
      answer2 : '',
      tagIds  : [],
    })

    // 親コンポーネントから受け取るクイズIDを監視し、変化時にデータを更新する
    watch(() => props.quizId, (id) => {
      const quiz = getUserQuiz(id)
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
    const modalWindow = ref(null)
    const confirmWindow = ref(null)

    const { open, close } = useWindowManager(modalWindow)

    const {
      open: openConfirm,
      close: closeConfirm,
    } = useWindowManager(confirmWindow)

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
      openConfirm()
    }

    // Updateボタン押下時の処理
    const onClickUpdate = () => {
      modeRef.value = UPDATE_QUIZ_MODE
      openConfirm()
    }
    // Deleteボタン押下時の処理
    const onClickDelete = () => {
      modeRef.value = DELETE_QUIZ_MODE
      openConfirm()
    }
    // Cancelボタン押下時の処理
    const onClickCancel = () => {
      close()
    }

    // 確認ダイアログのOKボタン押下時の処理
    const onClickPositive = async() => {
      switch (modeRef.value) {
      case UPDATE_QUIZ_MODE:
        updateQuiz().then(() => {
          closeConfirm()
          close()
          emit('updated')
        })
        break
      case DELETE_QUIZ_MODE:
        deleteQuiz().then(() => {
          closeConfirm()
          close()
          emit('deleted')
        })
        break
      case DELETE_TAG_MODE:
        deleteRelation().then(() => {
          closeConfirm()
        })
        break
      }
    }
    // 確認ダイアログのCancelボタン押下時の処理
    const onClickNegative = () => {
      closeConfirm()
    }

    const buttons = [
      { text: 'Update', events: { click: onClickUpdate }},
      { text: 'Delete', events: { click: onClickDelete }},
      { text: 'Cancel', events: { click: onClickCancel }},
    ]

    return {
      data,
      modalWindow,
      confirmWindow,
      buttons,
      open,
      close,
      onClickQuizTag,
      onClickPositive,
      onClickNegative,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-editor {
  padding: 0 10px 10px;

  // ::v-deep(input[type="text"]) {
  //   width: 100%;
  // }
  button {
    margin: 15px 0 10px 15px;
  }
}
</style>
