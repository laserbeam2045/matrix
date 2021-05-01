import { reactive, provide, inject, watch } from 'vue'
import { getRequest } from '@/api/request_methods'

const storeSymbol = Symbol('audio')
const API_ROOT = process.env.VUE_APP_API_ROOT

const createStore = () => {
  const state = reactive({
    error  : null,
    loading: false,
  })
  // Audioインスタンスを辞書式に管理するためのオブジェクト
  const data = reactive({ })

  // エラーをコンソールで監視する
  watch(() => state.error, e => console.error(e))

  // サーバーからfilePathを取得し、データを読み込む関数
  const loadAudio = async(labels) => {
    const audioLabels = labels2csv(labels)

    if (audioLabels) {
      try {
        state.loading = true
        const url = `${API_ROOT}/path/audios/select.php`
        const option = { audioLabels }
        const result = await getRequest(url, option)
        result.forEach(record => data[record.label] = createAudio(record))
      } catch (e) {
        state.error = e
      } finally {
        state.loading = false
      }
    }
  }

  // 引数(=ラベル)のデータが存在しないときにTrueを返す関数
  const isNotExists = label => data[label] === undefined

  // APIリクエストの前処理を行う関数
  const labels2csv = input => {
    if (typeof(input) === 'string') {
      // まだ引数(=ラベル)のデータが存在しなければ、引数をそのまま返す
      return isNotExists(input) ? input : null
    } else
    if (Array.isArray(input)) {
      // データが存在しないラベルに絞った文字列(csv)または、空文字を返す
      return input.filter(label => isNotExists(label)).join(',')
    } else
    if (typeof(input) === 'object') {
      // データが存在しないラベルに絞った文字列(csv)または、空文字を返す
      return Object.values(input).filter(label => isNotExists(label)).join(',')
    } else {
      state.error = Error('Unexpected argument.')
    }
  }

  // audio要素を作り、再生の準備をする関数
  const createAudio = audioData => {
    const { path, fileName, extension, volume } = audioData
    const src = require(`../assets/audios/${path}${fileName}.${extension}`)
    const audio = new Audio(src)
    audio.volume = volume
    audio.load()
    return audio
  }

  // 指定されたラベルのaudioを返す関数
  const getAudio = async(label, execLoad = false) => {
    if (data[label]) {
      return data[label]
    } else {
      if (execLoad) {
        await loadAudio(label)
        return getAudio(label, false)
      } else {
        return null
      }
    }
  }

  // 引数のAudioインスタンスが、再生可能な状態のときにTrueを返す関数
  const isReady = audio => audio?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA

  // 効果音を再生する関数
  const playAudio = async(label) => {
    const audio = await getAudio(label, true)

    if (audio instanceof Audio) {
      // 再生可能ならば再生させる
      if (isReady(audio)) {
        audio.currentTime = 0
        audio.play()
      } else {
        audio.addEventListener('canplaythrough', function fn() {
          audio.removeEventListener('canplaythrough', fn)
          audio.play()
        })
      }
    } else {
      state.error = Error(`Audio error(${label})`)
    }
  }

  // 効果音を停止する関数
  const stopAudio = async label => {
    const audio = await getAudio(label, false)

    if (audio instanceof Audio) {
      audio.pause()
      audio.currentTime = 0
    } else {
      state.error = Error(`Audio error(${label})`)
    }
  }

  return {
    loadAudio,
    playAudio,
    stopAudio,
  }
}

export const provideStore = () => provide(
  storeSymbol,
  createStore(),
)

export const useStore = () => inject(storeSymbol)

