export class Lib {
  _libNum: number
  _libType: string
  _openTime: Date
  _openWeek: number


  constructor(libNum: number, libType: string, openTime: Date, openWeek: number) {
    this._libNum = libNum
    this._libType = libType
    this._openTime = openTime
    this._openWeek = openWeek

  }
}
