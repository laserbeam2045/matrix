import { reactive, computed } from 'vue'

// スクロールバーの太さ(px)
const SCROLLBAR_THICKNESS = 5

// スクロールバーの角の丸さ
const BORDER_RADIUS = 8

// スクロールバーの角の丸さのパターン
const BORDER_0 = '0 0 0 0'
const BORDER_1 = `0 0 0 ${BORDER_RADIUS}px`
const BORDER_2 = `0 0 ${BORDER_RADIUS}px 0`
const BORDER_3 = `0 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px`

export default function useScroll({ width, height, position }) {
  const state = reactive({
    clientRect: {
      top: 0,
      left: 0,
      width: 1,
      height: 1,
    },
    scroll: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  })

  // scrollコンテナに設定するstyleObject
  const containerStyle = computed(() => ({
    width: width.value,
    height: height.value,
    [`padding-${position.value}`]: SCROLLBAR_THICKNESS + 'px'
  }))
  
  // position: absolute; 指定でのtop(数値)
  const top = computed(() => {
    switch (position.value) {
      case 'top'   : return 0
      case 'left'  : return 0
      case 'right' : return 0
      case 'bottom': return state.clientRect.height
    }
  })

  // position: absolute; 指定でのleft(数値)
  const left = computed(() => {
    switch (position.value) {
      case 'top'   : return 0
      case 'left'  : return 0
      case 'right' : return state.clientRect.width
      case 'bottom': return 0
    }
  })

  // スクロールバーの横幅(最大値)
  const maxWidth = computed(() => {
    switch (position.value) {
      case 'top'   : return state.clientRect.width
      case 'left'  : return SCROLLBAR_THICKNESS
      case 'right' : return SCROLLBAR_THICKNESS
      case 'bottom': return state.clientRect.width
    }
  })

  // スクロールバーの高さ(最大値)
  const maxHeight = computed(() => {
    switch (position.value) {
      case 'top'   : return SCROLLBAR_THICKNESS
      case 'left'  : return state.clientRect.height
      case 'right' : return state.clientRect.height
      case 'bottom': return SCROLLBAR_THICKNESS
    }
  })

  // scrollbarに設定するstyleObject
  const scrollbarStyle = computed(() => ({
    top: top.value + 'px',
    left: left.value + 'px',
    width: maxWidth.value + 'px',
    height: maxHeight.value + 'px',
  }))

  // 現在の表示領域の終端位置と、コンテンツの終端位置との差
  const currentArea = computed(() => {
    const { clientRect, scroll } = state
    switch (position.value) {
      case 'top'   : return scroll.width - clientRect.width - scroll.left
      case 'left'  : return scroll.height - clientRect.height - scroll.top
      case 'right' : return scroll.height - clientRect.height - scroll.top
      case 'bottom': return scroll.width - clientRect.width - scroll.left
    }
  })

  // 非表示部分を含むコンテンツのサイズと、表示領域のサイズの差
  const maximumArea = computed(() => {
    const { clientRect, scroll } = state
    switch (position.value) {
      case 'top'   : return scroll.width - clientRect.width
      case 'left'  : return scroll.height - clientRect.height
      case 'right' : return scroll.height - clientRect.height
      case 'bottom': return scroll.width - clientRect.width
    }
  })

  // 現在のスクロールされている割合（百分率）
  const progress = computed(() => {
    return Math.max(0, Math.min(100, (1 - currentArea.value / maximumArea.value) * 100))
  })

  // 最大までスクロールされたかどうか
  const isReachedMax = computed(() => 99 < progress.value)

  // progressバーのborder-radiusプロパティ
  const borderRadiusRef = computed(() => {
    switch (position.value) {
      case 'top'   : return BORDER_0
      case 'left'  : return isReachedMax.value ? BORDER_1 : BORDER_0
      case 'right' : return isReachedMax.value ? BORDER_2 : BORDER_0
      case 'bottom': return isReachedMax.value ? BORDER_3 : BORDER_1
    }
  })

  // progressに設定するstyleObject
  const progressStyle = computed(() => {
    const borderRadius = borderRadiusRef.value
    switch (position.value) {
      case 'top'   : return { width : progress.value + '%', borderRadius }
      case 'left'  : return { height: progress.value + '%', borderRadius }
      case 'right' : return { height: progress.value + '%', borderRadius }
      case 'bottom': return { width : progress.value + '%', borderRadius }
    }
  })

  // stateを更新する関数
  const updateState = elm => {
    { // スコープを分ける意味のブロック
      const { top, left, width, height } = elm.getBoundingClientRect()
      state.clientRect = { top, left, width, height }
    }
    const { scrollTop: top, scrollLeft: left, scrollWidth: width, scrollHeight: height } = elm
    state.scroll = { top, left, width, height }
  }

  // scrollイベントハンドラ(scrollableに設定する)
  const onScroll = evt => updateState(evt.target)

  // resizeイベントハンドラ(scrollableに設定する)
  const onResize = elm => updateState(elm)

  return {
    containerStyle,
    scrollbarStyle,
    progressStyle,
    onScroll,
    onResize,
  }
}