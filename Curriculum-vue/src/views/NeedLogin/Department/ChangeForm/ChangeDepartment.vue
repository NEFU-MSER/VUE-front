<script setup lang="ts">
import { Department, equal, toList } from '@/components/classes/Department'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { localDB } from '@/main'
import { cloneDeep } from 'lodash'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const emits = defineEmits(['updated'])
const props = defineProps({
  department: { type: Department, required: true },
  parents: { type: Array<Department>, required: true },
  addMethod: { type: Boolean, default: false }
})
const change = ref(cloneDeep(props.department))
const disable = ref(true)
let parents = cloneDeep(props.parents)
const tips = ref('')
const loaded = ref(false)
let vditor: Vditor

function filter() {
  const incorrect = toList(change.value.children)
  const temp = new Array<Department>()
  for (const item of parents) {
    let flag = false
    for (const i of incorrect) {
      if (item.id === i.id || item.id === change.value.id) {
        flag = true
        break
      }
    }
    if (!flag) {
      temp.push(item)
    }
  }
  parents = temp
}

function isFull() {
  if (change.value.name.length <= 0) {
    disable.value = true
    tips.value = '科室名不可为空'
  } else if (change.value.parentId.length != 19) {
    disable.value = true
    tips.value = '上级科室出错'
  } else if (change.value.parentId === change.value.id) {
    disable.value = true
    tips.value = '不可选择自身作为上级'
  } else if (equal(change.value.children, change.value.parentId)) {
    disable.value = true
    tips.value = '不可选择子级作为上级'
  } else {
    disable.value = false
    tips.value = ''
  }
}

onMounted(() => {
  vditor = new Vditor('vditor', {
    height: '500px',
    value: change.value.description,
    cache: {
      enable: false
    }
  })
})

onBeforeMount(() => {
  filter()
  loaded.value = true
})

watch(change.value, () => {
  isFull()
})
</script>

<template>
  <h3>{{ addMethod ? '添加科室' : '修改' + props.department.name }}</h3>
  <el-form label-width="10%" v-if="loaded">
    <el-form-item label="科室名">
      <el-input v-model="change.name" />
    </el-form-item>
    <el-form-item label="上级科室">
      <el-select v-model="change.parentId" placeholder="请选择上级科室">
        <el-option label="无上级科室" value="0000000000000000000" />
        <el-option v-for="item in parents" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-scrollbar>
      <div id="vditor" />
    </el-scrollbar>
    <el-form-item>
      <p style="color: red">{{ tips }}</p>
      <el-button
        type="primary"
        @click="
          () => {
            addMethod
              ? localDB.departmentData.add(change.parentId, change.name, vditor.getValue())
              : localDB.departmentData.update(
                  change.id,
                  change.parentId,
                  change.name,
                  vditor.getValue()
                )
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
