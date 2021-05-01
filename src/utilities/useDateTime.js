/* eslint-disable camelcase */

// YYYY-MM-DD形式の文字列にマッチする正規表現オブジェクト
export const YYYY_MM_DD = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])$/

/**
 * 年、月、日を受け取り、YYYY-MM-DD形式の文字列を返す
 * @param  {number|string} year  西暦
 * @param  {number|string} month 月
 * @param  {number|string} date  日
 * @return {string}
 */
export const joinToYYYYMMDD = (year, month, date) => {
  const YYYY = `000${year}`.slice(-4)
  const MM = `0${month}`.slice(-2)
  const DD = `0${date}`.slice(-2)
  return `${YYYY}-${MM}-${DD}`
}

/**
 * YYYY-MM-DD形式の文字列を受け取り、年、月、日を返す
 * @example const { year, month, date } = splitFromYYYYMMDD('2021/04/26')
 * @example year ==== '2021' && month ==== '04' && date === '26'
 * @param  {string} dateString YYYY-MM-DD形式の文字列
 * @return {object}
 * @property {string} year  西暦
 * @property {string} month 月
 * @property {string} date  日
 */
export const splitFromYYYYMMDD = dateString => {
  const [, year, month, date] = dateString.match(YYYY_MM_DD)
  return { year, month, date }
}

// ECMAScriptでは、ISO 8601方式しか定義されていないため、
// Dateクラスをcross-platformに扱うためには変換が必要となる。
// https://qiita.com/unbabel/items/12487e85525ba1ec1618
// YYYY-MM-DD形式と、YYYY-MM-DD hh:mm:ss形式が変換可能
const convertTo_ISO_8601 = dateStr => {
  const regexp = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?: ([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/
  return dateStr.replace(regexp, (match, year, month, day, hour, minutes, seconds) => (
    `${year}-${month}-${day}T${hour || '00'}:${minutes || '00'}:${seconds || '00'}+09:00`
  ))
}

/**
 * 文字列を受け取り、dateObjectを返す
 * @param {string} dateString  e.g. '2021-02-05 08:30:00'
 */
export default function useDateTime(dateString) {
  const usableDateString = convertTo_ISO_8601(dateString)
  const dateObject = new Date(usableDateString)

  const year    = dateObject.getFullYear()   // 西暦(e.g. 2021)
  const month   = dateObject.getMonth() + 1  //   月(e.g. 12)
  const date    = dateObject.getDate()       // 日付(e.g. 31)
  const day     = dateObject.getDay()        // 曜日(e.g. 0)
  const hours   = dateObject.getHours()      // 時間(e.g. 23)
  const minutes = dateObject.getMinutes()    //   分(e.g. 59)
  const seconds = dateObject.getSeconds()    //   秒(e.g. 59)

  return {
    dateObject,
    year,
    month,
    date,
    day,
    hours,
    minutes,
    seconds,
  }
}

/**
 * async関数内で、await sleep(ms)として、処理を遅延する関数
 * @param {number} delay  遅延する時間(ms)
 * @return {object}       promiseオブジェクト
 */
export const sleep = (delay = 0) =>
  new Promise(resolve => setTimeout(resolve, Number(delay)))
