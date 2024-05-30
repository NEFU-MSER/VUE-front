import { Course, courseBuilder } from '@/components/classes/Course'
import { User, userBuilder } from '@/components/classes/User'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'
import router from '@/router'

export class CourseData {
  courses: Course[]
  user: User
  urlBase: string = ''

  constructor(url: string) {
    this.urlBase = url
    this.courses = new Array<Course>()
    this.user = new User('', '', '', '', 0)
  }

  async init() {
    await axios
      .post(this.urlBase + '/userGet', {
        token: getServerToken()
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          this.user = userBuilder(res.data.data.user)
          this.courses.splice(0, this.courses.length)
          for (const course of res.data.data.courses) {
            this.courses.push(courseBuilder(course))
          }
        } else {
          if (res.data.code == 403) {
            sessionStorage.clear()
            await router.push('/main')
          }
          await ElMessageBox.alert(res.data.message, res.data.code.toString()).catch()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  toIds(): string[] {
    const ids = new Array<string>()
    for (const c of this.courses) {
      if (c.id) {
        ids.push(c.id)
      }
    }
    return ids
  }
}

const urlBase = 'http://localhost:8080/api/course'
export const courseData = new CourseData(urlBase)
