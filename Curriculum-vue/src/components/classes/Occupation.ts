export class Occupation {
  id: string | null = null

  libId: string | null = null
  courseId: string

  libName: string
  courseName: string

  week: [number, number] = [1, 1]
  day: number
  time: [number, number] = [1, 1]

  constructor(
    id: string | null,
    libId: string,
    courseId: string,

    libName: string,
    courseName: string,

    week: [number, number],
    day: number,
    time: [number, number]
  ) {
    this.id = id
    this.libId = libId
    this.courseId = courseId

    this.libName = libName
    this.courseName = courseName

    this.week = week
    this.day = day
    this.time = time
  }

  calculate() {
    return (this.week[1] - this.week[0] + 1) * (this.time[1] - this.time[0] + 1) * 0.75
  }
}

export function occupationBuilder(responseData: any): Occupation {
  return new Occupation(
    responseData?.id,
    responseData?.libId,
    responseData?.courseId,
    responseData?.libName,
    responseData?.courseName,
    responseData?.week,
    responseData?.day,
    responseData?.time
  )
}

export function dayConvert(day: number): string {
  switch (day) {
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
    case 7:
      return '星期天'
    default:
      return 'default'
  }
}
