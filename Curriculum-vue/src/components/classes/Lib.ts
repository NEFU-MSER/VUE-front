import type { Occupation } from '@/components/classes/Occupation'

export class Lib {
  _libId: number
  _libType: string
  _libOccupations: Array<Occupation>

  constructor(libId: number, libType: string) {
    this._libId = libId
    this._libType = libType
    this._libOccupations = new Array<Occupation>()
  }

  public isRight(addition: Occupation) {
    let callback
    if (this._libOccupations.length === 0) {
      callback = { result: true, reason: 'none' }
      return callback
    } else {
      for (const occ of this._libOccupations) {
        for (let i = 0; i < occ._classTime.length; i++) {
          for (let j = 0; j < addition._classTime.length; j++) {
            //周次重合判断
            if (
              //oneStartTime < otherEndTime
              occ._classTime[i].week[0] < addition._classTime[j].week[1] &&
              //oneEndTime > otherStartTime
              occ._classTime[i].week[1] > addition._classTime[j].week[0]
            ) {
              //日期重合判断
              if (occ._classTime[i].day == addition._classTime[j].day) {
                //课次重合判断
                if (
                  //oneStartTime < otherEndTime
                  occ._classTime[i].time[0] < addition._classTime[j].time[1] &&
                  //oneEndTime > otherStartTime
                  occ._classTime[i].time[1] > addition._classTime[j].time[0]
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
      for (const occupation of this._libOccupations) {
        if (occupation._course._courseName === addition._course._courseName) {
          occupation.addTime(addition._classTime[0])
          callback.reason = '添加成功'
          return callback
        }
      }
      this._libOccupations.push(addition)
      this._libOccupations.sort((first: Occupation, second: Occupation) =>
        first._classTime[0].week[0] > second._classTime[0].week[0] ? 1 : -1
      )
      callback.reason = '创建成功'
      return callback
    }
    return callback
  }
}
