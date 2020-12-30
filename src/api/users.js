// import { getRequest } from '@/api/request_methods'
// import { API_ADDRESS } from '@/store/constants'

export const fetchUsers = async(userIds) => {
  try {
    if (userIds[0] === 0) {
      // return getRequest(API_ADDRESS.SELECT_USER)
      return [
        {
          id: 0,
          profile: {
            name: 'Neo',
            bulletinBoard: 'Welcome to the Matrix.',
            iconSource: require('@/assets/images/profile/Neo.jpg'),
          },
        },
      ]
    } else {
      throw Error('Invalid user.')
    }
  } catch(e) {
    console.error(e)
  }
}