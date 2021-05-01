import * as tf from '@tensorflow/tfjs'
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm'
import { unref } from 'vue'
import Rahmen from '@/utilities/Rahmen'

const INPUT_SIZE = 40       // NNに渡す画像データの一辺のサイズ
const MIN_RECT_SIZE = 114   // 描画部分のみ切り出すときのサイズの下限
const API_ROOT_2 = process.env.VUE_APP_API_ROOT_2

// 手書き文字認識クラス
export default class OCR {
  constructor(canvas) {
    this.setCanvas(canvas)

    // wasmバックエンドを使用する設定。
    // MEMO: 32ビット浮動小数点数を扱えないハードウェアのために必要
    // https://www.tensorflow.org/js/guide/platform_environment
    setWasmPaths({
      'tfjs-backend-wasm.wasm'              : `${API_ROOT_2}/wasm/wasm.php`,
      'tfjs-backend-wasm-simd.wasm'         : `${API_ROOT_2}/wasm/wasm-simd.php`,
      'tfjs-backend-wasm-threaded-simd.wasm': `${API_ROOT_2}/wasm/wasm-threaded-simd.php`,
    })
    tf.setBackend('wasm').then(() => this.main())
  }

  // 学習済みモデルをロードする処理
  async main() {
    const modelPath = `${API_ROOT_2}/ocr/trained_data/model.json`
    this.model = await tf.loadLayersModel(modelPath)
  }

  // canvasを新しくセットするメソッド
  setCanvas(canvas) {
    this.canvas = unref(canvas)
  }

  // canvasに書かれた文字を推論するメソッド
  predict() {
    if (this.model) {
      return tf.tidy(() => {
        const input  = this.createInputData()
        const output = this.model.predict(input)
        const index  = output.argMax(1).dataSync()[0]

        return this.getSymbol(index)
      })
    }
  }

  // 入力データを作成するメソッド
  createInputData() {
    const rahmen1 = this.preprocessingStep1()
    const rahmen2 = this.preprocessingStep2(rahmen1)
    const rahmen3 = this.preprocessingStep3(rahmen2)
    const { imageData } = rahmen3.getImageData()
    // document.querySelector('#contents').appendChild(rahmen3.canvas)

    return tf.tidy(() => {
      return tf.browser.fromPixels(imageData, 1)
        .cast('float32')
        .div(tf.scalar(255))
        .reshape([1, INPUT_SIZE, INPUT_SIZE, 1])
    })
  }

  // 前処理その１(現在の状態に背景色をつける)
  preprocessingStep1() {
    const { width, height } = this.canvas
    const rahmen = new Rahmen(width, height, 'black')

    return rahmen.fillRect().drawImage(this.canvas)
  }

  // 前処理その２(描画範囲だけの切り出し、ダウンサイズ、白黒反転、グレースケール化)
  preprocessingStep2(input) {
    // const { left: sx, top: sy, width: sw, height: sh } = input.getRect()
    // const beforeSize = Math.max(sw, sh, MIN_RECT_SIZE)
    // const padding    = Math.round(beforeSize * 0.2)
    // const afterSize  = beforeSize + padding * 2
    // const dx = padding
    // const dy = padding
    // const dw = sw
    // const dh = sh

    // return new Rahmen(afterSize, afterSize, 'black')
    //              .fillRect()
    //              .drawImage(input, sx, sy, sw, sh, dx, dy, dw, dh)
    //              .downScaleTo(INPUT_SIZE)
    //              .toNegative()
    //              .toGrayScale()
    MIN_RECT_SIZE
    return input.downScaleTo(INPUT_SIZE)
      .toNegative()
      .toGrayScale()
  }

  // 前処理その３(中心の座標と重心の座標のずれ方を求め、必要領域だけ転写する)
  preprocessingStep3(input) {
    const centerOfFrame = input.getCenterOfFrame(),
      centerOfGravity = input.getCenterOfGravity(),
      sx = 0,
      sy = 0,
      sw = input.width,
      sh = input.height,
      dx = Math.round(centerOfFrame.x - centerOfGravity.x),
      dy = Math.round(centerOfFrame.y - centerOfGravity.y),
      dw = INPUT_SIZE,
      dh = INPUT_SIZE

    return new Rahmen(INPUT_SIZE, INPUT_SIZE, 'white')
      .fillRect()
      .drawImage(input, sx, sy, sw, sh, dx, dy, dw, dh)
  }

  // 推論結果の数値を文字に変換するメソッド
  getSymbol(index) {
    if (index === 52)      return String.fromCharCode(39)          // ' (シングルクオート)
    else if (index === 53) return String.fromCharCode(45)          // - (ハイフン
    else if (index === 54) return String.fromCharCode(46)          // . (ピリオド)
    else if (index === 55) return String.fromCharCode(47)          // / (スラッシュ)
    else if (index === 56) return String.fromCharCode(124)         // | (パイプ)
    else if (index === 57) return String.fromCharCode(880)         // Ͱ (ヘータ)
    else if (index === 58) return String.fromCharCode(915)         // Γ (ガンマ)
    else if (index === 59) return String.fromCharCode(923)         // Λ (ラムダ)
    else if (index === 60) return String.fromCharCode(947)         // γ (ガンマ)
    else if (index === 61) return 'DEL'
    else if (index < 26)   return String.fromCharCode(index + 65)  // アルファベット(大文字)
    else                   return String.fromCharCode(index + 71)  // アルファベット(小文字)
  }
}
