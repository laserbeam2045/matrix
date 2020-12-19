<template>
  <div
    ref="readable"
    class="readable"
    v-resize="onResize"
  >
    <Writable
      ref="writable"
      :width="state.width"
      :height="state.height"
      @initialize="initOCR"
      @write="predict"
    />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { API_ROOT_2 } from '@/store/constants'
import Writable from '@/components/organisms/Writable'
import OCR from '@/utils/OCR'
import _ from 'lodash'

export default defineComponent({
  name: 'Readable',
  emits: [
    'predict',
  ],
  components: {
    Writable,
  },
  setup(props, { emit }) {
    const readable = ref(null)
    const writable = ref(null)

    const state = reactive({
      width: 0,
      height: 0,
      isFresh: true,
    })

    const ocr = new OCR()

    const initOCR = canvas => {
      ocr.setCanvas(canvas)
      if (state.isFresh) {
        ocr.predict()
      }
    }

    // canvasに書かれた文字を推測する関数
    const predict = () => {
      const isFresh = state.isFresh
      state.isFresh = false
      emit('predict', {
        data: ocr.predict(),
        isFresh,
      })
    }

    // canvasに書かれた文字を消す関数
    const clear = () => {
      writable.value.clear()
      state.isFresh = true
    }

    // サーバーに画像を送信する関数
    const send = () => {
      const cvs = ocr.preprocessing().canvas
      sendImage(String.fromCharCode(950), cvs)
      clear()
    }

    // サーバーに画像を送信する処理
    const sendImage = (label, canvas) => {
      // canvasデータからblobオブジェクトを作成
      canvas.toBlob(blob => {
        const url = `${API_ROOT_2}/ocr/import.php`
        const oReq = new XMLHttpRequest()
        const fd = new FormData()

        // FormDataに画像とラベルを追加
        fd.append("label", label)
        fd.append("image", blob)
        fd.append("before_size", 160)
        fd.append("after_size", 40)
        fd.append("brush_width", 3)
        // メソッドと送信先を指定
        oReq.open("POST", url, true)
        // 送信
        oReq.send(fd)
      }, "image/png")
    }

    // windowのサイズが変更された時の処理
    const onResize = _.debounce(() => {
      state.width = readable.value.clientWidth
      state.height = readable.value.clientHeight
    }, 200)

    onMounted(() => {
      onResize()
    })

    return {
      state,
      readable,
      writable,
      initOCR,
      predict,
      clear,
      send,
      onResize,
    }
  }
})
</script>

<style lang="scss" scoped>
.readable {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>