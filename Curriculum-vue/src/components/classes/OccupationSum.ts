import { Occupation } from '@/components/classes/Occupation'
import { type Course } from '@/components/classes/Course'

export class OccupationSum {
  _course: Course
  _occupationByLib: {
    libId: number
    timeIndex: number
    classTime: { week: [number, number]; day: number; time: [number, number] }
  }[]

  constructor(course: Course) {
    this._course = course
    this._occupationByLib = new Array<{
      libId: number
      timeIndex: number
      classTime: { week: [number, number]; day: number; time: [number, number] }
    }>()
  }

  public append(libId: number, occupation: Occupation) {
    for (const [index, time] of occupation._classTime.entries()) {
      this._occupationByLib.push({
        libId: libId,
        timeIndex: index,
        classTime: time
      })
    }
  }
}
