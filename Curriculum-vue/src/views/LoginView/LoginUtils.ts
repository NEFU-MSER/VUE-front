import axios from 'axios'
import router from '@/router'
import { ResultVO } from '@/components/utils/ResultVO'
import { buildToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'

axios.defaults.timeout = 5000

export async function submit(account: string, password: string) {
  const loginForm = {
    account: account,
    password: password
  }
  await axios({
    method: 'POST',
    url: 'http://localhost:8080/api/user/login',
    data: loginForm
  })
    .then(async (response) => {
      if (response.data.code === 200) {
        sessionStorage.setItem('token', buildToken(response.data.data.token))
        await router.push('main')
      } else {
        ElMessageBox.alert(response.data.message, response.data.code.toString()).catch()
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
