<script setup lang="ts">
import { libData } from '@/views/IsLogin/Lib/LibData'
import { onMounted, ref } from 'vue'
import LibShow from '@/components/views/libShow/libShow.vue'

const urlBase = 'http://localhost:8080/api/lib'
const loaded = ref(false)

onMounted(async () => {
  await libData.init()
  loaded.value = true
})

async function fresh() {
  loaded.value = false
  await libData.init()
  loaded.value = true
}
</script>

<template>
  <div v-loading="!loaded">
    <Suspense>
      <lib-show :url-base="urlBase" :libs="libData.libs" v-if="loaded" @updated="fresh()" />
    </Suspense>
  </div>
</template>

<style scoped></style>
