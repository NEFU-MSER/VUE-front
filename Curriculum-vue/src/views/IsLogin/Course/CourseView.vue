<script setup lang="ts">
import { courseData } from '@/views/IsLogin/Course/courseData'
import { onMounted, ref } from 'vue'
import CourseShow from '@/components/views/courseShow/courseShow.vue'

const urlBase = 'http://localhost:8080/api/course'
const loaded = ref(false)

onMounted(async () => {
  await courseData.init()
  loaded.value = true
})

async function fresh() {
  loaded.value = false
  await courseData.init()
  loaded.value = true
}
</script>

<template>
  <div v-loading="!loaded">
    <Suspense>
      <course-show
        :url-base="urlBase"
        :courses="courseData.courses"
        :user="courseData.user"
        @updated="fresh()"
        v-if="loaded" />
    </Suspense>
  </div>
</template>

<style scoped></style>
