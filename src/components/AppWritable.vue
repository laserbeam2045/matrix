<template>
  <canvas
    id="fabric-canvas"
    ref="canvas"
    :width="fabricProps.width"
    :height="fabricProps.height"
  />
</template>

<script>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import fabric from '@/utilities/CustomFabric'
import _ from 'lodash'

export default defineComponent({
  props: {
    width: {
      type    : Number,
      required: true,
    },
    height: {
      type    : Number,
      required: true,
    },
  },
  emits: [
    'initialize',
    'write',
  ],
  setup(props, { emit }) {
    const canvas = ref(null)
    const fabricCanvas = ref(null)

    const state = reactive({
      isClean   : true,   // 何も描かれていない状態かどうか
      isClearing: true,   // clearメソッドを呼び出したかどうか
    })
    const fabricProps = reactive({
      id             : 'fabric-canvas',
      width          : props.width,
      height         : props.height,
      isDrawingMode  : true,
      backgroundColor: 'transparent',
      brush          : {
        width : 3,
        color : 'white',
        shadow: new fabric.Shadow({
          blur : 3,
          color: 'rgb(0, 255, 255)',
        }),
      },
    })

    watch(() => props.width, newWidth => {
      fabricProps.width = newWidth
      initCanvas()
    })
    watch(() => props.height, newHeight => {
      fabricProps.height = newHeight
      initCanvas()
    })

    const initState = () => {
      state.isClean = true
      state.isClearing = true
    }

    const createFabricCanvas = () => {
      if (fabricCanvas.value) {
        fabricCanvas.value.dispose()
      }
      const { id, width, height, isDrawingMode, backgroundColor } = fabricProps
      fabricCanvas.value = new fabric.Canvas(id, {
        width, height, isDrawingMode, backgroundColor,
      })
    }

    const setFabricBrush = () => {
      Object.assign(fabricCanvas.value.freeDrawingBrush, fabricProps.brush)
    }

    const addFabricEvent = () => {
      fabricCanvas.value.on('after:render', () => {
        if (state.isClearing) {
          state.isClearing = false
        } else {
          state.isClean = false
          emit('write', canvas)
        }
      })
    }

    // fabricCanvasを初期化する関数
    const initCanvas = _.debounce(() => {
      initState()
      createFabricCanvas()
      setFabricBrush()
      addFabricEvent()
      emit('initialize', canvas)
    }, 10)

    // キャンバスをリセットする関数
    const clear = () => {
      initState()
      fabricCanvas.value.clear()
    }

    onMounted(() => {
      initCanvas()
    })

    return { fabricProps, canvas, clear }
  },
})
</script>
