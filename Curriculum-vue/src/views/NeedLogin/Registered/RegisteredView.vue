<script setup lang="ts">
import { localDB } from '@/main'
import { onBeforeMount, ref, watch } from 'vue'
import { Department } from '@/components/classes/Department'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Prescription } from '@/components/classes/Prescription'

const departmentData = localDB.departmentData
const registeredData = localDB.registeredData
const patientData = localDB.patientData
const patientCardData = localDB.patientCardData
const prescriptionData = localDB.patientPrescriptionData

const title = ref('请选择挂号科室')
const patientId = ref('')
const cardId = ref('')
const doctorId = ref('')
const doctorLoaded = ref(false)
const doctorAndRole = ref()

onBeforeMount(async () => {
  if (!patientData.loaded.value) {
    await patientData.init()
  }
  if (!patientCardData.loaded.value) {
    await patientCardData.init()
  }
  if (!departmentData.loaded.value) {
    await departmentData.init()
  }
})

async function select(selected: Department) {
  doctorLoaded.value = false
  await registeredData.init(selected.id)
  title.value = selected.name
  doctorLoaded.value = true
}

async function initSubmit() {
  if (patientId.value.length != 19) {
    return ElMessageBox.alert('患者选择出错', '警告').catch()
  } else if (cardId.value.length != 19) {
    return ElMessageBox.alert('诊疗卡选择出错', '警告').catch()
  } else if (doctorId.value.length != 19) {
    return ElMessageBox.alert('医生选择出错', '警告').catch()
  }
  await ElMessageBox.confirm('确定要提交挂号申请吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await prescriptionData.add(
        new Prescription(
          '',
          doctorId.value,
          patientId.value,
          cardId.value,
          doctorAndRole.value.role.expenses,
          '挂号',
          ''
        )
      )
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}

watch(patientId, () => {
  cardId.value = ''
})

watch(doctorAndRole, () => {
  doctorId.value = doctorAndRole.value.doctor.id
})
</script>

<template>
  <div style="min-height: 200px" v-loading="!departmentData.loaded.value">
    <el-row>
      <el-col :span="4">
        <el-tree
          v-if="departmentData.loaded.value"
          style="width: 100%"
          :data="departmentData.departmentsTree.value"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <template #default="{ data }">
            <span class="custom-tree-node" @click="select(data)">
              <span>{{ data.name }}</span>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="19" :offset="1">
        <h2>{{ title }}</h2>
        <el-form label-width="10%">
          <el-form-item label="患者姓名" v-if="patientData.loaded.value">
            <el-select v-model="patientId" placeholder="请选择患者">
              <el-option
                v-for="item in patientData.patientList.value"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="诊疗卡选择" v-if="patientId != '' && patientCardData.loaded.value">
            <el-select v-model="cardId" placeholder="请选择诊疗卡">
              <el-option
                v-for="item in patientCardData.getCards(patientId)"
                :key="item.id"
                :value="item.id"
                :label="'余额:' + item.balance" />
            </el-select>
          </el-form-item>
          <el-form-item label="医生选择" v-if="registeredData.loaded.value">
            <el-select v-model="doctorAndRole" placeholder="请选择医生">
              <el-option
                v-for="item in registeredData.doctorAndRoleList.value"
                :key="item.doctor.id"
                :value="item"
                :label="
                  item.role.name +
                  ' - ' +
                  item.doctor.name +
                  '&nbsp;&nbsp;挂号费:' +
                  item.role.expenses
                " />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: auto" type="primary" @click="initSubmit()">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
