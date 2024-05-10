export class User {
  userName: string
  userAccount: string
  userPassword: string
  email: string
  gender: number

  constructor(
    userName: string,
    userAccount: string,
    userPassword: string,
    email: string,
    gender: number
  ) {
    this.userName = userName
    this.userAccount = userAccount
    this.userPassword = userPassword
    this.email = email
    this.gender = gender
  }

  convert(str: string) {
    switch (str) {
      case 'male':
        return 0
      case 'female':
        return 1
      default:
        return 0
    }
  }

  stringifyUser(user: User) {
    return JSON.stringify(user)
  }

  parseUser(json: string) {
    return <User>JSON.parse(json)
  }
}
