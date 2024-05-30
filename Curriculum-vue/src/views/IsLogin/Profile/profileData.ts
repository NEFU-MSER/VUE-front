import { User, userBuilder } from '@/components/classes/User'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'

export class ProfileData {
  user: User | null = null
  url: string = ''

  constructor(url: string) {
    this.url = url
  }

  async init() {
    await axios
      .post(this.url, {
        token: getServerToken()
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          this.user = userBuilder(res.data.data.user)
        } else {
          const resData = new ResultVO(res.data.code, res.data.message)
          if (resData.code == 403) {
            sessionStorage.clear()
            await router.push('/main')
          }
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export const profileData = new ProfileData('http://localhost:8080/api/user/profile')
