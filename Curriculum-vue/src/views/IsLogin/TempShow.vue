<script setup lang="ts">
import axios from 'axios'

let db: any
axios({
  method: 'GET',
  url: 'https://my.api.com/getAllData'
})
  .then((res) => {
    db = res.data
  })
  .catch((error) => {
    console.debug(error)
  })
</script>

<template>
  {{ db }}
</template>

<style scoped></style>
