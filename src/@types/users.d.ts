declare import { Ref } from 'vue'


export type User = {
  profile: {
    name: string
    iconSource: string
    bulletinBoard: string
  }
}

export type Users = Array<User>

export type UsersRef = Ref<Users | undefined>
