/* eslint-disable camelcase */

// ECMAScriptでは、ISO 8601方式しか定義されていないため、
// Dateクラスをcross-platformに扱うためには変換が必要となる。
// https://qiita.com/unbabel/items/12487e85525ba1ec1618
// YYYY-MM-DD形式と、YYYY-MM-DD hh:mm:ss形式が変換可能
const replace2_ISO_8601 = dateStr => {
  const regexp = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?: ([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/
  return dateStr.replace(regexp, (match, year, month, day, hour, minutes, seconds) => (
    `${year}-${month}-${day}T${hour || '00'}:${minutes || '00'}:${seconds || '00'}+09:00`
  ))
}

// async関数内でawait sleep(ms)として処理を遅延する
export const sleep = (delay = 0) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * FIXME: フロントで避けたい処理なのでAPIとの調整で解消したい
 * @param {String} timeString  e.g. '2021-02-05 08:30:00'
 */
 export default function useDateTime(timeString) {
  const usableTimeString = replace2_ISO_8601(timeString)
  const dateObject = new Date(usableTimeString)

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
