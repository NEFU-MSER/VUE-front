<script setup lang="ts">
import { Course } from '@/components/classes/Course'
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { getServerToken } from '@/components/utils/TokenUtils'

const props = defineProps({
  course: {
    type: Course,
    required: true
  },
  urlBase: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['updated'])

const changeCourse = ref(cloneDeep(props.course))
const tips = ref('')
const disable = ref(true)

async function submit() {
  const target: string =
    changeCourse.value.id == null
      ? 'http://localhost:8080/api/course/add'
      : 'http://localhost:8080/api/course/change'
  await axios
    .post(
      target,
      {
        token: getServerToken(),
        data: changeCourse.value
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
    changeCourse.value.name === props.course?.name &&
    changeCourse.value.credit === props.course?.credit &&
    changeCourse.value.time == props.course?.time &&
    changeCourse.value.id != null
  ) {
    tips.value = '请作出修改'
    return false
  }
  if (changeCourse.value.name.length <= 0) {
    tips.value = '课程名必填'
    return false
  }
  if (changeCourse.value.credit <= 0) {
    tips.value = '学分必须大于0'
    return false
  }
  if (changeCourse.value.time <= 0) {
    tips.value = '学时必须大于0'
    return false
  }
  tips.value = ''
  return true
}

watch(
  changeCourse.value,
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
    <el-form-item label="课程名" label-width="10%">
      <el-input v-model="changeCourse.name" />
    </el-form-item>
    <el-form-item label="学分" label-width="10%">
      <el-input v-model="changeCourse.credit" type="number" />
    </el-form-item>
    <el-form-item label="课时" label-width="10%">
      <el-input v-model="changeCourse.time" type="number" />
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
