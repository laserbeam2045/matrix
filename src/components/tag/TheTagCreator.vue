<template>
  <AppModalWindow ref="modal" legend="TAG CREATOR">
    <div id="quiz-tag-creator">
      <TemplateFormQuizTag
        v-model:parentLabel="data.parentLabel"
        v-model:label="data.label"
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

<script lang="ts">
import { defineComponent, reactive, ref, watch, inject } from 'vue'
import TemplateFormQuizTag from 'components/quiz/TemplateFormQuizTag'
import { useWindowManager } from 'store/useWindowManager'

export default defineComponent ({
  components: {
    TemplateFormQuizTag,
  },
  props: {
    tagId: {
      type    : Number,
      required: true,
    },
  },
  emits: [
    'inserted',
    'click-cancel',
  ],
  setup(props, { emit }) {
    // 表示・編集の対象となるデータ
    const data = reactive({
      parentLabel: '',
      label      : '',
    })

    const getQuizTag = inject('getQuizTag')

    // 親コンポーネントから受け取るタグIDを監視し、変化時にデータを更新する
    watch(() => props.tagId, (id) => {
      const tag = getQuizTag(id)
      if (tag) Object.assign(data, { parentLabel: tag.label })
    })

    // コンポーネントの参照用
    const modal = ref(null)

    // AppModalWindowの表示・非表示を行うラッパー関数
    const { open, close } = useWindowManager(modal)

    // タグを挿入する処理
    // TODO: REST API呼び出しへの置き換え
    const insertQuizTag = async() => {
      await console.log('以下のデータでタグを挿入する')
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
      data,
      modal,
      open,
      close,
      onClickSubmit,
      onClickCancel,
    }
  },
})
</script>

<style lang="scss" scoped>
#quiz-tag-creator {
  padding: 0 20px 20px;

  // ::v-deep(table) {
  //   width: 100%;

  //   input[type="text"] {
  //     width: 100%;
  //   }
  // }
  button {
    margin: 10px 5px 0 0;
  }
  button:last-child {
    margin-right: 0;
  }
}
</style>
