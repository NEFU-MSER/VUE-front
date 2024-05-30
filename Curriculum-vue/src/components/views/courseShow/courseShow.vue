<script setup lang="ts">
import { Course } from '@/components/classes/Course'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import CourseChange from '@/components/views/courseChange/courseChange.vue'
import { User } from '@/components/classes/User'
import { getServerToken } from '@/components/utils/TokenUtils'

const props = defineProps({
  user: { type: User, required: true },
  courses: { type: Array<Course>, required: true },
  urlBase: { type: String, required: true }
})
const emits = defineEmits(['updated'])

const userId = props.user?.id
const visible = ref(false)
const changeCourse = ref(new Course(null, '', 0, 0, userId))

function initChange(course: Course) {
  changeCourse.value = course
  visible.value = true
}

function initAdd() {
  changeCourse.value = new Course(null, '', 0, 0, userId)
  visible.value = true
}

async function deleteCourse(id: string, url: string) {
  await ElMessageBox.confirm('确定要删除吗? 这将附带删除这个课程的所有预约!', '警告', {
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
  <el-row>
    <p>欢迎{{ props.user.name }}, 您管理的课程:</p>
    <el-button type="primary" @click="initAdd()" style="margin-left: auto">添加课程</el-button>
  </el-row>
  <el-table :data="props.courses">
    <el-table-column prop="id" label="课程编号" width="200" />
    <el-table-column prop="name" label="课程名" />
    <el-table-column prop="credit" label="学分" />
    <el-table-column prop="time" label="课时" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="initChange(scope.row)">修改</el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="deleteCourse(scope.row.id, props.urlBase + '/idDelete')">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗 -->
  <el-dialog class="margin-top" :column="3" size="large" border v-model="visible" width="70%">
    <course-change
      :url-base="urlBase"
      :course="changeCourse"
      @updated="emits('updated')"
      v-if="visible" />
  </el-dialog>
</template>

<style scoped></style>
