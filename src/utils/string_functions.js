
/* 文字列処理全般の関数群 */


// 平仮名／片仮名の、開始／終了の、文字コードの値
const CHAR_CODE_HIRAGANA_BEGIN = 0x3041   // 12353
const CHAR_CODE_HIRAGANA_END   = 0x3096   // 12438
const CHAR_CODE_KATAKANA_BEGIN = 0x30a1   // 12449
const CHAR_CODE_KATAKANA_END   = 0x30fa   // 12538

// 改行コード（\を使えない処理系のために使用）
export const CR   = String.fromCharCode(13)      // 古いMac OS
export const LF   = String.fromCharCode(10)      // Unix系OS, Mac OS（全てこれに統一する）
export const CRLF = String.fromCharCode(13, 10)  // Windows系OS

// 置換用の正規表現オブジェクト
export const regExpCR   = new RegExp(CR, 'g')
export const regExpLF   = new RegExp(LF, 'g')
export const regExpCRLF = new RegExp(CRLF, 'g')

// 平仮名 全86文字
export const HIRAGANA = [
  'ぁ', 'あ', 'ぃ', 'い', 'ぅ', 'う', 'ぇ', 'え', 'ぉ', 'お',
  'か', 'が', 'き', 'ぎ', 'く', 'ぐ', 'け', 'げ', 'こ', 'ご',
  'さ', 'ざ', 'し', 'じ', 'す', 'ず', 'せ', 'ぜ', 'そ', 'ぞ',
  'た', 'だ', 'ち', 'ぢ', 'っ', 'つ', 'づ', 'て', 'で', 'と', 'ど',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ば', 'ぱ', 'ひ', 'び', 'ぴ', 'ふ', 'ぶ', 'ぷ', 'へ', 'べ', 'ぺ', 'ほ', 'ぼ', 'ぽ',
  'ま', 'み', 'む', 'め', 'も',
  'ゃ', 'や', 'ゅ', 'ゆ', 'ょ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'ゎ', 'わ', 'ゐ', 'ゑ', 'を', 'ん',
  'ゔ', 'ゕ', 'ゖ',
]

// 片仮名 全90文字
export const KATAKANA = [
  'ァ', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', 'ェ', 'エ', 'ォ', 'オ',
  'カ', 'ガ', 'キ', 'ギ', 'ク', 'グ', 'ケ', 'ゲ', 'コ', 'ゴ',
  'サ', 'ザ', 'シ', 'ジ', 'ス', 'ズ', 'セ', 'ゼ', 'ソ', 'ゾ',
  'タ', 'ダ', 'チ', 'ヂ', 'ッ', 'ツ', 'ヅ', 'テ', 'デ', 'ト', 'ド',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'バ', 'パ', 'ヒ', 'ビ', 'ピ', 'フ', 'ブ', 'プ', 'ヘ', 'ベ', 'ペ', 'ホ', 'ボ', 'ポ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ャ', 'ヤ', 'ュ', 'ユ', 'ョ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ヮ', 'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン',
  'ヴ', 'ヵ', 'ヶ',
  'ヷ', 'ヸ', 'ヹ', 'ヺ',
]

// アルファベット(小文字)
export const ALPHABETS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z',
]

// 数字('0' ~ '9')
export const NUMERICS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]


// 引数の文字が、平仮名であるかどうか
export const isHiragana = char => {
  const code = char.charCodeAt()
  return (CHAR_CODE_HIRAGANA_BEGIN <= code && code <= CHAR_CODE_HIRAGANA_END)
}

// 引数の文字が、片仮名であるかどうか
export const isKatakana = char => {
  const code = char.charCodeAt()
  return (CHAR_CODE_KATAKANA_BEGIN <= code && code <= CHAR_CODE_KATAKANA_END)
}

// 引数の文字が、アルファベットであるかどうか
export const isAlphabet = data => {
  return !!(typeof(data) === 'string' && data.match(/^[a-zA-Zａ-ｚＡ-Ｚ]+$/))
}

// 引数の文字が、数字(数値)であるかどうか
export const isNumeric = data => {
  return !!(typeof(data) === 'number' || data.match(/^[0-9０-９]+$/))
}

// 文字列が空白文字のみであるかどうかを返す関数
export const isOnlyBlank = str => {
  const exp = str.match(/\s+/)
  return !!(exp && exp[0].length === str.length)
}


// 文字列中の数字部分だけを数値型として返す関数(※無ければ0が返る)
export const str2num = val => {
  if (typeof val === 'number')
    return val
  else
    return Number(val.match(/[0-9.]*/)[0])
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

// 文字列を空白文字により分割した配列を返す関数
export const splitByBlank = str => {
  return str.split(/\s/).filter(piece => piece)
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