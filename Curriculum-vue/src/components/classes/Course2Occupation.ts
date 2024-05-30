import { Course } from '@/components/classes/Course'
import { Occupation } from '@/components/classes/Occupation'

export class Course2Occupation {
  course: Course
  occupations: Occupation[]
  sumTime: number

  constructor(course: Course, occupations: Occupation[], sumTime: number) {
    this.course = course
    this.occupations = occupations
    this.sumTime = sumTime
  }
}
