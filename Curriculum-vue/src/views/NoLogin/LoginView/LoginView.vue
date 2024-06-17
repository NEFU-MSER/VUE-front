<script setup lang="ts">
import { watch } from 'vue'
import { submit, loginForm, isFull, disable, tips } from '@/views/NoLogin/LoginView/LoginUtils'

watch(
  loginForm.value,
  () => {
    isFull()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <el-row style="height: 200px" />
  <el-row>
    <el-col :span="12" :offset="6" class="form">
      <el-form v-model="loginForm" label-width="15%" class="box">
        <el-form-item label="账号">
          <el-input v-model="loginForm.account" type="text" class="inputStyle" placeholder="账号" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="loginForm.password"
            type="password"
            class="inputStyle"
            placeholder="密码"
            show-password />
        </el-form-item>
        <el-form-item label-width="25%">
          <template #label>
            <span style="color: red">{{ tips }}</span>
          </template>
          <el-button
            type="primary"
            @click="submit(loginForm.account, loginForm.password)"
            name="submit"
            :disabled="disable"
            style="margin: 5px 0 0 auto">
            登陆
          </el-button>
          <router-link to="/signIn" style="padding-left: 10px">
            <el-button type="primary" style="margin-top: 5px">注册</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.inputStyle {
  margin-top: 5px;
  width: 100%;
}

.form {
  background: rgba(240, 248, 255, 0.7);
  padding: 20px;
  border-radius: 5px;
  border: 1px solid rgba(240, 248, 255);
}

el-input {
  background-color: rgba(255, 255, 255, 0.247) !important;
}
</style>
