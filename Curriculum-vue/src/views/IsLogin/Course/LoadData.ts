import { type Ref, ref } from 'vue'
import { Course } from '@/components/classes/Course'
import { Lib } from '@/components/classes/Lib'
import { OccupationSum } from '@/components/classes/OccupationSum'
import axios from 'axios'
import { User } from '@/components/classes/User'
import { ElMessageBox } from 'element-plus'

export class LoadData {
  user: User
  myCourses: Ref<Course[]>
  libs: Ref<Lib[]>
  Sum: Ref<OccupationSum[]>
  urlBase: string

  constructor(urlBase: string) {
    this.myCourses = ref(new Array<Course>())
    this.libs = ref(new Array<Lib>())
    this.Sum = ref(new Array<OccupationSum>())
    this.urlBase = urlBase
    this.user = new User('', '', '', '', 0)
    this.loadUser('/profile').then().catch()
  }

  async loadUser(target: string): Promise<boolean> {
    let loaded = false
    await axios
      .get(this.urlBase + target)
      .then((response) => {
        if (response.data.result != false) {
          this.user = response.data.data
          loaded = true
        }
      })
      .catch((error) => {
        console.error(error)
      })
    return loaded
  }

  async loadCourses(target: string): Promise<boolean> {
    let loaded = false
    await axios
      .get(this.urlBase + target)
      .then((res) => {
        const data: { result: null | Course[]; reason: string } = res.data
        if (data.result != null) {
          this.myCourses.value.splice(0, Infinity)
          this.myCourses.value = this.myCourses.value.concat(data.result)
          loaded = true
        } else {
          ElMessageBox.alert('获取任课信息失败，请联系管理员！', '错误').catch((error) => {
            console.error(error)
          })
        }
      })
      .catch((e) => {
        console.error(e)
      })
    return loaded
  }

  async loadLibs(target: string): Promise<boolean> {
    let loaded = false
    await axios
      .get(this.urlBase + target)
      .then((res) => {
        const data = res.data
        if (data.reason === 0) {
          this.libs.value.splice(0, Infinity)
          const temp: any[] = data.result
          for (let i = 0; i < temp.length; i++) {
            this.libs.value.push(temp[i].Lib)
          }
          loaded = true
        } else {
          ElMessageBox.alert('获取实验室信息失败，请联系管理员！', '错误').catch((error) => {
            console.error(error)
          })
        }
      })
      .catch((e) => {
        console.error(e)
      })
    return loaded
  }

  async init(): Promise<boolean> {
    const loadC = await this.loadCourses('/getMyCourses')
    const loadL = await this.loadLibs('/getLibs')

    if (loadC && loadL) {
      this.Sum.value.splice(0, Infinity)
      for (const course of this.myCourses.value) {
        const sum = new OccupationSum(course)
        for (const lib of this.libs.value) {
          for (const occupation of lib._libOccupations) {
            if (course._courseName === occupation._course._courseName) {
              sum.append(lib._libId, occupation)
            }
          }
        }
        this.Sum.value.push(sum)
      }
    }
    return loadC && loadL
  }
}
