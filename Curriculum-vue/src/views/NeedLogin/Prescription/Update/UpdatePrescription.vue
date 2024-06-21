<script setup lang="ts">
import { cloneDeep } from 'lodash'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { Prescription } from '@/components/classes/Prescription'
import { onMounted, type Ref, ref, watch } from 'vue'
import { healTools } from '@/views/NeedLogin/Department/ChangeForm/HealToolData'
import { Money } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { localDB } from '@/main'
import { translate } from '@/components/utils/DescriptionUtils'

const emits = defineEmits(['updated'])
const props = defineProps({
  prescription: { type: Prescription, required: true }
})

const prescriptionData = localDB.prescriptionData

const change = cloneDeep(props.prescription)
const tools: Ref<number[]> = ref([])
const cost = ref(0)
let editor: Vditor

async function initSubmit(newData: Prescription) {
  await ElMessageBox.confirm('确定要上传吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await prescriptionData.update(newData)
      emits('updated')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}

onMounted(() => {
  editor = new Vditor('editor', {
    height: '500px',
    value: change.description,
    cache: {
      enable: false
    }
  })
})

watch(tools, () => {
  let result = 0
  for (const item of tools.value) {
    result += healTools[item].cost
  }
  cost.value = result
})
</script>

<template>
  <el-transfer
    v-model="tools"
    filterable
    filter-placeholder="输入查询"
    :data="healTools"
    style="width: 50%" />
  <el-descriptions :column="2" size="large" border>
    <el-descriptions-item title="药品费用">
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Money />
          </el-icon>
          药品费用
        </div>
      </template>
      {{ cost }}
    </el-descriptions-item>
  </el-descriptions>
  <div id="editor" />
  <el-button
    type="primary"
    style="margin-right: 5px"
    @click="
      initSubmit(
        new Prescription(
          change.id,
          change.doctorId,
          change.patientId,
          change.cardId,
          change.cost + cost,
          change.title,
          change.description + editor.getValue() + '  \n' + translate(tools)
        )
      )
    ">
    提交修改
  </el-button>
</template>

<style scoped></style>
