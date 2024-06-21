<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { localDB } from '@/main'
import { ElMessage, ElMessageBox } from 'element-plus'
import ChangeDoctor from '@/views/NeedLogin/Doctor/ChangeForm/ChangeDoctor.vue'
import { Doctor } from '@/components/classes/Doctor'

const roleData = localDB.roleData
const profileData = localDB.profileData
const doctorData = localDB.doctorData
const changeBoxVisible = ref(false)
const choose = ref(new Doctor('', '', '', '', '', '', 0))
const addMethod = ref(true)
const loaded = ref(false)

onBeforeMount(async () => {
  if (!roleData.loaded.value) {
    await roleData.init()
  }
  if (!profileData.loaded.value) {
    await profileData.init()
  }
  if (!doctorData.loaded.value) {
    await doctorData.init()
  }
  loaded.value = true
})

function initAdd(add: boolean, doctor: Doctor = new Doctor('', '', '', '', '', '', 0)) {
  addMethod.value = add
  choose.value = doctor
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
    <el-row v-if="profileData.loaded && loaded">
      <p>欢迎{{ localDB.profileData.user.name }}, 您管理的医生:</p>
      <el-button type="primary" @click="initAdd(true)" style="margin-left: auto">
        添加医生
      </el-button>
    </el-row>
    <el-table :data="doctorData.doctorList.value" v-if="roleData.loaded && doctorData.loaded">
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column label="性别" width="100">
        <template #default="scope">
          <span>{{ scope.row.getGender() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称" width="150">
        <template #default="scope">
          <span>{{ roleData.getById(scope.row.roleId)?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="挂号费用" width="100">
        <template #default="scope">
          <span>{{ roleData.getById(scope.row.roleId)?.expenses }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="email" label="邮箱" />
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
    <change-doctor
      :roles="roleData.roleList.value"
      :doctor="choose"
      :add-method="addMethod"
      v-if="changeBoxVisible"
      @updated="changeBoxVisible = false" />
  </el-drawer>
</template>

<style scoped></style>
