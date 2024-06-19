<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { localDB } from '@/main'
import { Role } from '@/components/classes/Role'
import { ElMessage, ElMessageBox } from 'element-plus'
import ChangeRole from '@/views/NeedLogin/Role/ChangeForm/ChangeRole.vue'

const roleData = localDB.roleData
const departmentData = localDB.departmentData
const profileData = localDB.profileData
const changeBoxVisible = ref(false)
const choose = ref(new Role('', '', '', 0))
const addMethod = ref(true)

onBeforeMount(async () => {
  if (!roleData.loaded.value) {
    await roleData.init()
  }
  if (!profileData.loaded.value) {
    await profileData.init()
  }
  if (!departmentData.loaded.value) {
    await departmentData.init()
  }
})

function initAdd(add: boolean, role: Role = new Role('', '', '', 0)) {
  addMethod.value = add
  choose.value = role
  changeBoxVisible.value = true
}

async function initDelete(id: string) {
  await ElMessageBox.confirm('确定要删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await roleData.delete(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}
</script>

<template>
  <div style="min-height: 200px" v-loading="!roleData.loaded">
    <el-row>
      <p>欢迎{{ localDB.profileData.user.name }}, 您管理的职务:</p>
      <el-button type="primary" @click="initAdd(true)" style="margin-left: auto">
        添加职务
      </el-button>
    </el-row>
    <el-table
      :data="roleData.roleList.value"
      v-if="roleData.loaded && departmentData.loaded && profileData.loaded">
      <el-table-column prop="id" label="职务编号" width="200" />
      <el-table-column prop="name" label="职务名" />
      <el-table-column prop="expenses" label="挂号费用" />
      <el-table-column label="所属科室">
        <template #default="scope">
          <span>{{ departmentData.findById(scope.row.departmentId)?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="initAdd(false, scope.row)">
            修改
          </el-button>
          <el-button link type="danger" size="small" @click="initDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-drawer v-model="changeBoxVisible" direction="btt" size="90%">
    <change-role
      :role="choose"
      :parents="departmentData.departments.value"
      :add-method="addMethod"
      @updated="changeBoxVisible = false"
      v-if="changeBoxVisible" />
  </el-drawer>
</template>

<style scoped></style>
