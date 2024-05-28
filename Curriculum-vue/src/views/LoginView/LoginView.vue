<script setup lang="ts">
import { onMounted, reactive } from 'vue'
// import { server } from '@/components/Server'
import { ElMessageBox } from 'element-plus'
import { submit } from '@/views/LoginView/LoginUtils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const Server = server

let loginForm = reactive({
  account: '',
  password: ''
})

let disable = true

function isFull() {
  disable = !(loginForm.account.length === 10 && loginForm.password.length >= 6)
}

onMounted(() => {
  ElMessageBox.alert('账号1234567890, 密码123456, 或者你可以自己注册', '提示')
})
</script>

<template>
  <el-row style="height: 200px" />
  <el-row>
    <el-col :span="12" :offset="6">
      <el-form v-model="loginForm" label-width="auto" class="box" @change="isFull">
        <el-input v-model="loginForm.account" type="text" class="inputStyle" placeholder="账号" />
        <el-input
          v-model="loginForm.password"
          type="password"
          class="inputStyle"
          placeholder="密码"
          show-password />
        <el-button
          type="primary"
          @click="submit(loginForm.account, loginForm.password)"
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
