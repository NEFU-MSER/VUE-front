export class Course {
  id: number

  name: string
  credit: number
  time: number
  userId: string

  constructor(id: number, name: string, credit: number, time: number, userId: string) {
    this.id = id
    this.name = name
    this.credit = credit
    this.time = time
    this.userId = userId
  }
}
