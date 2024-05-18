import type { Course } from '@/components/classes/Course'

export class Occupation {
  _course: Course
  _classTime: { week: [number, number]; day: number; time: [number, number] }[]
  _timeDescribe: string

  public static dayConvert(day: number): string {
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

  static classTimeConvert(
    classTime: {
      week: [number, number]
      day: number
      time: number[]
    }[]
  ): string {
    let result: string = ''
    for (let i = 0; i < classTime.length; i++) {
      result +=
        classTime[i].week[0].toString() +
        '-' +
        classTime[i].week[1].toString() +
        '周 ' +
        this.dayConvert(classTime[i].day) +
        ' ' +
        this.timeConvert(classTime[i].time) +
        (i < classTime.length - 1 ? ' ; ' : '')
    }
    return result
  }

  public deleteTime(index: number) {
    this._classTime.splice(index, 1)
    this._timeDescribe = Occupation.classTimeConvert(this._classTime)
  }

  public addTime(classTime: { week: [number, number]; day: number; time: [number, number] }) {
    this._classTime.push(classTime)
    this._timeDescribe = Occupation.classTimeConvert(this._classTime)
  }

  constructor(
    course: Course,
    classTime: { week: [number, number]; day: number; time: [number, number] }[]
  ) {
    this._course = course
    this._classTime = classTime
    this._timeDescribe = Occupation.classTimeConvert(classTime)
  }
}

export function dayConvert(day: number): string {
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
