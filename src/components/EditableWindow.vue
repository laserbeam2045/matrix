<template>
  <EditableWindowPre
    ref="root"
    :listeners="listeners"
    :htmlString="state.innerHTML"
  />
</template>

<script>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { LF, convert2LF, trimLastLF, doubleLastLF } from '@/utilities/v_string_functions'
import { getClipboardData } from '@/utilities/v_event_functions'
import { getRootElement } from '@/utilities/v_dom_functions'
import useSelection from '@/composables/useSelection'
import EditableWindowPre from '@/components/EditableWindowPre'

export default defineComponent({
  components: {
    EditableWindowPre,
  },
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: [
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
    'input',
    'scroll',
    'update:scrollTop',
  ],
  setup(props, { emit }) {
    const root = ref(null)        // pre(コンポーネント)
    const preElement = ref(null)  // pre(HTMLエレメント)

    const state = reactive({
      innerHTML: '',      // valueのコピー（キャレット位置をコントロールするために必要）
      isFocused: false,   // フォーカスされている状態かどうか
      isComposing: false, // 入力が未確定であるかどうか（nputイベントでは判別できない為必要）
    })

    // セレクションハンドラ
    const {
      localRange, setLocalRangeBy, setLocalRangeTo,
      recordLocalRange, applyLocalRange, isNotCaretMoved
    } = useSelection()

    // MEMO: HTML書き換え時にキャレットが先頭に移動してしまうため、
    // DOMの再構築が完了後、再びセレクションに適切な範囲を設定する。
    watch(() => props.value, (newValue) => {
      new Promise((resolve) => {
        state.innerHTML = doubleLastLF(newValue)
        if (state.isFocused) resolve()
      })
      .then(() => {
        adjustLocalRange()
        applyLocalRange(preElement.value)
        scrollByInput()
      })
    })

    // 子コンポーネントのラッパー関数
    const blur = () => root.value.blur()
    const focus = () => root.value.focus()
    const getInnerText = () => root.value.getInnerText()
    const getScrollHeight = () => root.value.getScrollHeight()

    // 選択範囲の微調整を行う関数
    const adjustLocalRange = () => {
      const innerText = getInnerText()
      const { startOffset, endOffset } = localRange
      setLocalRangeTo(
        Math.min(innerText.length, startOffset),
        Math.min(innerText.length, endOffset)
      )
    }

    // 現在のキャレット位置にテキストを挿入する関数
    // MEMO: セレクション(見た目)上の範囲に、実際の文字数を合わせるために一時的にデコードする
    // TODO: ペースト後にキャレットが挿入文字列の末尾になるようにしたい
    const insertText = input => {
      recordLocalRange(preElement.value)

      const innerText = getInnerText()
      let a = innerText.slice(0, localRange.startOffset)  // 選択範囲より前
      let b = innerText.slice(localRange.endOffset)       // 選択範囲より後

      // MEMO: DOMの仕様上、終了タグの前の改行はテキストノードにならない
      // => つまり改行とみなされないので、末尾の改行は1つ多くする必要がある
      if (input.slice(-1) === LF && b === '') input += LF

      // aの末尾が改行コードであり、かつ、bが空文字であるならば、
      // aの末尾の改行コードは既に1つ多いはずであり、ノードが結合すれば不要になるので取り除く
      if (a.slice(-1) === LF && b === '') a = a.slice(0, -1)

      // セレクションの範囲を設定する
      setLocalRangeTo((a + input).length)
      emit('input', a + input + b)
    }

    // 最上部へスクロールするイベントを発火する関数
    const scrollToTop = () => emit('scroll', 0)

    // 最下部へスクロールするイベントを発火する関数
    const scrollToBottom = () => emit('scroll', getScrollHeight())

    // 上下矢印キー入力時にキャレット位置に変化がなければスクロールする関数
    const scrollByArrowKey = event => {
      if (isNotCaretMoved(preElement.value)) {
        if (event.key === 'ArrowUp') scrollToTop()
        if (event.key === 'ArrowDown') scrollToBottom()
      }
    }

    // 入力後のキャレットが末尾にあるときに下へスクロールする関数
    const scrollByInput = () => {
      const innerText = getInnerText()
      if (
        innerText.length === localRange.endOffset ||
        innerText.length === localRange.endOffset + 1
      ) {
        scrollToBottom()
      }
    }

    // mousedownイベントハンドラ
    const onMousedown = () => {
      emit('mousedown', event)
    }

    // mouseupイベントハンドラ
    const onMouseup = () => {
      emit('mouseup', event)
    }

    // keydownイベントハンドラ
    // MEMO: Enterキーの入力処理は特別に処理する（brやdivタグを作らせないようにするため）
    const onKeydown = () => {
      if (event.key === 'Process') {
        // 全角入力の未確定時にtrue、確定時にfalseとなる
        state.isComposing = (event.code !== 'Enter')        
      } else {
        // 半角入力、または、改行時
        state.isComposing = false
        if (event.key === 'Enter') {
          event.preventDefault()
          insertText(LF)
        }
        if (event.repeat) {
          scrollByArrowKey(event)
          recordLocalRange(preElement.value)
        }
      }
      emit('keydown', event)
    }

    // keyupイベントハンドラ
    const onKeyup = () => {
      if (event.key !== 'Process') {
        scrollByArrowKey(event)
        recordLocalRange(preElement.value)
      }
      emit('keyup', event)
    }

    // inputイベントハンドラ
    const onInput = () => {
      if (!state.isComposing) {
        event.preventDefault()
        recordLocalRange(preElement.value)
        emit('input', trimLastLF(getInnerText()))
      }
    }

    // pasteイベントハンドラ
    // MEMO: キャレット位置のずれ等につながるため、改行コードをLFに統一させる
    const onPaste = () => {
      const text = getClipboardData(event)
      event.preventDefault()
      insertText(convert2LF(text))
    }

    // (focus／blur)イベントハンドラ
    const onFocus = () => state.isFocused = true
    const onBlur  = () => state.isFocused = false

    // scrollイベントハンドラ
    const onScroll = () => {
      emit('scroll', event.target.scrollTop)
      emit('update:scrollTop', event.target.scrollTop)
    }

    const listeners = {
      blur     : onBlur,
      focus    : onFocus,
      paste    : onPaste,
      input    : onInput,
      scroll   : onScroll,
      keyup    : onKeyup,
      keydown  : onKeydown,
      mouseup  : onMouseup,
      mousedown: onMousedown,
    }

    onMounted(() => {
      preElement.value = getRootElement(root)
      state.innerHTML = props.value
    })

    return {
      root,
      state,
      focus,
      blur,
      listeners,
      setLocalRangeBy,
    }
  }
})
</script>