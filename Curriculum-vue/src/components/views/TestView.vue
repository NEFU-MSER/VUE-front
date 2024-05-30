<script setup lang="ts">
import OccupationVisible from '@/components/views/occupationVisible/OccupationTable.vue'
import { User } from '@/components/classes/User'
import { Course } from '@/components/classes/Course'
import { Lib } from '@/components/classes/Lib'
import { Occupation } from '@/components/classes/Occupation'
import { ref } from 'vue'
const defaultUser = new User('KUKUKING', '1234567890', '123456', 'ly112210@outlook.com', 0)
//课程实例
const exampleCourse0: Course = new Course(defaultUser, 'web框架', 3, 40)
const exampleCourse1: Course = new Course(defaultUser, '软件测试', 2.5, 25)
const exampleCourse2: Course = new Course(defaultUser, '需求管理', 2, 20)
const exampleCourse3: Course = new Course(defaultUser, 'Java开发', 3, 24)
//实验室实例
const exampleLib1: Lib = new Lib(906, '计算机实验室')
const exampleLib0: Lib = new Lib(908, '计算机实验室')
//空列表成功添加,课时为39
exampleCourse0.addTime(39)
exampleLib0.addOccupation(
  new Occupation(exampleCourse0, [
    {
      week: [1, 13],
      day: 1,
      time: [1, 2]
    }
  ])
)
exampleLib1.addOccupation(
  new Occupation(exampleCourse0, [
    {
      week: [1, 13],
      day: 3,
      time: [3, 4]
    }
  ])
)
//空列表成功添加两占用课时,课时为21
exampleCourse1.addTime(21)
exampleLib1.addOccupation(
  new Occupation(exampleCourse1, [
    {
      week: [2, 8],
      day: 1,
      time: [5, 6]
    },
    {
      week: [2, 8],
      day: 5,
      time: [1, 4]
    }
  ])
)
//时间冲突失败添加
exampleLib1.addOccupation(
  new Occupation(exampleCourse2, [
    {
      week: [1, 3],
      day: 1,
      time: [1, 6]
    }
  ])
)
//时间不冲突成功添加
exampleCourse3.addTime(24)
exampleLib1.addOccupation(
  new Occupation(exampleCourse3, [
    {
      week: [1, 8],
      day: 1,
      time: [1, 4]
    }
  ])
)

let libR = ref(exampleLib1)
let newOccupation: Occupation = new Occupation(exampleCourse0, [
  {
    week: [1, 3],
    day: 1,
    time: [3, 4]
  }
])
</script>

<template>
  <OccupationVisible :lib="libR" :new-occupation="newOccupation" />
</template>

<style scoped></style>
