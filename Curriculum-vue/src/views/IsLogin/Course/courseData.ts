import { Course } from '@/components/classes/Course'
import type { User } from '@/components/classes/User'

export class CourseData {
  courses: Course[]
  user: User | null = null
  url: string = ''

  constructor(url: string) {
    this.url = url
    this.courses = new Array<Course>()
  }

  async init(){

  }
}
