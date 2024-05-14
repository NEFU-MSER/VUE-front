<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<!-- layout/index.vue -->
<template>
  <div class="background" />
  <div class="background-white" />
  <RouterView />
</template>

<style scoped>
.background {
  background: url('assets/background2.jpg');
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  filter: blur(10px);
  z-index: -2;
}

.background-white {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.4);
  z-index: -1;
}
</style>
