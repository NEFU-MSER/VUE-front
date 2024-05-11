<script setup lang="ts">
import axios from 'axios'
import type { User } from '@/components/classes/User'

let user: User
await axios({
  method: 'get',
  url: 'https://my.api.com/profile'
})
  .then((response) => {
    if (response.data.result != false) {
      user = response.data.data
    }
  })
  .finally()
</script>

<template>
  <el-card style="max-width: 800px">
    <template #header>
      <div class="card-header">
        <span>{{ user.userName }}</span>
      </div>
    </template>
    <p class="text item">{{ user.userAccount }}</p>
    <p class="text item">{{ user.email }}</p>
    <template #footer>没想好怎么写这玩意</template>
  </el-card>
</template>

<style scoped></style>
