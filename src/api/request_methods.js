
// GETリクエスト
export const getRequest = (url = '', data = {}) => {
  const searchParams = createSearchParams(data)
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'text/plain' },
  }
  return fetch(url + searchParams, options)
    // 1. ネットワーク周りなどのリクエスト以前の段階でのエラーを処理する
    .catch((e) => { throw Error(e) })
    // 2. サーバサイドで発行されたエラーステータスを処理する
    .then(handleErrors)
    // 3. 以上2つをパスした正常なレスポンスからJSONオブジェクトをパースする
    .then(response => response.json())
}

// POSTリクエスト
export const postRequest = (url = '', data = {}) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  }
  return fetch(url, options)
    // 1. ネットワーク周りなどのリクエスト以前の段階でのエラーを処理する
    .catch((e) => { throw Error(e) })
    // 2. サーバサイドで発行されたエラーステータスを処理する
    .then(handleErrors)
    // 3. 以上2つをパスした正常なレスポンスからJSONオブジェクトをパースする
    .then(response => response.json())
}

// オブジェクトからGETリクエスト用のパラメータ文字列を生成する関数
const createSearchParams = (data = {}) => {
  const searchParams = new URLSearchParams()
  for (const key of Object.keys(data)) {
    searchParams.set(key, data[key])
  }
  const params = searchParams.toString()
  return params ? ('?' + params) : ''
}

// エラー処理
const handleErrors = response => {
  if (response.ok) return response

  switch (response.status) {
    case 400: throw Error('INVALID_TOKEN')
    case 401: throw Error('UNAUTHORIZED')
    case 500: throw Error('INTERNAL_SERVER_ERROR')
    case 502: throw Error('BAD_GATEWAY')
    case 404: throw Error('NOT_FOUND')
    default:  throw Error('UNHANDLED_ERROR')
  } 
}