/* eslint-disable camelcase */

/**
 * YYYY-MM-DD形式の文字列を受け取り、Dateクラスのオブジェクトを返す
 * @param {string} dateString YYYY-MM-DD | YYYY-MM-DD hh:mm:ss ('-'は'/'でも可)
 */
export default function useDateTime(dateString) {
  const usableDateString = convertTo_ISO_8601(dateString)
  const dateObject = new Date(usableDateString)

  const year    = dateObject.getFullYear()   // 西暦(e.g. 2021)
  const month   = dateObject.getMonth() + 1  //   月(e.g. 1)
  const date    = dateObject.getDate()       // 日付(e.g. 1)
  const day     = dateObject.getDay()        // 曜日(e.g. 0)
  const hours   = dateObject.getHours()      // 時間(e.g. 1)
  const minutes = dateObject.getMinutes()    //   分(e.g. 1)
  const seconds = dateObject.getSeconds()    //   秒(e.g. 1)

  const YYYY = zeroPadding(year, 4)
  const MM   = zeroPadding(month)
  const DD   = zeroPadding(date)
  const hh   = zeroPadding(hours)
  const mm   = zeroPadding(minutes)
  const ss   = zeroPadding(seconds)

  return {
    dateObject,
    year,
    month,
    date,
    day,
    hours,
    minutes,
    seconds,
    YYYY,
    MM,
    DD,
    hh,
    mm,
    ss,
  }
}

export const DAY_NAMES = Object.freeze([
  { jpn: '日', eng: 'Sunday' },
  { jpn: '月', eng: 'Monday' },
  { jpn: '火', eng: 'Tuesday' },
  { jpn: '水', eng: 'Wednesday' },
  { jpn: '木', eng: 'Thursday' },
  { jpn: '金', eng: 'Friday' },
  { jpn: '土', eng: 'Saturday' },
])

/**
 * 数値を固定長文字列へ変換する
 * @param {number|string} num   0埋めの対象とする数値(数字)
 * @param {number} targetLength 結果として求める文字の長さ
 * @return {string}
 */
export const zeroPadding = (num, targetLength = 2) => {
  return num.toString().padStart(targetLength, 0)
}

/**
 * (YYYY-MM-DD | YYYY/MM/DD)形式の文字列を受け取り、年、月、日を返す
 * @example const { year, month, date } = splitFromYYYY_MM_DD('2021/04/26')
 * @param  {string} dateString
 * @return {object}
 * @property {string} year  西暦
 * @property {string} month 月
 * @property {string} date  日
 */
export const splitFromYYYY_MM_DD = dateString => {
  const regexp = /^([0-9]{1,4})[-/]([0-1]?[0-9])[-/]([0-3]?[0-9])$/
  const [, year, month, date] = dateString.match(regexp)
  return { year, month, date }
}

/**
 * 年、月、日を受け取り、(YYYY-MM-DD | YYYY/MM/DD)形式の文字列を返す
 * @param  {number|string} year  西暦
 * @param  {number|string} month 月
 * @param  {number|string} date  日
 * @return {string}
 */
export const joinToYYYY_MM_DD = (year, month, date, separator = '-') => {
  const YYYY = zeroPadding(year, 4)
  const MM = zeroPadding(month)
  const DD = zeroPadding(date)
  return [YYYY, MM, DD].join(separator)
}

/**
 * YYYY-MM-DD形式の文字列を、ISO 8601方式の文字列に変換する
 * https://qiita.com/unbabel/items/12487e85525ba1ec1618
 * @param {string} dateStr YYYY-MM-DD | YYYY-MM-DD hh:mm:ss ('-'は'/'でも可)
 * @return {string}
 */
const convertTo_ISO_8601 = dateStr => {
  const regexp = /^([0-9]{1,4})[-/]([0-1]?[0-9])[-/]([0-3]?[0-9])(?: ([0-2]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9]))?$/
  return dateStr.replace(regexp, (_, year, ...arr) => {
    const YYYY = zeroPadding(year, 4)
    const [MM, DD, hh, mm, ss] = arr.map(v => zeroPadding(v ?? 0))
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}+09:00`
  })
}

/**
 * async関数内で、await sleep(ms)として、処理を遅延する関数
 * @param {number} delay  遅延する時間(ms)
 * @return {object}       promiseオブジェクト
 */
export const sleep = (delay = 0) =>
  new Promise(resolve => setTimeout(resolve, Number(delay)))
