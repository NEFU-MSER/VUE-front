<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ref } from 'vue'
import { Course2Occupation } from '@/components/classes/Course2Occupation'
import ChangeOccupation from '@/components/views/changeOccupation/ChangeOccupation.vue'

const props = defineProps({
  course2Occupation: {
    type: Course2Occupation,
    required: true
  },
  urlBase: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['updated'])

const add = ref(false)
const changeId = ref('')

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭吗，未保存的修改将会丢失?', {
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
    .then(() => {
      done()
    })
    .catch(() => {})
}

function initChange(id: string) {
  changeId.value = id
  add.value = true
}

async function deleteOccupation(id: string, url: string) {
  await ElMessageBox.confirm('确定要删除吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await axios
        .post(
          url,
          {
            token: getServerToken(),
            data: id
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(async (response) => {
          if (response.data.code === 200) {
            emits('updated')
            await ElMessageBox.alert('删除成功', '提示').catch()
          } else {
            await ElMessageBox.alert('删除失败', '错误').catch()
          }
        })
        .catch((e) => {
          console.error(e)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}
</script>

<template>
  <el-table :data="props.course2Occupation?.occupations">
    <el-table-column prop="libName" label="授课地点" sortable />
    <el-table-column prop="week[0]" label="开始周次" sortable />
    <el-table-column prop="week[1]" label="结束周次" sortable />
    <el-table-column prop="day" label="星期" sortable />
    <el-table-column prop="time[0]" label="开始节次" sortable />
    <el-table-column prop="time[1]" label="结束节次" sortable />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="initChange(scope.row.id)">
          修改
        </el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="deleteOccupation(scope.row.id, props.urlBase + '/idDelete')">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="add" direction="btt" size="95%" :before-close="handleClose">
    <change-occupation
      :course2-occupation="props.course2Occupation"
      :change-id="changeId"
      @updated="emits('updated')"
      v-if="add" />
    <template #header>
      <h3 style="margin: 0">修改&nbsp;{{ props.course2Occupation.course.name }}&nbsp;预约</h3>
    </template>
  </el-drawer>
</template>

<style scoped></style>
