<script setup lang="ts">
import { Patient } from '@/components/classes/Patient'
import { ref, watch } from 'vue'
import { localDB } from '@/main'
import { cloneDeep } from 'lodash'
import 'vditor/dist/index.css'

const emits = defineEmits(['updated'])
const props = defineProps({
  patient: { type: Patient, required: true },
  addMethod: { type: Boolean, default: false }
})
const change = ref(cloneDeep(props.patient))
const disable = ref(true)
const tips = ref('')
const select = ref('@nefu.edu.cn')
const genders = [
  {
    label: '男',
    value: 0
  },
  {
    label: '女',
    value: 1
  }
]
const email: Array<String> = [
  '@nefu.edu.cn',
  '@163.com',
  '@126.com',
  '@qq.com',
  '@outlook.com',
  '@gmail.com'
]

function isFull() {
  if (change.value.name.length <= 0) {
    disable.value = true
    tips.value = '姓名不可为空'
  } else if (typeof change.value.gender != 'number') {
    disable.value = true
    tips.value = '性别错误'
  } else if (change.value.idCard.length != 18) {
    disable.value = true
    tips.value = '身份证错误'
  } else if (change.value.phone.length != 11) {
    disable.value = true
    tips.value = '电话号码错误'
  } else if (change.value.email.length < 5) {
    disable.value = true
    tips.value = '邮箱号过短'
  } else {
    disable.value = false
    tips.value = ''
  }
}

watch(change.value, () => {
  isFull()
})
</script>

<template>
  <h3>{{ addMethod ? '添加职务' : '修改' + props.patient.name }}</h3>
  <el-form label-width="10%">
    <el-form-item label="姓名">
      <el-input v-model="change.name" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="change.gender" placeholder="请选择性别">
        <el-option
          v-for="item in genders"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="身份证">
      <el-input type="number" v-model="change.idCard" placeholder="请输入18位身份证号" />
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input type="number" v-model="change.phone" placeholder="请输入11位电话号码" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="change.email" type="text" placeholder="邮箱" class="inputStyle">
        <template #append>
          <el-select v-model="select" placeholder="@example.com" style="width: 200px">
            <el-option
              v-for="(detail, index) of email"
              :key="index"
              :label="detail"
              :value="detail" />
          </el-select>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <p style="color: red">{{ tips }}</p>
      <el-button
        type="primary"
        @click="
          () => {
            change.email += select
            addMethod ? localDB.patientData.add(change) : localDB.patientData.update(change)
            emits('updated')
          }
        "
        style="margin-left: auto"
        :disabled="disable">
        {{ addMethod ? '提交添加' : '提交修改' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
