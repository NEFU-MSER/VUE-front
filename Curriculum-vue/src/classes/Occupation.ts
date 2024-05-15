import type { Course } from '@/classes/Course'

export class Occupation {
  _course: Course
  _classTime: { week: [number, number]; day: number; time: number[] }
  _timeDescribe: string

  static dayConvert(day: number): string {
    switch (day) {
      case 1:
        return '周一'
      case 2:
        return '周二'
      case 3:
        return '周三'
      case 4:
        return '周四'
      case 5:
        return '周五'
      case 6:
        return '周六'
      case 7:
        return '周日'
      default:
        return '周一'
    }
  }

  static timeConvert(time: number[]): string {
    return time[0].toString() + '-' + time[1].toString() + '节'
  }

  static classTimeConvert(classTime: {
    week: [number, number]
    day: number
    time: number[]
  }): string {
    return (
      classTime.week[0].toString() +
      '-' +
      classTime.week[1].toString() +
      '周 ' +
      this.dayConvert(classTime.day) +
      ' ' +
      this.timeConvert(classTime.time)
    )
  }

  constructor(course: Course, classTime: { week: [number, number]; day: number; time: number[] }) {
    this._course = course
    this._classTime = classTime
    this._timeDescribe = Occupation.classTimeConvert(classTime)
  }
}
