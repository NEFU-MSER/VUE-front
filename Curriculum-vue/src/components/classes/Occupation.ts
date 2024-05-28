export class Occupation {
  id: string

  libId: string
  courseId: string
  userId: string

  startWeek: number
  endWeek: number
  day: number
  startClass: number
  endClass: number

  constructor(
    id: string,
    libId: string,
    courseId: string,
    userId: string,
    startWeek: number,
    endWeek: number,
    day: number,
    startClass: number,
    endClass: number
  ) {
    this.id = id
    this.libId = libId
    this.courseId = courseId
    this.userId = userId
    this.startWeek = startWeek
    this.endWeek = endWeek
    this.day = day
    this.startClass = startClass
    this.endClass = endClass
  }
}
