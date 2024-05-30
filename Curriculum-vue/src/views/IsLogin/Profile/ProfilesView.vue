<script setup lang="ts">
import { profileData } from '@/views/IsLogin/Profile/profileData'
import ProfileShow from '@/components/views/profileShow/profileShow.vue'
import { onMounted, ref } from 'vue'
import ProfileChange from '@/components/views/profileChange/profileChage.vue'

const changeUrl = 'http://localhost:8080/api/user/change'

const loaded = ref(false)
const change = ref(false)

onMounted(async () => {
  await profileData.init()
  loaded.value = true
})

async function finish(){
  await profileData.init()
  change.value = false
}
</script>

<template>
  <el-row>
    <el-col :span="4">
      <p>个人信息</p>
    </el-col>
    <el-col :span="4" :offset="16">
      <el-button @click="change = true" type="primary">修改个人信息</el-button>
    </el-col>
  </el-row>
  <profile-show :user="profileData.user" v-if="loaded && profileData.user != null" />
  <el-dialog v-model="change" title="修改个人信息" width="70%">
    <profile-change
      :url="changeUrl"
      :user-temp="profileData.user"
      @updated="finish()"
      v-if="profileData.user != null" />
  </el-dialog>
</template>

<style scoped></style>
