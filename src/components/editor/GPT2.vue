<template>
  <AppVirtualWindow
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
  </AppVirtualWindow>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { escapeRegExp, escapeHTML } from '@/utilities/v_string_functions'
import { MOUSE_TOUCH_EVENT } from '@/utilities/v_event_functions'
import EditableWindow from '@/components/editor/EditableWindow'
// eslint-disable-next-line camelcase
import useGPT_2 from '@/composables/useGPT-2'
import _ from 'lodash'

export default defineComponent({
  components: {
    EditableWindow,
  },
  emits: [
    'touch',
  ],
  setup(props, { emit }) {
    const {
      state,
      lastChar,
      predictedText,
      preProcessedNextWord,
      isNextWordPartialMatch,
      isNextWordPerfectMatch,
      setText,
      setTabFlag,
      getNextWords,
      matchProcessing,
      filteringWords,
    } = useGPT_2()

    const editableWindow = ref(null)

    const windowState = {
      width : '300px',
      height: '100px',
      legend: 'GPT-2',
    }
    const windowEvents = {
      [`${MOUSE_TOUCH_EVENT.START}Passive`]() { emit('touch') },
    }

    const cmdState = reactive({
      command: '',
    })

    // リクエストまでの待機時間(ms)
    const delayOfRequest = 200
    // 呼び出しから待機時間(delayOfRequest/ms)以内に同じ呼び出しがあればキャンセルされる
    const debouncedGetNextWords = _.debounce(getNextWords, delayOfRequest)

    // ユーザーが入力した文字列
    const before = computed(() => {
      if (lastChar.value === '\n' && after.value !== '') {
        return escapeHTML(state.text.slice(0, -1))
      } else {
        return escapeHTML(state.text)
      }
    })

    // 予測された単語を含む文字列
    const after = computed(() => {
      const text = escapeHTML(predictedText.value)
      if (text) return `<span class="private">${text}</span>`
      else      return ''
    })

    // エディタ上に出力されるHTML
    const text = computed(() => {
      return before.value + after.value
    })

    // inputイベントハンドラ
    const onInput = value => {
      if (cmdState.command) {
        cmdState.command = ''
        return
      }
      // 末尾の予測文字列を取り除いて、値を更新する
      const predictedText = escapeRegExp(predictedText.value)
      const newValue = value.replace(new RegExp(predictedText + '$'), '')
      setText(newValue)
      setTabFlag(false)

      if (
        event.type === 'input' && event.data === ' ' ||
        event.type === 'keydown' && event.key === 'Enter'
      ) {
        if (isNextWordPerfectMatch.value) {
          matchProcessing()
        } else {
          filteringWords(event.data)
        }
      } else {
        if (
          !isNextWordPartialMatch.value &&
          !isNextWordPerfectMatch.value
        ) {
          filteringWords(event.data)
        }
      }
      debouncedGetNextWords()
    }

    // 予測した単語を文章とつなげる処理
    const onKeyTab = () => {
      if (!nextWord.value) return
      const matchFlag = isNextWordPerfectMatch.value
      const nextWord = preProcessedNextWord.value
      const newText = state.text + nextWord

      editableWindow.value.setLocalRangeBy(nextWord.length)
      setText(newText)
      setTabFlag(true)
      matchProcessing()
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

<style lang="scss" scoped>
span.private {
  @include textStyleA;
  // margin-left: 0.1px;
}
</style>
