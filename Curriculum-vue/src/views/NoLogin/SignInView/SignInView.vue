<script setup lang="ts">
import { watch } from 'vue'
import { checkUser, disable, submit, isFull, tips } from '@/views/NoLogin/SignInView/SignInUtils'

const email: Array<String> = [
  '@nefu.edu.cn',
  '@163.com',
  '@126.com',
  '@qq.com',
  '@outlook.com',
  '@gmail.com'
]

watch(
  checkUser.value,
  () => {
    isFull()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <el-row style="height: 100px" />
  <el-row>
    <el-col :span="12" :offset="6" class="form">
      <el-form v-model="checkUser" label-width="15%" class="box" id="from">
        <el-form-item label="姓名">
          <el-input
            v-model="checkUser.name"
            type="text"
            class="inputStyle"
            placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="checkUser.account"
            type="text"
            class="inputStyle"
            placeholder="请输入11位手机号" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input
            v-model="checkUser.idCard"
            type="text"
            class="inputStyle"
            placeholder="请输入18位身份证号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="checkUser.password"
            type="password"
            class="inputStyle"
            placeholder="密码"
            show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="checkUser.passwordAgain"
            type="password"
            class="inputStyle"
            placeholder="再次输入密码"
            show-password />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="checkUser.emailHead" type="text" placeholder="邮箱" class="inputStyle">
            <template #append>
              <el-select
                v-model="checkUser.emailSelect"
                placeholder="@example.com"
                style="width: 200px">
                <el-option
                  v-for="(detail, index) of email"
                  :key="index"
                  :label="detail"
                  :value="detail"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-row>
            <el-radio-group v-model="checkUser.gender" label="性别">
              <el-radio value="male" size="large">男</el-radio>
              <el-radio value="female" size="large">女</el-radio>
            </el-radio-group>
          </el-row>
        </el-form-item>
        <el-form-item label-width="25%">
          <template #label>
            <span style="color: red">{{ tips }}</span>
          </template>
          <el-button
            type="primary"
            @click="submit"
            name="submit"
            v-model:disabled="disable"
            style="margin: 5px 0 0 auto">
            注册
          </el-button>
          <RouterLink to="/login">
            <el-button type="danger" style="margin-top: 5px; margin-left: 10px">返回</el-button>
          </RouterLink>
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
