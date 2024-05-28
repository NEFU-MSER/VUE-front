import { User, userBuilder } from '@/components/classes/User'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'
import { ResultVO } from '@/components/utils/ResultVO'

export class ProfileData {
  user: User | null = null
  url: string = ''

  constructor(url: string) {
    this.url = url
  }

  async init() {
    console.log('init')
    await axios
      .post(this.url, {
        token: getServerToken()
      })
      .then(async (response) => {
        if (response.data.code === 200) {
          this.user = userBuilder(response.data.data.user)
        } else {
          const resData = new ResultVO(response.data.code, response.data.message)
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
