<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { localDB } from '@/main'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Patient } from '@/components/classes/Patient'
import ChangePatient from '@/views/NeedLogin/Patient/ChangeForm/ChangePatient.vue'

const profileData = localDB.profileData
const patientData = localDB.patientData
const changeBoxVisible = ref(false)
const choose = ref(new Patient('', '', '', '', '', 0))
const addMethod = ref(true)
const loaded = ref(false)

onBeforeMount(async () => {
  if (!profileData.loaded.value) {
    await profileData.init()
  }
  if (!patientData.loaded.value) {
    await patientData.init()
  }
  loaded.value = true
})

function initAdd(add: boolean, patient: Patient = new Patient('', '', '', '', '', 0)) {
  addMethod.value = add
  choose.value = patient
  changeBoxVisible.value = true
}

async function initAddCard(patientId: string) {
  await ElMessageBox.confirm('确定要为该患者添加一张诊疗卡吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await localDB.patientCardData.add(patientId)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '添加取消'
      })
    })
}

async function initDelete(id: string) {
  await ElMessageBox.confirm('确定要删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await patientData.delete(id)
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
  <div style="min-height: 200px" v-loading="!patientData.loaded">
    <el-row v-if="loaded">
      <p>欢迎{{ localDB.profileData.user.name }}, 您管理的患者:</p>
      <el-button type="primary" @click="initAdd(true)" style="margin-left: auto">
        添加患者
      </el-button>
    </el-row>
    <el-table :data="patientData.patientList.value" v-if="patientData.loaded">
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column label="性别" width="100">
        <template #default="scope">
          <span>{{ scope.row.getGender() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column fixed="right" label="操作" width="250">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="initAddCard(scope.row.id)">
            添加诊疗卡
          </el-button>
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
    <change-patient
      :patient="choose"
      :add-method="addMethod"
      v-if="changeBoxVisible"
      @updated="changeBoxVisible = false" />
  </el-drawer>
</template>

<style scoped></style>
