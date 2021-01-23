const TEST_MODE = 1

// ページテーマ
export const PAGE_THEME = {
  DARK    : 0,
  LIGHT   : 1,
  CLASSIC : 2,
}

// デバイスの種類
export const DEVICE_TYPE = {
  SMART_PHONE : 0,
  TABLET      : 1,
  PC          : 2,
}

// APIアドレスのルート(local or global)
export const API_ROOT = TEST_MODE
  ? 'http://localhost/matrix/api'
  : '/matrix/api'

// APIアドレスのルート(global)
export const API_ROOT_2 = TEST_MODE
  ? 'http://have-a-go.moo.jp/matrix/api'
  : '/matrix/api'

// APIアドレスのルート(GPT-2)
const API_ROOT_GPT_2 = TEST_MODE
  ? 'http://127.0.0.1:5000'
  : 'https://gpt2predictionapi.ml'

// APIアドレス
export const API_ADDRESS = {
  SELECT_QUIZZES  : `${API_ROOT}/quiz/quizzes/select.php`,
  INSERT_QUIZ     : `${API_ROOT}/quiz/quizzes/insert.php`,
  UPDATE_QUIZ     : `${API_ROOT}/quiz/quizzes/update.php`,
  DELETE_QUIZ     : `${API_ROOT}/quiz/quizzes/delete.php`,
  SELECT_TAG      : `${API_ROOT}/quiz/quizzes_tags/select.php`,
  INSERT_TAG      : `${API_ROOT}/quiz/quizzes_tags/insert.php`,
  UPDATE_TAG      : `${API_ROOT}/quiz/quizzes_tags/update.php`,
  DELETE_TAG      : `${API_ROOT}/quiz/quizzes_tags/delete.php`,
  MOVE_TAG_BRANCH : `${API_ROOT}/quiz/quizzes_tags/move_branch.php`,
  INSERT_RELATION : `${API_ROOT}/quiz/quizzes_quizzes_tags_relations/insert.php`,
  DELETE_RELATION : `${API_ROOT}/quiz/quizzes_quizzes_tags_relations/delete.php`,
  GPT_2_PREDICTION: `${API_ROOT_GPT_2}/`,
}
