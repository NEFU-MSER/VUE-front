<script setup lang="ts">
import { localDB } from '@/main'
import { onBeforeMount, ref, watch } from 'vue'
import { Doctor } from '@/components/classes/Doctor'
import { Prescription } from '@/components/classes/Prescription'
import { ElMessage, ElMessageBox } from 'element-plus'
import VditorViewer from '@/components/Vditor/MarkdownViewer.vue'
import UpdatePrescription from '@/views/NeedLogin/Prescription/Update/UpdatePrescription.vue'

const prescriptionList = localDB.prescriptionData
const doctorList = localDB.doctorData
const patientList = localDB.patientData
const patientCardList = localDB.patientCardData

const doctorLoaded = ref(false)
const prescriptionLoaded = ref(false)
const check = ref(false)
const change = ref(false)

const selectDoctor = ref(new Doctor('', '', '未选择', '', '', '', 0))
const selectPrescription = ref(new Prescription('', '', '', '', 0, '', ''))

function initCheck(select: Prescription) {
  selectPrescription.value = select
  check.value = true
}

function initChange(select: Prescription) {
  selectPrescription.value = select
  change.value = true
}

async function initSubmit(select: Prescription) {
  await ElMessageBox.confirm('确定要删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await prescriptionList.toFinish(select)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}

onBeforeMount(async () => {
  if (!doctorList.loaded.value) {
    await doctorList.init()
  }
  if (!patientCardList.loaded.value) {
    await patientCardList.init()
  }
  if (!patientList.loaded.value) {
    await patientList.init()
  }
  doctorLoaded.value = true
})

watch(selectDoctor, async () => {
  await prescriptionList.init(selectDoctor.value.id)
  prescriptionLoaded.value = true
})
</script>

<template>
  <el-row v-if="doctorLoaded">
    <el-col :span="10">
      <p>
        {{
          selectDoctor.id != '' ? '欢迎' + selectDoctor.name + ', 待您处理的处方:' : '请选择医生'
        }}
      </p>
    </el-col>
    <el-col :span="10" :offset="4">
      <el-select v-model="selectDoctor" value-key="id" placeholder="选择医生" filterable>
        <el-option
          v-for="item in doctorList.doctorList.value"
          :key="item.id"
          :label="item.name"
          :value="item" />
      </el-select>
    </el-col>
  </el-row>
  <el-table v-if="prescriptionLoaded" :data="prescriptionList.prescriptionList.value">
    <el-table-column label="患者名">
      <template #default="scope">{{ patientList.getPatient(scope.row.patientId)?.name }}</template>
    </el-table-column>
    <el-table-column label="性别">
      <template #default="scope">
        {{ patientList.getPatient(scope.row.patientId)?.getGender() }}
      </template>
    </el-table-column>
    <el-table-column label="事由" prop="title" />
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
        <el-button link type="primary" @click="initChange(scope.row)">修改处方</el-button>
        <el-button link type="success" @click="initSubmit(scope.row)">转至缴费</el-button>
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
  <!--  修改处方  -->
  <el-drawer direction="btt" size="95%" v-model="change">
    <template #title>
      <h3>修改处方</h3>
    </template>
    <el-row>
      <el-col :span="20" :offset="2">
        <update-prescription
          v-if="change"
          :prescription="selectPrescription"
          @updated="change = false" />
      </el-col>
    </el-row>
  </el-drawer>
</template>

<style scoped></style>
