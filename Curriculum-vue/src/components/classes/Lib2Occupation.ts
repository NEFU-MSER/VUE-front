import { type Lib } from '@/components/classes/Lib'
import { type Occupation } from '@/components/classes/Occupation'

export class Lib2Occupation {
  lib: Lib

  occupations: Occupation[]

  constructor(lib: Lib) {
    this.lib = lib
    this.occupations = new Array<Occupation>()
  }
}
