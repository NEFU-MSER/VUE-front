<script setup lang="ts">
import { Patient } from '@/components/classes/Patient'
import { PatientCard } from '@/components/classes/PatientCard'
import { Doctor } from '@/components/classes/Doctor'
import { Role } from '@/components/classes/Role'
import {
  CreditCard,
  Female,
  Male,
  MessageBox,
  Money,
  Phone,
  Rank,
  User
} from '@element-plus/icons-vue'
import { Department } from '@/components/classes/Department'

const props = defineProps({
  patient: { type: Patient, default: new Patient('', '', '', '', '', 0) },
  patientCard: { type: PatientCard, default: new PatientCard('', '', 0, true, '') },
  doctor: { type: Doctor, default: new Doctor('', '', '', '', '', '', 0) },
  role: { type: Role, default: new Role('', '', '', 0) },
  department: { type: Department, default: new Department('', '', '') }
})
</script>

<template>
  <el-descriptions :column="3" size="large" border>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Doctor />
          </el-icon>
          医生
        </div>
      </template>
      <p>{{ props.doctor?.name }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Phone />
          </el-icon>
          医生电话
        </div>
      </template>
      <p>{{ props.doctor?.phone }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <MessageBox />
          </el-icon>
          医生邮箱
        </div>
      </template>
      <p>{{ props.doctor?.email }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Role />
          </el-icon>
          职称
        </div>
      </template>
      <p>{{ props.role?.name }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Money />
          </el-icon>
          挂号费
        </div>
      </template>
      <p>{{ props.role?.expenses }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Rank />
          </el-icon>
          科室
        </div>
      </template>
      <p>{{ props.department?.name }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <User />
          </el-icon>
          患者名
        </div>
      </template>
      <p>{{ props.patient?.name }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Male v-if="props.patient?.gender == 0" />
            <Female v-if="props.patient?.gender == 1" />
          </el-icon>
          性别
        </div>
      </template>
      <p>{{ props.patient.getGender() }}</p>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <CreditCard />
          </el-icon>
          余额
        </div>
      </template>
      <p>{{ props.patientCard?.balance }}</p>
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped></style>
