export class User {
  id: string
  name: string
  account: string
  password: string
  email: string
  gender: number

  constructor(
    userName: string,
    userAccount: string,
    userPassword: string,
    email: string,
    gender: number
  ) {
    this.id = ''
    this.name = userName
    this.account = userAccount
    this.password = userPassword
    this.email = email
    this.gender = gender
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

export function userBuilder(responseData: any): User {
  const user = new User(
    responseData?.name,
    responseData?.account,
    responseData?.password,
    responseData?.email,
    responseData?.gender
  )
  user.id = responseData?.id
  return user
}
