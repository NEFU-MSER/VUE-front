<script setup lang="ts">
import { Role } from '@/components/classes/Role'
import { ref, watch } from 'vue'
import { localDB } from '@/main'
import { cloneDeep } from 'lodash'
import 'vditor/dist/index.css'
import { Department } from '@/components/classes/Department'

const emits = defineEmits(['updated'])
const props = defineProps({
  role: { type: Role, required: true },
  parents: { type: Array<Department>, required: true },
  addMethod: { type: Boolean, default: false }
})
const change = ref(cloneDeep(props.role))
const disable = ref(true)
let parents = cloneDeep(props.parents)
const tips = ref('')

function isFull() {
  if (change.value.name.length <= 0) {
    disable.value = true
    tips.value = '职务名不可为空'
  } else if (change.value.departmentId.length != 19) {
    disable.value = true
    tips.value = '隶属科室出错'
  } else if (change.value.expenses < 0) {
    disable.value = true
    tips.value = '挂号费不可为负数'
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
  <h3>{{ addMethod ? '添加职务' : '修改' + props.role.name }}</h3>
  <el-form label-width="10%">
    <el-form-item label="职务名">
      <el-input v-model="change.name" />
    </el-form-item>
    <el-form-item label="隶属科室">
      <el-select v-model="change.departmentId" placeholder="请选择隶属科室">
        <el-option v-for="item in parents" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="挂号费">
      <el-input type="number" v-model="change.expenses" />
    </el-form-item>
    <el-form-item>
      <p style="color: red">{{ tips }}</p>
      <el-button
        type="primary"
        @click="
          () => {
            addMethod ? localDB.roleData.add(change) : localDB.roleData.update(change)
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
