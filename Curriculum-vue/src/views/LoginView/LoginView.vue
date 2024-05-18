<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import axios from 'axios'
import { server } from '@/components/Server'
import router from '../../router/index'
import { ElMessageBox } from 'element-plus'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Server = server

let loginForm = reactive({
  userAccount: '',
  userPassword: ''
})

let disable = true
let loading = false
axios.defaults.timeout = 5000

async function onSubmit() {
  loading = true
  console.log(loginForm)
  await axios({
    method: 'POST',
    url: 'https://my.api.com/login',
    data: loginForm
  })
    .then(async (response) => {
      if (response.data.result === true) {
        console.debug(sessionStorage)
        await router.push('/main')
      } else {
        switch (response.data.reason) {
          case 1:
            await ElMessageBox.alert('该账户未注册', '出错啦')
            break
          case 2:
            await ElMessageBox.alert('密码错误', '出错啦')
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
      // Server.shutdown()
      loading = false
    })
}

function isFull() {
  return loginForm.userAccount.length === 10 && loginForm.userPassword.length >= 6
}

watch(
  loginForm,
  () => {
    disable = !isFull()
  },
  {
    deep: true
  }
)

onMounted(() => {
  ElMessageBox.alert('账号1234567890, 密码123456, 或者你可以自己注册', '提示')
})
</script>

<template>
  <el-row style="height: 200px" />
  <el-row>
    <el-col :span="12" :offset="6">
      <el-form v-loading="loading" v-model="loginForm" label-width="auto" class="box">
        <el-input
          v-model="loginForm.userAccount"
          type="text"
          class="inputStyle"
          placeholder="账号" />
        <el-input
          v-model="loginForm.userPassword"
          type="password"
          class="inputStyle"
          placeholder="密码"
          show-password />
        <el-button
          type="primary"
          @click="onSubmit"
          name="submit"
          v-model:disabled="disable"
          style="margin-top: 5px">
          登陆
        </el-button>
        <router-link to="/signIn" style="padding-left: 10px">
          <el-button type="primary" style="margin-top: 5px">注册</el-button>
        </router-link>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.inputStyle {
  margin-top: 5px;
  width: 100%;
}
el-input {
  background-color: rgba(255, 255, 255, 0.247) !important;
}
</style>
