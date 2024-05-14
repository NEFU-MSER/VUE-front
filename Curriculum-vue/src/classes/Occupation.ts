import type { User } from '@/classes/User'

export class Occupation {
  _courseId: string
  classTime: { week: [number, number]; day: number[]; time: number[] }
  _userId: string
  _userName: string

  constructor(
    courseId: string,
    user: User,
    classTime: { week: [number, number]; day: number[]; time: number[] }
  ) {
    this._courseId = courseId
    this.classTime = classTime
    this._userId = user._userAccount
    this._userName = user._userName
  }
}
