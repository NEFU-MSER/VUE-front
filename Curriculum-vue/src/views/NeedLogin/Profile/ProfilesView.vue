<script setup lang="ts">
import ProfileShow from '@/views/NeedLogin/Profile/profileShow/profileShow.vue'
import { onMounted, ref } from 'vue'
import ProfileChange from '@/views/NeedLogin/Profile/profileChange/profileChage.vue'
import { urlRoot, localDB } from '@/main'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

const changeUrl = urlRoot + '/api/user/change'

const change = ref(false)
const profileData = localDB.profileData

onMounted(async () => {
  if (profileData.loaded.value == false) {
    await profileData.init()
  }
})

async function finish() {
  await profileData.init()
  change.value = false
}

async function logOut() {
  await ElMessageBox.confirm('确定登出吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      sessionStorage.clear()
      await router.push('/main')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      })
    })
}
</script>

<template>
  <div style="min-height: 200px" v-loading="!profileData.loaded.value">
    <el-row>
      <el-col :span="4">
        <p>个人信息</p>
      </el-col>
      <el-col :span="3" :offset="15">
        <el-button @click="change = true" type="primary">修改个人信息</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="logOut()" type="danger">登出</el-button>
      </el-col>
    </el-row>
    <profile-show
      :user="profileData.user"
      v-if="profileData.loaded.value && profileData.user != null" />
  </div>
  <el-dialog v-model="change" title="修改个人信息" width="70%">
    <profile-change
      :url="changeUrl"
      :user-temp="profileData.user"
      @updated="finish()"
      v-if="profileData.user != null" />
  </el-dialog>
</template>

<style scoped></style>