export const AUDIOS = {
  // Quiz系
  QUIZ: {
    // QUESTION    : 'QUIZ_QUESTION',
    QUESTION    : 'DECISION_5',
    COUNT_DOWN  : 'QUIZ_COUNT_DOWN',
    PRESS_BUTTON: 'QUIZ_PRESS_BUTTON',
    CORRECT     : 'QUIZ_CORRECT',
    WRONG       : 'QUIZ_WRONG',
  },
  // Avalon系
  AVALON: {
    DROP_MOVE: 'AVALON_DROP_MOVE',
    COMBO_1  : 'AVALON_COMBO_1',
    COMBO_2  : 'AVALON_COMBO_2',
    COMBO_3  : 'AVALON_COMBO_3',
    COMBO_4  : 'AVALON_COMBO_4',
    COMBO_5  : 'AVALON_COMBO_5',
    COMBO_6  : 'AVALON_COMBO_6',
    COMBO_7  : 'AVALON_COMBO_7',
    COMBO_8  : 'AVALON_COMBO_8',
    COMBO_9  : 'AVALON_COMBO_9',
    COMBO_10 : 'AVALON_COMBO_10',
    COMBO_11 : 'AVALON_COMBO_11',
    COMBO_12 : 'AVALON_COMBO_12',
    COMBO_13 : 'AVALON_COMBO_13',
    COMBO_14 : 'AVALON_COMBO_14',
    COMBO_15 : 'AVALON_COMBO_15',
    COMBO_16 : 'AVALON_COMBO_16',
    COMBO_17 : 'AVALON_COMBO_17',
    COMBO_18 : 'AVALON_COMBO_18',
  },
  // その他
  ETC: {
    BOOT       : 'ETC_BOOT',
    TYPE       : 'ETC_TYPE',
    POP_1      : 'POP_1',
    POP_2      : 'POP_2',
    POP_3      : 'POP_3',
    WARNING_1  : 'WARNING_1',
    WARNING_2  : 'WARNING_2',
    WARNING_3  : 'WARNING_3',
    CYBER_02_1 : 'CYBER_02_1',
    CYBER_03_2 : 'CYBER_03_2',
    CYBER_04_1 : 'CYBER_04_1',
    CYBER_05_1 : 'CYBER_05_1',
    CYBER_05_2 : 'CYBER_05_2',
    CYBER_05_3 : 'CYBER_05_3',
    CYBER_06_3 : 'CYBER_06_3',
    CYBER_06_4 : 'CYBER_06_4',
    CYBER_14_1 : 'CYBER_14_1',
    CYBER_15_1 : 'CYBER_15_1',
    CYBER_15_2 : 'CYBER_15_2',
    CYBER_15_3 : 'CYBER_15_3',
    CYBER_15_4 : 'CYBER_15_4',
    CYBER_16_1 : 'CYBER_16_1',
    CYBER_16_2 : 'CYBER_16_2',
    CYBER_17_1 : 'CYBER_17_1',
    CYBER_17_2 : 'CYBER_17_2',
    CYBER_18_1 : 'CYBER_18_1',
    CYBER_18_2 : 'CYBER_18_2',
    CYBER_21_1 : 'CYBER_21_1',
    CYBER_21_2 : 'CYBER_21_2',
    DECISION_1 : 'DECISION_1',
    DECISION_2 : 'DECISION_2',
    DECISION_3 : 'DECISION_3',
    DECISION_4 : 'DECISION_4',
    DECISION_5 : 'DECISION_5',
    DECISION_6 : 'DECISION_6',
    DECISION_7 : 'DECISION_7',
    DECISION_8 : 'DECISION_8',
    DECISION_9 : 'DECISION_9',
    DECISION_21: 'DECISION_21',
    DECISION_22: 'DECISION_22',
    DECISION_23: 'DECISION_23',
    DECISION_24: 'DECISION_24',
    DECISION_25: 'DECISION_25',
    DECISION_26: 'DECISION_26',
    DECISION_27: 'DECISION_27',
    DECISION_30: 'DECISION_30',
    DECISION_33: 'DECISION_33',
    DECISION_34: 'DECISION_34',
    DECISION_35: 'DECISION_35',
    DECISION_37: 'DECISION_37',
    DECISION_40: 'DECISION_40',
    DECISION_41: 'DECISION_41',
    DECISION_42: 'DECISION_42',
    DECISION_43: 'DECISION_43',
    DECISION_46: 'DECISION_46',
  },
  // 英単語
  // const ENGLISH = {
  //   abandon: {
  //     id: 'sound-english-a-abandon',
  //     filePath: 'voice/a/abandon.mp3',
  //   },
  //   able: {
  //     id: 'sound-english-a-able',
  //     filePath: 'voice/a/able.mp3',
  //   },
  //   abroad: {
  //     id: 'sound-english-a-abroad',
  //     filePath: 'voice/a/abroad.mp3',
  //   },
  // }
}
