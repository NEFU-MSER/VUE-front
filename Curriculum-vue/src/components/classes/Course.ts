export class Course {
  id: string | null = null

  name: string
  credit: number
  time: number
  userId: string

  constructor(id: string | null, name: string, credit: number, time: number, userId: string) {
    this.id = id
    this.name = name
    this.credit = credit
    this.time = time
    this.userId = userId
  }
}

export function courseBuilder(responseData: any): Course {
  return new Course(
    responseData?.id,
    responseData?.name,
    responseData?.credit,
    responseData?.time,
    responseData?.userId
  )
}
