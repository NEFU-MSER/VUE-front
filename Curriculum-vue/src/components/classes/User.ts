export class User {
  _userName: string
  _userAccount: string
  _userPassword: string
  _email: string
  _gender: number

  constructor(
    userName: string,
    userAccount: string,
    userPassword: string,
    email: string,
    gender: number
  ) {
    this._userName = userName
    this._userAccount = userAccount
    this._userPassword = userPassword
    this._email = email
    this._gender = gender
  }
}


export function convertString(str: string) {
  switch (str) {
    case 'male':
      return 0
    case 'female':
      return 1
    default:
      return 0
  }
}

export function convertNumber(x: number) {
  switch (x) {
    case 0:
      return 'male'
    case 1:
      return 'female'
    default:
      return 'male'
  }
}

export function stringifyUser(user: User) {
  return JSON.stringify(user)
}

export function parseUser(json: string) {
  return <User>JSON.parse(json)
}
