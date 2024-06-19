<script setup lang="ts">
import { User, convertNumber } from '@/components/classes/User'
import { Box, CreditCard, Female, Male, Postcard, User as UserIcon } from '@element-plus/icons-vue'

let props = defineProps({
  user: { type: User, required: true }
})
</script>

<template>
  <el-descriptions
    class="margin-top"
    :column="3"
    size="large"
    border
    v-if="typeof props.user != 'undefined'">
    <!--  名字  -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon><UserIcon /></el-icon>
          用户名
        </div>
      </template>
      <p>{{ props?.user.name }}</p>
    </el-descriptions-item>
    <!--  性别  -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <template v-if="props?.user.gender == 0">
              <Male />
            </template>
            <template v-else>
              <Female />
            </template>
          </el-icon>
          性别
        </div>
      </template>
      <p>{{ convertNumber(props?.user.gender) }}</p>
    </el-descriptions-item>
    <!--  账号  -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon><Postcard /></el-icon>
          账号(电话号码)
        </div>
      </template>
      <p>{{ props?.user.account }}</p>
    </el-descriptions-item>
    <!--  邮箱  -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon><Box /></el-icon>
          邮箱
        </div>
      </template>
      <p>{{ props?.user.email }}</p>
    </el-descriptions-item>
    <!--  身份证  -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon><CreditCard /></el-icon>
          身份证
        </div>
      </template>
      <p>{{ props?.user.idCard }}</p>
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped></style>
