<script setup lang="ts">
import { localDB } from '@/main'
import { onBeforeMount, ref, watch } from 'vue'
import { Prescription } from '@/components/classes/Prescription'
import { Patient } from '@/components/classes/Patient'
import { ElMessage, ElMessageBox } from 'element-plus'
import VditorViewer from '@/components/Vditor/MarkdownViewer.vue'

const patientPreList = localDB.patientPrescriptionData
const patientList = localDB.patientData
const patientCardList = localDB.patientCardData

const patientLoaded = ref(false)
const prescriptionLoaded = ref(false)
const check = ref(false)

const selectPatient = ref(new Patient('', '未选择', '', '', '', 0))
const selectPrescription = ref(new Prescription('', '', '', '', 0, '', ''))

function initCheck(select: Prescription) {
  selectPrescription.value = select
  check.value = true
}

onBeforeMount(async () => {
  if (!patientCardList.loaded.value) {
    await patientCardList.init()
  }
  if (!patientList.loaded.value) {
    await patientList.init()
  }
  patientLoaded.value = true
})

watch(selectPatient, async () => {
  await patientPreList.history(selectPatient.value.id)
  prescriptionLoaded.value = true
})
</script>

<template>
  <el-row v-if="patientLoaded">
    <el-col :span="10">
      <p>
        {{
          selectPatient.id != '' ? '欢迎' + selectPatient.name + ', 待您的既往处方:' : '请选择患者'
        }}
      </p>
    </el-col>
    <el-col :span="10" :offset="4">
      <el-select v-model="selectPatient" value-key="id" placeholder="选择患者" filterable>
        <el-option
          v-for="item in patientList.patientList.value"
          :key="item.id"
          :label="item.name"
          :value="item" />
      </el-select>
    </el-col>
  </el-row>
  <el-table v-if="prescriptionLoaded" :data="patientPreList.historyList.value">
    <el-table-column label="患者名">
      <template #default="scope">{{ patientList.getPatient(scope.row.patientId)?.name }}</template>
    </el-table-column>
    <el-table-column label="性别">
      <template #default="scope">
        {{ patientList.getPatient(scope.row.patientId)?.getGender() }}
      </template>
    </el-table-column>
    <el-table-column label="事由" prop="title" />
    <el-table-column label="诊疗卡号" prop="cardId" width="250" />
    <el-table-column label="诊疗卡余额">
      <template #default="scope">
        {{ '￥' + patientCardList.getCard(scope.row.cardId)?.balance.toFixed(2) }}
      </template>
    </el-table-column>
    <el-table-column label="总费用">
      <template #default="scope">{{ '￥' + scope.row?.cost.toFixed(2) }}</template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="250">
      <template #default="scope">
        <el-button link type="primary" @click="initCheck(scope.row)">查看处方</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--  查看处方  -->
  <el-drawer direction="btt" size="95%" v-model="check">
    <template #title>
      <h3>查看处方</h3>
    </template>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-scrollbar>
          <vditor-viewer
            v-if="check"
            :md-str="
              selectPrescription.description.length == 0
                ? '## 还没有开具任何处方'
                : selectPrescription.description
            " />
        </el-scrollbar>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<style scoped></style>
