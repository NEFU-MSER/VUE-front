import axios from 'axios'
import router from '@/router'
import { buildToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'
import { urlRoot } from '@/main'
import { ref } from 'vue'

axios.defaults.timeout = 5000

export const loginForm = ref({
  account: '',
  password: ''
})
export const tips = ref('')
export const disable = ref(true)

export function isFull() {
  if (loginForm.value.account.length != 11) {
    disable.value = true
    tips.value = '账号要求11位手机号'
  } else if (loginForm.value.password.length < 6) {
    disable.value = true
    tips.value = '密码要大于等于6位'
  } else {
    disable.value = false
    tips.value = ''
  }
}

export async function submit(account: string, password: string) {
  const loginForm = {
    account: account,
    password: password
  }
  await axios({
    method: 'POST',
    url: urlRoot + '/api/user/login',
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
