import { reactive, computed } from 'vue'

// スクロールバーの太さ
const SCROLLBAR_THICKNESS = 5

export default function useScroll(position) {
  const state = reactive({
    clientRect: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
    scrollTop: 0,
    scrollHeight: 0,
  })

  // position: fixed 指定での top
  const top = computed(() => {
    const { top, height } = state.clientRect
    switch (position) {
      case 'Top'    : return top
      case 'Left'   : return top
      case 'Right'  : return top
      case 'Bottom' : return top + height - SCROLLBAR_THICKNESS
    }
  })

  // position: fixed 指定でのleft
  const left = computed(() => {
    const { left, width } = state.clientRect
    switch (position) {
      case 'Top'    : return 0
      case 'Left'   : return left
      case 'Right'  : return left + width - SCROLLBAR_THICKNESS
      case 'Bottom' : return 0
    }
  })

  // スクロールバーの横幅(最大値)
  const width = computed(() => {
    switch (position) {
      case 'Top'    : return state.clientRect.width
      case 'Left'   : return SCROLLBAR_THICKNESS
      case 'Right'  : return SCROLLBAR_THICKNESS
      case 'Bottom' : return state.clientRect.width
    }
  })

  // スクロールバーの高さ(最大値)
  const height = computed(() => {
    switch (position) {
      case 'Top'    : return SCROLLBAR_THICKNESS
      case 'Left'   : return state.clientRect.height
      case 'Right'  : return state.clientRect.height
      case 'Bottom' : return SCROLLBAR_THICKNESS
    }
  })

  // 現在の表示領域の終端位置と、コンテンツの終端位置との差
  const currentArea = computed(() => {
    return state.scrollHeight - state.clientRect.height - state.scrollTop
  })

  // 非表示部分を含むコンテンツのサイズと、表示領域のサイズの差
  const maximumArea = computed(() => {
    return state.scrollHeight - state.clientRect.height
  })

  // 現在のスクロールされている割合（百分率）
  const progress = computed(() => {
    return (1 - currentArea.value / maximumArea.value) * 100
  })

  // scrollイベントハンドラ(scrollコンテナに設定する)
  const onScroll = evt => {
    const { top, left, width, height } = evt.target.getBoundingClientRect()
    state.clientRect = { top, left, width, height }
    state.scrollTop = evt.target.scrollTop
    state.scrollHeight = evt.target.scrollHeight
  }

  // styleObject(scrollコンテナに設定する)
  const containerStyle = computed(() => ({
    ['padding' + position]: SCROLLBAR_THICKNESS + 'px'
  }))

  // scrollbarコンポーネントに渡すプロパティ
  const scrollbarProps = computed(() => ({
    top: top.value + 'px',
    left: left.value + 'px',
    width: width.value + 'px',
    height: height.value + 'px',
    progress: progress.value + '%',
  }))

  return { onScroll, containerStyle, scrollbarProps }
}