<script setup lang="ts">
import { onMounted, watch } from 'vue'
// import { server } from '@/components/Server'
import { ElMessageBox } from 'element-plus'
import { checkUser, disable, submit, isFull } from '@/views/SignInView/SignInUtils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const Server = server

const email: Array<String> = [
  '@nefu.edu.cn',
  '@163.com',
  '@126.com',
  '@qq.com',
  '@outlook.com',
  '@gmail.com'
]

watch(checkUser.value, () => {
  isFull()
})

onMounted(() => {
  ElMessageBox.alert('账号10位数字, 密码大于6位, 姓名,邮箱必填; 数据不上传服务器放心写', '提示')
})
</script>

<template>
  <el-row style="height: 200px" />
  <el-row>
    <el-col :span="12" :offset="6">
      <el-form v-model="checkUser" label-width="auto" class="box" id="from">
        <el-input v-model="checkUser.name" type="text" class="inputStyle" placeholder="姓名" />
        <el-input v-model="checkUser.account" type="text" class="inputStyle" placeholder="账号" />
        <el-input
          v-model="checkUser.password"
          type="password"
          class="inputStyle"
          placeholder="密码"
          show-password />
        <el-input
          v-model="checkUser.passwordAgain"
          type="password"
          class="inputStyle"
          placeholder="再次输入密码"
          show-password />
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
        <el-row>
          <el-radio-group v-model="checkUser.gender" label="性别">
            <el-radio value="male" size="large">男</el-radio>
            <el-radio value="female" size="large">女</el-radio>
          </el-radio-group>
        </el-row>
        <el-button
          type="primary"
          @click="submit"
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
