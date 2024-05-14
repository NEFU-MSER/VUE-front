import type { User } from './User'

export class Course {
  _teacherId: string
  _courseId: string

  constructor(teacher: User, courseId: string) {
    this._teacherId = teacher._userAccount
    this._courseId = courseId
  }
}
