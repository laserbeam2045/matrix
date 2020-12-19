
/* 文字列処理全般の関数群 */

import { LF } from '@/store/constants'

// 置換用の正規表現オブジェクト
export const regExpCR   = new RegExp(String.fromCharCode(13), 'g')
export const regExpLF   = new RegExp(String.fromCharCode(10), 'g')
export const regExpCRLF = new RegExp(String.fromCharCode(13, 10), 'g')

// 文字列中の数字部分だけを数値型として返す関数(※無ければ0が返る)
export const str2num = str => {
  if (typeof(str) === 'number')
    return str
  else
    return Number(str.match(/[0-9.]*/)[0])
}

// 文字列を空白文字により分割した配列を返す関数
export const splitByBlank = str => {
  return str.split(/\s/).filter(piece => piece)
}

// 文字がアルファベットかどうかを返す関数
export const isAlphabet = char => {
  return !!char.match(/[a-zA-Z]/)
}

// 文字列が空白文字のみであるかどうかを返す関数
export const isOnlyBlank = str => {
  const exp = str.match(/\s+/)
  return !!(exp && exp[0].length === str.length)
}

// 文字列の全角を半角に変換する関数
export const zenkaku2hankaku = str => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g,
    s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  )
}

// 文字列の半角を全角に変換する関数
export const hankaku2zenkaku = str => {
  return str.replace(/[A-Za-z0-9]/g,
    s => String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
  )
}

// 文字列のひらがなをカタカナに変換する関数
export const hira2kata = str => {
  return str.replace(/[\u3041-\u3096]/g,
    s => String.fromCharCode(s.charCodeAt(0) + 0x60)
  )
}

// 文字列のカタカナをひらがなに変換する関数
export const kata2hira = str => {
  return str.replace(/[\u30a1-\u30f6]/g,
    s => String.fromCharCode(s.charCodeAt(0) - 0x60)
  )
}

// LF(\n)以外の改行コードをLFに変換する関数
export const convert2LF = str => {
  return str.replace(regExpCRLF, LF)
            .replace(regExpCR,   LF)
}

// テキストの末尾に改行コードが1つだけ残っている場合に取り除く関数
export const trimLastLF = str => {
  const match = str.match(/\s+$/)
  if (match && match[0] === LF) {
    str = str.slice(0, -1)
  }
  return str
}

// テキストの末尾に改行コードが1つだけ残っている場合に2つに増やす関数
export const doubleLastLF = str => {
  const match = str.match(/\s+$/)
  if (match && match[0] === LF) {
    str += LF
  }
  return str
}

// HTML用にXSSのリスクがある記号をエスケープする関数
export const escapeHTML = str => {
  return str.replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
}

// HTML用にエスケープした文字列をデコードする関数
export const unescapeHTML = str => {
  return str.replace(/&lt;/g,   '<')
            .replace(/&gt;/g,   '>')
            .replace(/&amp;/g,  '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
}

// 正規表現用に文字列をエスケープする関数
export const escapeRegExp = str => {
  return str.replace('\\', '\\\\')
            .replace("'", "\\'")
            .replace('"', '\\"')
            .replace('.', '\\.')
            .replace('*', '\\*')
            .replace('+', '\\+')
            .replace('?', '\\?')
            .replace('^', '\\^')
            .replace('$', '\\$')
            .replace('-', '\\-')
            .replace('|', '\\|')
            .replace('/', '\\/')
            .replace('{', '\\{')
            .replace('}', '\\}')
            .replace('(', '\\(')
            .replace(')', '\\)')
            .replace('[', '\\[')
            .replace(']', '\\]')
}