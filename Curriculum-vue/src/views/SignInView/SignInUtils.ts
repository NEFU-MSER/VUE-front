import { User, convertString } from '@/components/classes/User'
import axios from 'axios'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { ResultVO } from '@/components/utils/ResultVO'
import { buildToken } from '@/components/utils/TokenUtils'
import { ref } from 'vue'

export async function submit() {
  const user = convert()
  console.debug(user)
  await axios({
    method: 'POST',
    url: 'http://localhost:8080/api/user/signIn',
    data: user
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

export const checkUser = ref({
  name: '',
  account: '',
  password: '',
  passwordAgain: '',
  emailHead: '',
  emailSelect: '',
  gender: ''
})

export let disable = true
axios.defaults.timeout = 5000

function convert(): User {
  return new User(
    checkUser.value.name,
    checkUser.value.account,
    checkUser.value.password,
    checkUser.value.emailHead + checkUser.value.emailSelect,
    convertString(checkUser.value.gender)
  )
}

export function isFull() {
  disable = !(
    checkUser.value.account.length === 10 &&
    checkUser.value.name.length > 0 &&
    checkUser.value.password.length >= 6 &&
    checkUser.value.password === checkUser.value.passwordAgain &&
    checkUser.value.emailHead.length >= 5
  )
}
