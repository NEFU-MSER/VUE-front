import type { User } from './User'

export class Course {
  _teacherId: string
  _teacherName: string
  _courseName: string

  constructor(teacher: User, courseName: string) {
    this._teacherId = teacher._userAccount
    this._teacherName = teacher._userName
    this._courseName = courseName
  }
}
