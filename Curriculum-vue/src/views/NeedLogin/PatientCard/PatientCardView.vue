<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { localDB } from '@/main'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PatientCard } from '@/components/classes/PatientCard'
import type { Patient } from '@/components/classes/Patient'
import ChargeForm from '@/views/NeedLogin/PatientCard/RechargeForm/ChargeForm.vue'
import TradeLogTable from '@/views/NeedLogin/PatientCard/TradeLog/TradeLogTable.vue'

const profileData = localDB.profileData
const patientCardData = localDB.patientCardData
const patientData = localDB.patientData
const checkBoxVisible = ref(false)
const chargeBoxVisible = ref(false)
const choose = ref('')
const loaded = ref(false)
const seacrh = ref('')
const tableData = ref()

onBeforeMount(async () => {
  if (!profileData.loaded.value) {
    await profileData.init()
  }
  if (!patientCardData.loaded.value) {
    await patientCardData.init()
  }
  if (!patientData.loaded.value) {
    await patientData.init()
  }
  tableData.value = patientCardData.patientCardList.value
  loaded.value = true
})

function initCheck(id: string) {
  choose.value = id
  checkBoxVisible.value = true
}

function initRecharge(id: string) {
  choose.value = id
  chargeBoxVisible.value = true
}

function filter(cardList: Array<PatientCard>, patientList: Array<Patient>, text: string) {
  if (text == '') {
    return cardList
  } else {
    const idList: string[] = []
    for (const item of patientList) {
      if (item.name.includes(text)) {
        idList.push(item.id)
      }
    }
    const resultList = []
    for (const id of idList) {
      for (const item of cardList) {
        if (item.patientId == id) {
          resultList.push(item)
        }
      }
    }
    return resultList
  }
}

async function initDelete(id: string) {
  await ElMessageBox.confirm('确定要删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await patientCardData.delete(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}

watch(patientCardData.patientCardList, () => {
  tableData.value = filter(
    patientCardData.patientCardList.value,
    patientData.patientList.value,
    seacrh.value
  )
})

watch(seacrh, () => {
  tableData.value = filter(
    patientCardData.patientCardList.value,
    patientData.patientList.value,
    seacrh.value
  )
})
</script>

<template>
  <div style="min-height: 200px" v-loading="!patientCardData.loaded">
    <el-row v-if="loaded">
      <el-col :span="10">
        <p>欢迎{{ localDB.profileData.user.name }}, 您管理的诊疗卡:</p>
      </el-col>
      <el-col :span="10" :offset="4">
        <el-input size="default" v-model="seacrh" placeholder="搜索" />
      </el-col>
    </el-row>
    <el-table :data="tableData" v-if="patientCardData.loaded">
      <el-table-column prop="id" label="卡号" />
      <el-table-column label="患者姓名" width="200">
        <template #default="scope">
          <span>{{ patientData.getPatient(scope.row.patientId)?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额" width="150" />
      <el-table-column label="状态" width="200">
        <template #default="scope">
          <span>{{ scope.row.enable ? '正常' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="initCheck(scope.row.id)">
            查看流水
          </el-button>
          <el-button
            link
            type="warning"
            size="small"
            v-if="scope.row.enable"
            @click="patientCardData.disable(scope.row.id)">
            停用
          </el-button>
          <el-button
            link
            type="success"
            size="small"
            v-if="!scope.row.enable"
            @click="patientCardData.enable(scope.row.id)">
            启用
          </el-button>
          <el-button link type="primary" size="small" @click="initRecharge(scope.row.id)">
            余额操作
          </el-button>
          <el-button link type="danger" size="small" @click="initDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-drawer v-model="chargeBoxVisible" direction="ltr" size="50%" title="余额操作">
    <charge-form :card-id="choose" @updated="chargeBoxVisible = false" v-if="chargeBoxVisible" />
  </el-drawer>
  <el-drawer v-model="checkBoxVisible" direction="rtl" size="70%" title="流水查看">
    <trade-log-table :card-id="choose" @updated="checkBoxVisible = false" v-if="checkBoxVisible" />
  </el-drawer>
</template>

<style scoped></style>
