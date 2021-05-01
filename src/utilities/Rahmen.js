import * as tf from '@tensorflow/tfjs'

// canvasを扱うクラス
export default class Rahmen {
  constructor(width, height, backgroundColor='transparent') {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.backgroundColor = backgroundColor
    this.setSize(width, height)
  }

  // canvasもろともリサイズするメソッド
  setSize(width, height) {
    if (height === undefined) {
      height = width
    }
    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height
    return this
  }

  // 矩形に塗りつぶすメソッド
  fillRect(x=0, y=0, width, height, bgColor) {
    if (width === undefined) width = this.width
    if (height === undefined) height = this.height
    if (bgColor === undefined) bgColor = this.backgroundColor
    this.context.fillStyle = bgColor
    this.context.fillRect(x, y, width, height)
    return this
  }

  // コードを簡略化するため。contextのメソッドとほぼ同じ。
  drawImage(image, sx=0, sy=0, sw, sh, dx, dy, dw, dh) {
    if (image instanceof Rahmen) {
      image = image.canvas
    }
    if (sw === undefined) sw = image.width
    if (sh === undefined) sh = image.height
    if (dx === undefined) {
      [dx, dy, dw, dh] = [sx, sy, sw, sh]
    }
    this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    return this
  }

  // コードを簡略化するため。contextのメソッドより戻り値が多い。
  getImageData() {
    const { context, width, height } = this
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data

    return { imageData, data }
  }

  // 描画されている矩形範囲を取得する
  // MEMO: (例はテストケースを参照)
  getRect() {
    const { imageData } = this.getImageData()
    const { sumV, sumH } = tf.tidy(() => {
      const tensor = tf.browser
        .fromPixels(imageData, 1)
        .reshape([this.height, this.width])

      const sumV = tensor.sum(0).dataSync() // 垂直方向に値を積算する
      const sumH = tensor.sum(1).dataSync() // 水平方向に値を積算する
      return { sumV, sumH }
    })
    // 端から数えたときに最初にデータが存在する位置を求める
    // MEMO: findIndexは、条件を満たす要素がない場合は-1を返す(結果として0になる)
    const top = Math.max(0, sumH.findIndex(num => num))
    const left = Math.max(0, sumV.findIndex(num => num))
    const right = Math.max(0, sumV.reverse().findIndex(num => num))
    const bottom = Math.max(0, sumH.reverse().findIndex(num => num))

    // 描画領域のサイズ
    const width = this.width - (left + right)
    const height = this.height - (top + bottom)

    return { top, left, right, bottom, width, height }
  }

  // 中心の座標を取得するメソッド
  getCenterOfFrame() {
    return {
      x: this.width / 2,
      y: this.height / 2,
    }
  }

  // 重心の座標を取得するメソッド(白地に黒文字が前提)
  getCenterOfGravity() {
    const { width, height } = this
    const { imageData } = this.getImageData()

    return tf.tidy(() => {
      const tensor1 = tf.browser.fromPixels(imageData, 1).reshape([height, width])
      const tensor2 = tf.sub(tf.scalar(255), tensor1)
      const area = tensor2.sum()
      const sumX = tensor2.sum(0).mul(tf.range(0, width, 1)).sum()
      const sumY = tensor2.sum(1).mul(tf.range(0, height, 1)).sum()
      // wasm@2.8.1ではdivがエラーとなる(12/22/2020)
      const x = tf.div(sumX, area).dataSync()
      const y = tf.div(sumY, area).dataSync()
      return { x, y }
    })
  }

  // データを指定サイズまで縮小する
  // TODO: 様々なsizeの場合について検証が必要
  downScaleTo(size) {
    const halfOf = x => Math.ceil(x / 2)
    let tmpSize = size

    // 現在のサイズを少し上回る、一辺が(size * 2^n)のキャンバスを作成
    // MEMO: この処理の理由は、画質を保つため
    while (tmpSize < this.width) tmpSize *= 2
    const rahmens = [new Rahmen(tmpSize)]
    rahmens[0].drawImage(this, 0, 0, this.width, this.width, 0, 0, tmpSize, tmpSize)

    // 指定サイズになるまで2分の1ずつ縮小する
    while (tmpSize !== size) {
      const halfSize = halfOf(tmpSize)
      rahmens.push(new Rahmen(halfSize))
      const newRahmen = rahmens.slice(-1)[0]
      const oldRahmen = rahmens.slice(-2)[0]
      newRahmen.drawImage(oldRahmen, 0, 0, tmpSize, tmpSize, 0, 0, halfSize, halfSize)
      tmpSize = halfSize
    }
    const newRahmen = rahmens.slice(-1)[0]
    this.setSize(size)
    this.drawImage(newRahmen, 0, 0, size, size)
    return this
  }

  // 白黒を反転させる
  toNegative() {
    const { imageData, data } = this.getImageData()

    for (let i = 0, len = data.length; i < len; i += 4) {
      data[i + 0] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
    this.context.putImageData(imageData, 0, 0)
    return this
  }

  // グレースケールに変換する
  toGrayScale() {
    const { imageData, data } = this.getImageData()

    for (let i = 0, len = data.length; i < len; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      const gray = (306 * r + 601 * g + 117 * b) >> 10
      data[i] = data[i + 1] = data[i + 2] = gray
    }
    this.context.putImageData(imageData, 0, 0)
    return this
  }

  // データを指定サイズまで縮小する
  // MEMO: tfを使用するバージョンだが遅いので使用しない
  // downScale2(newWidth, newHeight) {
  //   const { imageData } = this.getImageData()
  //   const channel = 4
  //   const image = tf.browser.fromPixels(imageData, channel)
  //   const size = [newHeight, newWidth]
  //   const alignCorners = true

  //   const newData = tf.image.resizeBilinear(image, size, alignCorners)
  //                           .flatten()
  //                           .round()
  //                           .dataSync()

  //   this.setSize(newWidth, newHeight)
  //   const { imageData: imageData2, data } = this.getImageData()

  //   for (let i = 0, len = newData.length; i < len; i++) {
  //     data[i] = newData[i];
  //   }
  //   this.context.putImageData(imageData2, 0, 0)

  //   return this
  // }
}

// 簡易テスト
// const rahmen = new Rahmen(300, 300)
// rahmen.fillRect(75, 75, 150, 150, 'limegreen')
// document.body.appendChild(rahmen.canvas)
// rahmen.downScaleTo(150, 150)
