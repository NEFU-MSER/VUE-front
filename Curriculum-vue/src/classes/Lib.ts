import type { Occupation } from '@/classes/Occupation'

export class Lib {
  _libId: number
  _libType: string
  _libOccupations: Array<Occupation>

  constructor(libId: number, libType: string) {
    this._libId = libId
    this._libType = libType
    this._libOccupations = new Array<Occupation>()
  }

  private isRight(addition: Occupation) {
    let callback
    if (this._libOccupations.length === 0) {
      callback = { result: true, reason: 'none' }
      return callback
    } else {
      for (const occ of this._libOccupations) {
        //周次重合判断
        if (
          //oneStartTime < otherEndTime
          occ._classTime.week[0] < addition._classTime.week[1] &&
          //oneEndTime > otherStartTime
          occ._classTime.week[1] > addition._classTime.week[0]
        ) {
          //日期重合判断
          if (occ._classTime.day == addition._classTime.day) {
            //课次重合判断
            if (
              //oneStartTime < otherEndTime
              occ._classTime.time[0] < addition._classTime.time[1] &&
              //oneEndTime > otherStartTime
              occ._classTime.time[1] > addition._classTime.time[0]
            ) {
              callback = {
                result: false,
                reason: '与课程 ' + occ._course._courseName + ' 时间冲突'
              }
              // console.debug(callback)
              return callback
            }
          }
        }
      }
      callback = { result: true, reason: 'none' }
      // console.debug(callback)
      return callback
    }
  }

  public addOccupation(addition: Occupation) {
    const callback = this.isRight(addition)
    if (callback.result) {
      this._libOccupations.push(addition)
      this._libOccupations.sort((first: Occupation, second: Occupation) =>
        first._classTime.week[0] > second._classTime.week[0] ? 1 : -1
      )
    }
    return callback
  }
}
