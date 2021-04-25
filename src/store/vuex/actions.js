import { URL } from '@/constants'

export default {
  
  // 汎用POSTリクエストアクション
  post (_, payload) {
    const options = {
      method: 'POST',
      body: JSON.stringify(payload.params),
      headers: {'Content-Type': 'application/json'},
    }
    return fetch(payload.url, options)
          .catch(err => console.log(err))
  },

  // 汎用GETリクエストアクション
  get (_, payload) {
    const options = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    }
    let url = payload.url

    if ('params' in payload) {
      const searchParams = new URLSearchParams()
      for (const key of Object.keys(payload.params)) {
        searchParams.set(key, payload.params[key])
      }
      url += ('?' + searchParams.toString())
    }
    return fetch(url, options)
          .then(response => response.json())
          .catch(err => console.error(err))
  },

  // 特定のクイズを取得するアクション
  getQuiz ({ dispatch }, { quizId }) {
    const options = {
      url: URL.SELECT_QUIZZES,
      params: { quizIds: quizId },
    }
    return dispatch('get', options)
  },

  // 全てのクイズを取得するアクション
  getQuizzes ({ dispatch, commit }) {
    const options = {
      url: URL.SELECT_QUIZZES,
    }
    return dispatch('get', options)
          .then(data => commit('setQuizzes', data))
  },

  // クイズを作成するアクション
  postQuiz ({ dispatch }, { question, bestAnswer, answer }) {
    const options = {
      url: URL.INSERT_QUIZ,
      params: { question, bestAnswer, answer },
    }
    return dispatch('post', options)
  },

  // クイズを更新するアクション
  updateQuiz ({ dispatch }, { question, bestAnswer, answer, quizId }) {
    const options = {
      url: URL.UPDATE_QUIZ,
      params: { question, bestAnswer, answer, quizId },
    }
    return dispatch('post', options)
  },

  // クイズを削除するアクション
  deleteQuiz ({ dispatch }, { quizId }) {
    const options = {
      url: URL.DELETE_QUIZ,
      params: { quizId },
    }
    return dispatch('post', options)
  },

  // 特定のタグを取得するアクション
  getQuizTag ({ dispatch }, { tagId }) {
    const options = {
      url: URL.SELECT_TAG,
      params: { tagId },
    }
    return dispatch('get', options)
  },

  // 全てのタグを取得するアクション
  getQuizTags ({ dispatch, commit }) {
    const options = {
      url: URL.SELECT_TAG,
    }
    return dispatch('get', options)
          .then(data => commit('setQuizTags', data))
  },

  // タグを作成するアクション
  postQuizTag ({ dispatch }, { pID, label, background }) {
    const options = {
      url: URL.INSERT_TAG,
      params: { pID, label, background },
    }
    return dispatch('post', options)
  },

  // タグを更新するアクション
  updateQuizTag ({ dispatch }, { id, label, background }) {
    const options = {
      url: URL.UPDATE_TAG,
      params: { id, label, background },
    }
    return dispatch('post', options)
  },

  // タグを削除するアクション
  deleteQuizTag ({ dispatch }, { tagId }) {
    const options = {
      url: URL.DELETE_TAG,
      params: { tagId },
    }
    return dispatch('post', options)
  },

  // クイズとタグを関連付けるアクション
  postRelation ({ dispatch }, { quizId, tagId }) {
    const options = {
      url: URL.INSERT_RELATION,
      params: { quizId, tagId },
    }
    return dispatch('post', options)
  },

  // クイズとタグの関連付けを解除するアクション
  deleteRelation ({ dispatch }, { quizId, tagId }) {
    const options = {
      url: URL.DELETE_RELATION,
      params: { quizId, tagId },
    }
    return dispatch('post', options)
  },

  // タグのツリー構造に変更を加えるアクション
  moveTagTree ({ dispatch }, { cID, pID, idx }) {
    const options = {
      url: URL.MOVE_TAG_TREE,
      params: { cID, pID, idx },
    }
    return dispatch('post', options)
  },
}