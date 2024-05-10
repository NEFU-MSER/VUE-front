<script setup lang="ts">
import { reactive, watch } from 'vue'
import axios from 'axios'
import { loginServer } from '@/views/LoginView/loginServer'
import router from '@/router'

const Server = loginServer

const loginForm = reactive({
  userAccount: '',
  userPassword: ''
})

let disable = true
let loading = false
axios.defaults.timeout = 5000

function onSubmit() {
  loading = true
  console.log(loginForm)
  axios
    .post('https://my.api.com' + '/login', loginForm)
    .then((response) => {
      if (response.data === true) {
        console.log(sessionStorage)
        router.push('/main')
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      // Server.shutdown()
      loading = false
    })
}

function isFull() {
  return loginForm.userAccount.length === 10 && loginForm.userPassword.length >= 6
}

watch(loginForm, () => {
  disable = !isFull()
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
