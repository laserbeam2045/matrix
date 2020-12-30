import { getRequest } from '@/api/request_methods'
import { API_ADDRESS } from '@/store/constants'

export const fetchQuizTags = async(user) => {
  try {
    if (user.profile.name === 'Neo') {
      return getRequest(API_ADDRESS.SELECT_TAG)
    } else {
      throw Error('Invalid user.')
    }
  } catch(e) {
    console.error(e)
  }
}