import { getRequest } from '@/api/request_methods'
import { API_ADDRESS } from '@/store/constants'

export const fetchUserQuizzes = async(user) => {
  try {
    if (user.profile.name === 'Neo') {
      return getRequest(API_ADDRESS.SELECT_QUIZZES)
    } else {
      throw Error('Invalid user.')
    }
  } catch(e) {
    console.error(e)
  }
}