<script setup lang="ts">
import { courseData } from '@/views/IsLogin/Course/courseData'
import { occupationData } from '@/views/IsLogin/Occupation/occupationData'
import { libData } from '@/views/IsLogin/Lib/LibData'
import { onMounted, ref } from 'vue'
import CourseOccupationShow from '@/components/views/course2O/CourseOccupationShow.vue'
import { ElMessageBox } from 'element-plus'
import { Occupation } from '@/components/classes/Occupation'
import AddOccupation from '@/components/views/addOccupation/AddOccupation.vue'
import { Course2Occupation } from '@/components/classes/Course2Occupation'
import { Course } from '@/components/classes/Course'

const finish = ref(false)
const loadDone = ref(false)
const add = ref(false)
const courseId = ref('')
const courseName = ref('')

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

function initAdd() {
  for (const c of occupationData.course2Occupations) {
    if (c.course.id === courseId.value) {
      courseName.value = c.course.name
      return c
    }
  }
  return new Course2Occupation(new Course(null, '', 0, 0, ''), new Array<Occupation>(), 0)
}

async function fresh() {
  add.value = false
  finish.value = false
  await occupationData.courseInit(courseData.toIds())
  await occupationData.libInit(libData.getIds())
  finish.value = true
}

onMounted(async () => {
  await courseData.init()
  await libData.init()
  await occupationData.courseInit(courseData.toIds())
  loadDone.value = true
  finish.value = true
})
</script>

<template>
  <el-collapse accordion v-if="loadDone">
    <template v-for="o of occupationData.course2Occupations" :key="o.course.id">
      <el-collapse-item v-loading="!finish" v-if="o.course.id">
        <template #title>
          <h3>{{ o.course.name }}</h3>
        </template>
        <el-row>
          <el-col :span="3">
            <h4>已安排课时: {{ o.sumTime }}</h4>
          </el-col>
          <el-col :span="3">
            <h4>总课时: {{ o.course.time }}</h4>
          </el-col>
          <el-col :span="12">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="(o.sumTime / o.course.time) * 100"
              style="margin-top: 15px" />
          </el-col>
          <el-col :span="2" style="margin-left: auto">
            <el-button
              type="primary"
              size="small"
              style="margin: 17px 0 0 20px"
              @click="
                () => {
                  if (o.course.id != null) {
                    courseId = o.course.id
                  }
                  add = true
                }
              ">
              添加课时
            </el-button>
          </el-col>
        </el-row>
        <course-occupation-show
          v-if="finish"
          :course2-occupation="o"
          url-base="http://localhost:8080/api/occupation"
          @updated="fresh()" />
      </el-collapse-item>
    </template>
  </el-collapse>
  <el-drawer v-model="add" direction="btt" size="95%" :before-close="handleClose">
    <add-occupation :course2-occupation="initAdd()" @updated="fresh()" v-if="add" />
    <template #header>
      <h3 style="margin: 0">添加&nbsp;{{ courseName }}&nbsp;预约</h3>
    </template>
  </el-drawer>
</template>

<style scoped></style>
