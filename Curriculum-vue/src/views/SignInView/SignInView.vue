<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import axios from 'axios'
import router from '../../router/index'
import { server } from '../../components/Server'
import { ElMessageBox } from 'element-plus'
import { User } from '@/components/classes/User'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Server = server

const email: Array<String> = [
  '@nefu.edu.cn',
  '@163.com',
  '@126.com',
  '@qq.com',
  '@outlook.com',
  '@gmail.com'
]
let signInForm = reactive({
  userName: '',
  userAccount: '',
  userPassword: '',
  passwordAgain: '',
  gender: '',
  e_mail: '',
  select: ''
})

let disable = true
let loading = false
axios.defaults.timeout = 5000

function convert(str: string) {
  switch (str) {
    case 'male':
      return 0
    case 'female':
      return 1
    default:
      return 0
  }
}

async function onSubmit() {
  loading = true
  const user: User = new User(
    signInForm.userName,
    signInForm.userAccount,
    signInForm.userPassword,
    signInForm.e_mail + signInForm.select,
    convert(signInForm.gender)
  )
  console.debug(user)
  await axios({
    method: 'POST',
    url: 'https://my.api.com/signIn',
    data: user
  })
    .then(async (response) => {
      if (response.data.result === true) {
        console.debug(sessionStorage)
        await router.push('/main')
      } else {
        switch (response.data.reason) {
          case 1:
            await ElMessageBox.alert('账户已存在！', '出错啦')
            break
          case 2:
            await ElMessageBox.alert('账户信息不合格', '出错啦')
            break
          default:
            await ElMessageBox.alert(
              '我也不知道哪里错了，正常来说这条不会出现，除非你黑我',
              '你小子!'
            )
            break
        }
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      loading = false
    })
}

function isFull() {
  return (
    signInForm.userAccount.length === 10 &&
    signInForm.userName.length > 0 &&
    signInForm.userPassword.length >= 6 &&
    signInForm.userPassword === signInForm.passwordAgain &&
    signInForm.e_mail.length >= 5
  )
}

watch(
  signInForm,
  () => {
    disable = !isFull()
  },
  {
    deep: true
  }
)

onMounted(() => {
  ElMessageBox.alert('账号10位数字, 密码大于6位, 姓名,邮箱必填; 数据不上传服务器放心写', '提示')
})
</script>

<template>
  <el-row style="height: 200px" />
  <el-row>
    <el-col :span="12" :offset="6">
      <el-form v-loading="loading" v-model="signInForm" label-width="auto" class="box" id="from">
        <el-input v-model="signInForm.userName" type="text" class="inputStyle" placeholder="姓名" />
        <el-input
          v-model="signInForm.userAccount"
          type="text"
          class="inputStyle"
          placeholder="账号" />
        <el-input
          v-model="signInForm.userPassword"
          type="password"
          class="inputStyle"
          placeholder="密码"
          show-password />
        <el-input
          v-model="signInForm.passwordAgain"
          type="password"
          class="inputStyle"
          placeholder="再次输入密码"
          show-password />
        <el-input v-model="signInForm.e_mail" type="text" placeholder="邮箱" class="inputStyle">
          <template #append>
            <el-select v-model="signInForm.select" placeholder="@example.com" style="width: 200px">
              <el-option
                v-for="(detail, index) of email"
                :key="index"
                :label="detail"
                :value="detail"></el-option>
            </el-select>
          </template>
        </el-input>
        <el-row>
          <el-radio-group v-model="signInForm.gender" label="性别">
            <el-radio value="male" size="large">男</el-radio>
            <el-radio value="female" size="large">女</el-radio>
          </el-radio-group>
        </el-row>
        <el-button
          type="primary"
          @click="onSubmit"
          name="submit"
          v-model:disabled="disable"
          style="margin-top: 5px">
          注册
        </el-button>
        <RouterLink to="/login">
          <el-button type="danger" style="margin-top: 5px; margin-left: 10px">返回</el-button>
        </RouterLink>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.inputStyle {
  margin-top: 5px;
  width: 100%;
}
.icon {
  padding: 5px;
  transition: 0.7s;
}
.icon:hover {
  background-color: rgba(0, 210, 255, 0.1);
  border-radius: 3px;
  transition: 0.7s;
}
el-input {
  background-color: rgba(255, 255, 255, 0.247) !important;
}
</style>
