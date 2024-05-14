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
}
