<script setup lang="ts">
import { User } from '@/components/classes/User'
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  userTemp: { type: User, required: true },
  url: { type: String, required: true }
})
const emits = defineEmits(['updated'])

const user = ref(cloneDeep(props.userTemp))
const passwordAgain = ref('')
const tips = ref('')
const disable = ref(true)

async function submit() {
  await axios
    .post(
      props.url,
      {
        token: getServerToken(),
        data: user.value
      }
    )
    .then(async (res) => {
      if (res.data.code != 200) {
        await ElMessageBox.alert(res.data.message, res.data.code.toString()).catch()
        location.reload()
      }else {
        emits('updated')
        await ElMessageBox.alert('修改成功', '提示').catch()
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

function isFull(): boolean {
  if (user.value.account != props.userTemp?.account) {
    tips.value = '账号不可修改'
    return false
  }
  if (user.value.name.length <= 0) {
    tips.value = '姓名不可为空'
    return false
  }
  if (user.value.email.length <= 0) {
    tips.value = '邮箱不可为空'
  }
  if (user.value.password.length < 6) {
    tips.value = '密码要大于等于六位'
    return false
  }
  if (user.value.password != passwordAgain.value) {
    tips.value = '两次密码不相等'
    return false
  }
  tips.value = ''
  return true
}

watch(user, () => {
  disable.value = !isFull()
})

watch(passwordAgain, () => {
  disable.value = !isFull()
})
</script>

<template>
  <el-form>
    <el-form-item label="姓名" label-width="10%">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item label="邮箱" label-width="10%">
      <el-input v-model="user.email" />
    </el-form-item>
    <el-form-item label="密码" label-width="10%">
      <el-input v-model="user.password" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" label-width="10%">
      <el-input v-model="passwordAgain" type="password" />
    </el-form-item>
    <el-form-item>
      <p style="color: red">{{ tips }}</p>
      <el-button type="primary" @click="submit" style="margin-left: auto" :disabled="disable">
        提交修改
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
