<script setup lang="ts">
import { Lib } from '@/components/classes/Lib'
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { getServerToken } from '@/components/utils/TokenUtils'

const props = defineProps({
  lib: {
    type: Lib,
    required: true
  },
  urlBase: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['updated'])

const changeLib = ref(cloneDeep(props.lib))
const tips = ref('')
const disable = ref(true)

async function submit() {
  const target: string =
    changeLib.value.id == null
      ? 'http://localhost:8080/api/lib/add'
      : 'http://localhost:8080/api/lib/change'
  await axios
    .post(
      target,
      {
        token: getServerToken(),
        data: changeLib.value
      },
      {
        headers: {
          contentType: 'application/json'
        }
      }
    )
    .then(async (response) => {
      if (response.data.code === 200) {
        emits('updated')
        await ElMessageBox.alert('修改成功', '提示')
      } else {
        await ElMessageBox.alert(response.data.message, response.data.code.toString()).catch()
      }
    })
    .catch()
}

function isFull(): boolean {
  if (
    changeLib.value.name === props.lib?.name &&
    changeLib.value.type === props.lib?.type &&
    changeLib.value.id != null
  ) {
    tips.value = '请作出修改'
    return false
  }
  if (changeLib.value.name.length <= 0) {
    tips.value = '教室编号必填'
    return false
  }
  if (changeLib.value.type.length <= 0) {
    tips.value = '教室类型必填'
    return false
  }
  tips.value = ''
  return true
}

watch(
  changeLib.value,
  () => {
    disable.value = !isFull()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <el-form>
    <el-form-item label="教室编号" label-width="10%">
      <el-input v-model="changeLib.name" />
    </el-form-item>
    <el-form-item label="教室类型" label-width="10%">
      <el-input v-model="changeLib.type" />
    </el-form-item>
    <el-form-item>
      <p style="color: red">{{ tips }}</p>
      <el-button type="primary" style="margin-left: auto" @click="submit" :disabled="disable">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
