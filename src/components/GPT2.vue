<template>
  <VirtualWindow
    v-bind="windowState"
    v-on="windowEvents"
  >
    <EditableWindow
      ref="editableWindow"
      :value="text"
      @input="onInput"
      @keydown.enter.exact="onKeyEnter"
      @keydown.tab.exact.prevent="onKeyTab"
    />
  </VirtualWindow>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { provideStore as provideGPT_2, useStore as useGPT_2 } from '@/store/gpt_2'
import { escapeRegExp, escapeHTML } from '@/utils/string_functions'
import { MOUSE_TOUCH_EVENT } from '@/store/constants'
import EditableWindow from '@/components/EditableWindow'
import _ from 'lodash'

export default defineComponent({
  name: 'GPT2',
  components: {
    EditableWindow,
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    provideGPT_2()
    const store = useGPT_2()

    const editableWindow = ref(null)

    const windowState = {
      width: '300px',
      height: '100px',
      resizableV: true,
      resizableH: true,
      draggable: true,
      legend: {
        text: 'GPT-2',
        type: 'inside',
      },
    }
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const state = reactive({
      command: '',
    })

    // リクエストまでの待機時間(ms)
    const delayOfRequest = 200
    // 呼び出しから待機時間(delayOfRequest/ms)以内に同じ呼び出しがあればキャンセルされる
    const debouncedGetNextWords = _.debounce(store.getNextWords, delayOfRequest)

    // ユーザーが入力した文字列
    const before = computed(() => {
      if (store.lastChar.value === '\n' && after.value !== '') {
        return escapeHTML(store.state.text.slice(0, -1))
      } else {
        return escapeHTML(store.state.text)
      }
    })

    // 予測された単語を含む文字列
    const after = computed(() => {
      const text = escapeHTML(store.predictedText.value)
      if (text) return `<span class="private">${text}</span>`
      else      return ''
    })

    // エディタ上に出力されるHTML
    const text = computed(() => {
      return before.value + after.value
    })

    // inputイベントハンドラ
    const onInput = value => {
      if (state.command) {
        state.command = ''
        return
      }
      // 末尾の予測文字列を取り除いて、値を更新する
      const predictedText = escapeRegExp(store.predictedText.value)
      const newValue = value.replace(new RegExp(predictedText + '$'), '')
      store.setText(newValue)
      store.setTabFlag(false)

      if (
        event.type === 'input' && event.data === ' ' ||
        event.type === 'keydown' && event.key === 'Enter'
      ) {
        if (store.isNextWordPerfectMatch.value) {
          store.matchProcessing()
        } else {
          store.filteringWords(event.data)
        }
      } else {
        if (
          !store.isNextWordPartialMatch.value &&
          !store.isNextWordPerfectMatch.value
        ) {
          store.filteringWords(event.data)
        }
      }
      debouncedGetNextWords()
    }

    // 予測した単語を文章とつなげる処理
    const onKeyTab = () => {
      if (!store.nextWord.value) return
      const matchFlag = store.isNextWordPerfectMatch.value
      const nextWord = store.preProcessedNextWord.value
      const newText = store.state.text + nextWord

      editableWindow.value.setLocalRangeBy(nextWord.length)
      store.setText(newText)
      store.setTabFlag(true)
      store.matchProcessing()
      if (matchFlag) return onKeyTab()
      debouncedGetNextWords()
    }

    // Enterキー押下時の処理
    const onKeyEnter = () => {

    }

    return {
      windowState,
      windowEvents,
      editableWindow,
      text,
      onInput,
      onKeyTab,
      onKeyEnter,
    }
  },
})
</script>

<style lang="scss">
span.private {
  @include textStyleA;
  // margin-left: 0.1px;
}
</style>