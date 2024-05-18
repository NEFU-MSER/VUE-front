<script setup lang="ts">
import axios from 'axios'
import { User, convertNumber } from '@/components/classes/User'
import { server } from '@/components/Server'
import { ElMessageBox } from 'element-plus'
import { onMounted, ref, watch } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Server = server

let loadDone = ref(false)
let disable = ref(true)
let changeUser = ref()
let user: User
let change = ref(false)
let passwordAgain = ref()

async function loadData() {
  await axios({
    method: 'get',
    url: 'https://my.api.com/profile'
  })
    .then((response) => {
      if (response.data.result != false) {
        user = response.data.data
        changeUser = ref(new User(user._userName, user._userAccount, '', user._email, user._gender))
        passwordAgain = ref('')
        loadDone.value = true
      }
    })
    .finally()
}

async function changeProfile() {
  await axios({
    method: 'POST',
    url: 'https://my.api.com/changeProfile',
    data: JSON.stringify(changeUser.value)
  }).then(async (response) => {
    if (response.data.result == true) {
      await ElMessageBox.alert('信息修改成功', '成功').catch((error) => {
        console.error(error)
      })
      await loadData()
    } else {
      switch (response.data.reason) {
        case 1:
          await ElMessageBox.alert('修改失败', '出错啦')
          break
        case 2:
          await ElMessageBox.alert('token失效', '出错啦')
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
}

function isFull() {
  const temp: User = changeUser.value
  return (
    temp._userName.length > 0 &&
    temp._userPassword.length >= 6 &&
    temp._userPassword === passwordAgain.value &&
    temp._email.length >= 5
  )
}

watch(
  changeUser,
  () => {
    // disable = ref(!isFull())
    disable.value = false
  },
  {
    deep: true
  }
)

onMounted(() => {
  loadData()
})
</script>

<template>
  <el-card style="max-width: 500px" v-if="!change && loadDone">
    <template #header>
      <div class="card-header">
        <span>用户名: {{ user._userName }}</span>
      </div>
    </template>
    <p class="text item">你的账号: {{ user._userAccount }}</p>
    <p class="text item">你的邮箱: {{ user._email }}</p>
    <p class="text item">你的性别: {{ convertNumber(user._gender) }}</p>
    <template #footer>
      <el-switch v-model="change" size="large" />
    </template>
  </el-card>

  <el-card style="max-width: 500px" v-if="change">
    <template #header>
      <div class="card-header">
        <span>你的账户: {{ user._userAccount }}</span>
      </div>
    </template>
    <el-form>
      <el-input v-model="changeUser._userName" type="text" class="inputStyle" placeholder="姓名">
        姓名
      </el-input>
      <el-input
        v-model="changeUser._userPassword"
        type="password"
        class="inputStyle"
        placeholder="密码">
        密码
      </el-input>
      <el-input
        v-model="passwordAgain"
        type="password"
        class="inputStyle"
        placeholder="再次输入密码">
        再次输入密码
      </el-input>
      <el-input v-model="changeUser._email" type="text" class="inputStyle" placeholder="邮箱">
        邮箱
      </el-input>
      <el-row>
        <el-radio-group v-model="changeUser._gender" label="性别">
          <el-radio value="0" size="large">男</el-radio>
          <el-radio value="1" size="large">女</el-radio>
        </el-radio-group>
      </el-row>
      <el-button
        type="primary"
        @click="changeProfile"
        name="submit"
        v-model:disabled="disable"
        style="margin-top: 5px">
        更改
      </el-button>
    </el-form>
    <template #footer>
      <el-switch v-model="change" size="large">更改</el-switch>
    </template>
  </el-card>
</template>

<style scoped></style>
