import { User, convertString } from '@/components/classes/User'
import axios from 'axios'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { buildToken } from '@/components/utils/TokenUtils'
import { ref } from 'vue'
import { urlRoot } from '@/main'

export async function submit() {
  const user = convert()
  console.debug(user)
  await axios({
    method: 'POST',
    url: urlRoot + '/api/user/signIn',
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
  idCard: '',
  password: '',
  passwordAgain: '',
  emailHead: '',
  emailSelect: '@nefu.edu.cn',
  gender: 'male'
})

export const disable = ref(true)
axios.defaults.timeout = 5000
export const tips = ref('')

function convert(): User {
  return new User(
    checkUser.value.name,
    checkUser.value.account,
    checkUser.value.idCard,
    checkUser.value.password,
    checkUser.value.emailHead + checkUser.value.emailSelect,
    convertString(checkUser.value.gender)
  )
}

export function isFull() {
  if (checkUser.value.name.length <= 0) {
    tips.value = '请输入姓名'
    disable.value = true
  } else if (checkUser.value.account.length != 11) {
    tips.value = '请输入正确的电话号码'
    disable.value = true
  } else if (checkUser.value.idCard.length != 18) {
    tips.value = '请输入正确的身份证'
    disable.value = true
  } else if (checkUser.value.emailHead.length < 5) {
    tips.value = '邮箱地址太短'
    disable.value = true
  } else if (checkUser.value.password.length < 6) {
    tips.value = '密码太短'
    disable.value = true
  } else if (checkUser.value.password != checkUser.value.passwordAgain) {
    tips.value = '两次密码不相等'
    disable.value = true
  } else {
    tips.value = ''
    disable.value = false
  }
}
