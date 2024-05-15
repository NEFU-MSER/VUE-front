export class ClassTime {
  _week: [number, number]
  _detail: { day: number; time: number[] }[]

  constructor(week: [number, number], detail: { day: number; time: number[] }[]) {
    this._week = week
    this._detail = detail
  }
}
