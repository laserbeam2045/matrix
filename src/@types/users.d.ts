
export interface User {
  profile: {
    name: string
    iconSource: string
    bulletinBoard: string
  }
}

export type Users = Array<User>
