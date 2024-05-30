import { Occupation } from '@/components/classes/Occupation'
import type { Lib } from '@/components/classes/Lib'

export class Lib2Occupation {
  lib: Lib
  occupations: Occupation[]

  constructor(lib: Lib, occupations: Occupation[]) {
    this.lib = lib
    this.occupations = occupations
  }
}
