<template>
  <ModalWindow
    ref="modalWindow"
    v-bind="windowState"
  >
    <div id="quiz-tag-editor">
      <TemplateFormQuizTag
        v-model:id="data.id"
        v-model:label="data.label"
      />
      <ButtonBasicAtom @click="onClickUpdate">Update</ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickDelete">Delete</ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickCreate">Create</ButtonBasicAtom>
      <ButtonBasicAtom @click="onClickCancel">Cancel</ButtonBasicAtom>
    </div>
  </ModalWindow>

  <ConfirmWindow
    ref="confirmWindow"
    @positive="onClickPositive"
    @negative="onClickNegative"
  />
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { useStore as useQuizTag } from '@/store/quiz_tag'
import TemplateFormQuizTag from '@/components/organisms/TemplateFormQuizTag'
import ConfirmWindow from '@/components/organisms/ConfirmWindow'
import ButtonBasicAtom from '@/components/atoms/button-basic-atom'

// 確認ダイアログがどのボタンによって表示されたかを表す定数
const UPDATE_MODE = 0
const DELETE_MODE = 1

export default defineComponent({
  name: 'TheTagEditor',
  components: {
    ConfirmWindow,
    ButtonBasicAtom,
    TemplateFormQuizTag,
  },
  emits: [
    'updated',
    'deleted',
    'click-create',
    'click-cancel',
  ],
  props: {
    tagId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const quizTagStore = useQuizTag()

    // ModalWindowに渡すプロパティ
    const windowState = {
      legend: {
        text: 'TAG EDITOR',
        type: 'inside',
      },
    }
    // 表示・編集の対象となるデータ
    const data = reactive({
      id: props.tagId,
      label: '',
    })

    // 親コンポーネントから受け取るタグIDを監視し、変化時にデータを更新する
    watch(() => props.tagId, id => {
      const tag = quizTagStore.find(id)
      if (tag) {
        Object.assign(data, { id, label: tag.label })
      }
    })

    // 確認ダイアログがどのボタンによって表示されたかを表す状態変数
    const modeRef = ref(null)

    // コンポーネントの参照用
    const modalWindow = ref(null)
    const confirmWindow = ref(null)

    // ModalWindowの表示・非表示を行うラッパー関数
    const showModal = () => modalWindow.value.showModal()
    const hideModal = () => modalWindow.value.hideModal()
    const showConfirm = () => confirmWindow.value.showModal()
    const hideConfirm = () => confirmWindow.value.hideModal()

    // タグを更新する処理
    // TODO: REST API呼び出しへの置き換え
    const updateQuizTag = async() => {
      await console.log(`以下のデータでタグ(id=${data.id})を更新する`)
      await console.table(data)
    }
    // タグを削除する処理
    // TODO: REST API呼び出しへの置き換え
    const deleteQuizTag = async() => {
      await console.log(`タグ(id=${data.id})を削除する`)
    }

    // Updateボタン押下時の処理
    const onClickUpdate = () => {
      modeRef.value = UPDATE_MODE
      showConfirm()
    }
    // Deleteボタン押下時の処理
    const onClickDelete = () => {
      modeRef.value = DELETE_MODE
      showConfirm()
    }
    // Createボタン押下時の処理
    const onClickCreate = () => {
      emit('click-create')
    }
    // Cancelボタン押下時の処理
    const onClickCancel = () => {
      emit('click-cancel')
    }

    // 確認ダイアログのOKボタン押下時の処理
    const onClickPositive = async() => {
      switch (modeRef.value) {
      case UPDATE_MODE:
        updateQuizTag().then(() => {
          hideConfirm()
          emit('updated')
        })
        break
      case DELETE_MODE:
        deleteQuizTag().then(() => {
          hideConfirm()
          emit('deleted')
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
      modalWindow,
      confirmWindow,
      showModal,
      hideModal,
      onClickUpdate,
      onClickDelete,
      onClickCreate,
      onClickCancel,
      onClickPositive,
      onClickNegative,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-tag-editor {
  padding: 0 20px 20px;

  ::v-deep(table) {
    width: 100%;

    input[type="text"] {
      width: 100%;
    }
  }
  button {
    margin: 10px 5px 0 0;
  }
  button:last-child {
    margin-right: 0;
  }
}
</style>