import { reactive, computed, readonly, provide, inject } from 'vue'
import { postRequest } from '@/api/request_methods'
import { API_ADDRESS } from '@/store/constants'
import { splitByBlank, isOnlyBlank } from '@/utils/string_functions'
import { deepCopy } from '@/utils/array_functions'
import Aset from '@/utilities/Aset'

const storeSymbol = Symbol('GPT-2')

// predictionのデータ構造例
// 左から、確率、単語、includeFlag
// [
//   [
//     ["0.06636305", "of", true]
//   ],
//   [
//     ["0.0021662766", "on", true]
//   ],
//   [
//     ["0.0003373353", "occurs", true],
//     ["0.6016537", " when", false],
//   ],
//   ...
//   [
//     ["1.0236192e-05", "oid", true]
//   ]
// ]

const createStore = () => {
  // const joinCharList = [',', '.', '\'', '"', ')', ']', '}', '!', '?']

  const state = reactive({
    error: null,
    connected: true,   // サーバーと接続されているかどうか
    connecting: false,  // サーバーとの接続中かどうか
    requesting: false,  // サーバーにリクエスト中かどうか
    text: '',           // 入力された文字列
    tabFlag: false,     // 最後に入力したキーがTabキーかどうか
    prediction: [],     // 予測した単語と確率を含む3次元配列
    requestNumber: 0,   // レスポンスを管理するための値
  })

  // 文章を空白文字により分割した配列
  const textsArray = computed(() => new Aset(splitByBlank(state.text)))

  // 全ての空白文字を半角スペースに変換した文章
  const preProcessedText = computed(() => textsArray.value.join(' '))

  // 文章の末尾の単語
  const lastWord = computed(() => textsArray.value.last || '')

  // 文章の末尾の文字
  const lastChar = computed(() => state.text.slice(-1))

  // 文章が未入力かどうか
  const isTextEmpty = computed(() => state.text === '')

  // 文章が空白文字のみであるかどうか
  const isTextOnlyBlank = computed(() => isOnlyBlank(state.text))

  // 文章の末尾の文字が、空白文字かどうか
  const isLastCharactorBlank = computed(() => !!lastChar.value.match(/\s/))

  // 予測された次の単語
  const nextWord = computed(() => {
    if (state.prediction.length) {
      return state.prediction[0][0][1]
    } else {
      return ''
    }
  })

  // 予測された次の単語が、入力途中という前提で予測されたかどうか
  const includeFlag = computed(() => {
    if (state.prediction.length)
      return state.prediction[0][0][2]
    else
      return false
  })

  // 次の単語の前にスペースが必要かどうか
  const nextWordNeedsBlank = computed(() => {
    if (
      includeFlag.value ||
      isNextWordPartialMatch.value ||
      isLastCharactorBlank.value ||
      nextWord.value[0] !== ' '
      //this.joinCharList1.some(c => c === this.nextWord[0]) ||
      //this.joinCharList2.some(c => c === this.lastChar)
    ) {
      return false
    } else {
      return true
    }
  })

  // 結合用に前処理を施した次の単語
  const preProcessedNextWord = computed(() => {
    let word = nextWord.value.trim()
    if (
      isNextWordPartialMatch.value ||
      isNextWordPerfectMatch.value
    ) {
      word = word.slice(lastWord.value.length)
    }
    if (nextWordNeedsBlank.value)
      return ' ' + word
    else
      return word
  })

  // ???
  const afterText = computed(() => {
    if (!nextWord.value) return ''
    const after = state.prediction[0].slice(1)
    if (after.length)
      return after.reduce((acc, cur) => acc + cur[1], '')
    else
      return ''
  })

  // 予測された単語から成る句
  const predictedText = computed(() => {
    if (!nextWord.value) return ''
    return preProcessedNextWord.value + afterText.value
  })

  // 予測された次の単語が、末尾の文字列と完全一致するかどうか
  const isNextWordPerfectMatch = computed(() => {
    return nextWord.value && lastWord.value === nextWord.value.trim()
  })

  // 予測された次の単語が、末尾の文字列と前方一致するかどうか
  const isNextWordPartialMatch = computed(() => {
    const word = nextWord.value.trim()
    return (
      lastWord.value.length &&
      lastWord.value.length < word.length &&
      lastWord.value === word.slice(0, lastWord.value.length)
    )
  })

  // APIにリクエストを送信してはいけないかどうか
  const notAllowRequest = computed(() => {
    return (
      isTextEmpty.value ||
      isTextOnlyBlank.value ||
      nextWord.value && !state.tabFlag ||
      !state.connected
    )
  })

  // APIに渡すデータとオプション
  const postParams = computed(() => {
    return {
      'text'         : preProcessedText.value,
      'lastWord'     : lastWord.value,
      'blankFlag'    : isLastCharactorBlank.value,
      'tabFlag'      : state.tabFlag,
      'requestNumber': state.requestNumber,
    }
  })

  /* functions */

  // textのセッター
  const setText = value => state.text = value

  // tabFlagのセッター
  const setTabFlag = value => state.tabFlag = value

  // 予測単語の配列を確率順に並べ替える関数
  const sortWords = () => {
    state.prediction.sort(compareFunc)
  }

  // 確率順（降順）に並べ替えるためにsortメソッドに渡す比較関数
  const compareFunc = (a, b, n = 0) => {
    const diff = Number(b[n][0]) - Number(a[n][0])
    if (diff) {
      return diff
    } else {
      const n1 = n + 1
      if (a[n1] && b[n1]) return compareFunc(a, b, n1)
      else if (a[n1])     return -1
      else if (b[n1])     return 1
      else                return 0
    }
  }

  // APIにリクエストを送信する処理
  const getNextWords = async() => {
    if (notAllowRequest.value) return
    state.requesting = true
    const apiAddress = API_ADDRESS.GPT_2_PREDICTION
    const requestNumber = ++state.requestNumber
  try {
      const jsonData = await postRequest(apiAddress, postParams.value)
      if (requestNumber === state.requestNumber) {
        updatePrediction(jsonData)
      }
    } catch(e) {
      state.error = e
      state.connected = false
    } finally {
      state.requesting = false
    }
  }

  // 予測単語リストに新しいデータを追加する関数
  const updatePrediction = newData => {
    state.prediction = state.prediction.concat(newData)
    sortWords()
  }

  // 正しくない予測をフィルターにかけるメソッド
  const filteringWords = () => {
    while (state.prediction.length) {
      if (
        (
          isNextWordPartialMatch.value ||
          isNextWordPerfectMatch.value
        ) && !isLastCharactorBlank.value ||
        (
          isLastCharactorBlank.value &&
          nextWord.value[0] === ' '
        )
      ) {
        return
      } else {
        state.prediction.shift()
      }
    }
  }

  // 最後の単語が予想した単語と一致したときの処理
  const matchProcessing = () => {
    const newArray = []
    const word = nextWord.value
    state.prediction.forEach($sequence => {
      const sequence = deepCopy($sequence)
      if (sequence[0][1] !== word) {
        return
      }
      sequence.shift()
      if (sequence.length) {
        newArray.push(sequence)
      }
    })
    state.prediction = newArray
    sortWords()
  }

  return {
    state: readonly(state),
    lastChar,
    nextWord,
    predictedText,
    preProcessedNextWord,
    isNextWordPartialMatch,
    isNextWordPerfectMatch,
    setText,
    setTabFlag,
    getNextWords,
    matchProcessing,
    filteringWords,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)