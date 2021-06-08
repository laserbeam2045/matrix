import { getRequest } from 'api/request_methods'

const API_ADDRESS = process.env.VUE_APP_API_SELECT_TAG

export const fetchQuizTags = async(user) => {
  try {
    if (user.profile.name === 'Neo') {
      return getRequest(API_ADDRESS)
    } else {
      throw Error('Invalid user.')
    }
  } catch (e) {
    console.error(e)
  }
}
