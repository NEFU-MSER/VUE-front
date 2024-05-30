import { courseBuilder } from '@/components/classes/Course'
import { Occupation, occupationBuilder } from '@/components/classes/Occupation'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { Course2Occupation } from '@/components/classes/Course2Occupation'
import { libBuilder } from '@/components/classes/Lib'
import { Lib2Occupation } from '@/components/classes/Lib2Occupation'

export class OccupationData {
  loaded: boolean = false
  course2Occupations: Array<Course2Occupation>
  lib2Occupations: Array<Lib2Occupation>
  urlBase: string = ''

  constructor(urlBase: string) {
    this.course2Occupations = new Array<Course2Occupation>()
    this.lib2Occupations = new Array<Lib2Occupation>()
    this.urlBase = urlBase
  }

  async courseInit(courseIds: string[]) {
    this.loaded = false
    await axios
      .post(
        this.urlBase + '/courseGet',
        {
          token: getServerToken(),
          data: courseIds
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(async (res) => {
        if (res.data.code === 200) {
          const resData = res.data.data.course2Occupations
          this.course2Occupations.splice(0, this.course2Occupations.length)
          for (const course2Occupation of resData) {
            const course = courseBuilder(course2Occupation.course)
            const occupations = new Array<Occupation>()
            let sumTime = 0
            for (const occupation of course2Occupation.occupations) {
              const temp = occupationBuilder(occupation)
              occupations.push(temp)
              sumTime +=
                (temp.week[1] - temp.week[0] + 1) * (temp.time[1] - temp.time[0] + 1) * 0.75
            }
            this.course2Occupations.push(new Course2Occupation(course, occupations, sumTime))
          }
          this.loaded = true
        } else {
          this.loaded = false
          const resData = new ResultVO(res.data.code, res.data.message)
          if (resData.code == 403) {
            sessionStorage.clear()
            await router.push('/main')
          }
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  async libInit(libIds: string[]) {
    this.loaded = false
    await axios
      .post(
        this.urlBase + '/libGet',
        {
          token: getServerToken(),
          data: libIds
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(async (res) => {
        if (res.data.code === 200) {
          const resData = res.data.data.libs2Occupation
          this.lib2Occupations.splice(0, this.lib2Occupations.length)
          for (const lib2Occupation of resData) {
            const lib = libBuilder(lib2Occupation.lib)
            const occupations = new Array<Occupation>()
            for (const occupation of lib2Occupation.occupations) {
              const temp = occupationBuilder(occupation)
              occupations.push(temp)
            }
            this.lib2Occupations.push(new Lib2Occupation(lib, occupations))
          }
          this.loaded = true
        } else {
          this.loaded = false
          const resData = new ResultVO(res.data.code, res.data.message)
          if (resData.code == 403) {
            sessionStorage.clear()
            await router.push('/main')
          }
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
}

export const occupationData: OccupationData = new OccupationData(
  'http://localhost:8080/api/occupation'
)
