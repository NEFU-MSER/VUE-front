import type { User } from './User'

export class Course {
  _teacherId: string
  _teacherName: string
  _courseName: string
  _courseCredit: number
  _courseTime: [number, number]

  constructor(teacher: User, courseName: string, courseCredit: number, courseTime: number) {
    this._teacherId = teacher._userAccount
    this._teacherName = teacher._userName
    this._courseName = courseName
    this._courseCredit = courseCredit
    this._courseTime = [0, courseTime]
  }

  public addTime(addTime: number): { result: boolean; reason: string } {
    if (this._courseTime[0] + addTime <= this._courseTime[1]) {
      this._courseTime[0] += addTime
      return { result: true, reason: '添加成功' }
    } else {
      return { result: false, reason: '课时超长' }
    }
  }

  public deleteTime(deleteTime: number): { result: boolean; reason: string } {
    if (this._courseTime[0] - deleteTime <= this._courseTime[1]) {
      this._courseTime[0] -= deleteTime
      return { result: true, reason: '删除成功' }
    } else {
      return { result: true, reason: '删除全部课时成功' }
    }
  }
}
