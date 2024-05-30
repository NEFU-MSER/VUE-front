import type { Lib } from '@/components/classes/Lib'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import { ElMessageBox } from 'element-plus'
import { libBuilder } from '@/components/classes/Lib'

export class LibData {
  libs: Lib[] = new Array<Lib>()
  urlBase: string = ''

  constructor(url: string) {
    this.urlBase = url
  }

  async init() {
    await axios
      .post(this.urlBase + '/getAll')
      .then(async (response) => {
        if (response.data.code === 200) {
          this.libs.splice(0, this.libs.length)
          for (const lib of response.data.data.libs) {
            this.libs.push(libBuilder(lib))
          }
        } else {
          const resData = new ResultVO(response.data.code, response.data.message)
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async typeInit(type: string) {
    await axios
      .post(this.urlBase + '/typeGet', type)
      .then(async (response) => {
        if (response.data.code === 200) {
          this.libs.splice(0, this.libs.length)
          for (const lib of response.data.data.libs) {
            this.libs.push(libBuilder(lib))
          }
        } else {
          const resData = new ResultVO(response.data.code, response.data.message)
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  getIds(): string[] {
    const ids = new Array<string>()
    for (const c of this.libs) {
      if (c.id) {
        ids.push(c.id)
      }
    }
    return ids
  }
}

const urlBase = 'http://localhost:8080/api/lib'
export const libData = new LibData(urlBase)
