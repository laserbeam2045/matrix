<template>
  <ModalWindow
    ref="modalWindow"
    v-bind="windowState"
  >
    <div id="quiz-tag-creator">
      <TemplateFormQuizTag
        v-model:parentLabel="data.parentLabel"
        v-model:label="data.label"
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
import { defineComponent, reactive, ref, watch, inject } from 'vue'
import TemplateFormQuizTag from '@/components/organisms/TemplateFormQuizTag'

export default defineComponent ({
  name: 'TheTagCreator',
  components: {
    TemplateFormQuizTag,
  },
  props: {
    tagId: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'inserted',
    'click-cancel',
  ],
  setup(props, { emit }) {
    // ModalWindowに渡すプロパティ
    const windowState = {
      legend: {
        text: 'TAG CREATOR',
        type: 'inside',
      },
    }
    // 表示・編集の対象となるデータ
    const data = reactive({
      parentLabel: '',
      label: '',
    })

    const getQuizTag = inject('getQuizTag')

    // 親コンポーネントから受け取るタグIDを監視し、変化時にデータを更新する
    watch(() => props.tagId, (id) => {
      const tag = getQuizTag(id)
      if (tag) Object.assign(data, { parentLabel: tag.label })
    })

    // コンポーネントの参照用
    const modalWindow = ref(null)

    // ModalWindowの表示・非表示を行うラッパー関数
    const showModal = () => modalWindow.value.showModal()
    const hideModal = () => modalWindow.value.hideModal()

    // タグを挿入する処理
    // TODO: REST API呼び出しへの置き換え
    const insertQuizTag = async() => {
      await console.log(`以下のデータでタグを挿入する`)
      await console.table(data)
    }

    // Submitボタン押下時の処理
    const onClickSubmit = () => {
      insertQuizTag().then(() => {
        emit('inserted')
      })
    }
    // Cancelボタン押下時の処理
    const onClickCancel = () => {
      emit('click-cancel')
    }

    return {
      windowState,
      data,
      modalWindow,
      showModal,
      hideModal,
      onClickSubmit,
      onClickCancel,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-tag-creator {
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