<script setup lang="ts">
import { ref } from 'vue'
import Sider from '@/components/SideBar.vue'
import { RouterView } from 'vue-router'
import { parseToken } from '@/components/utils/TokenUtils'

const siderWidth = ref('200px')
const isLogin = parseToken(sessionStorage.getItem('token'))
</script>

<!-- layout/index.vue -->
<template>
  <div class="background" />
  <div class="background-white" />
  <RouterView />
</template>

<style scoped>
.pm-layout {
  &__header {
    background-color: #0a0f25;
  }

  &-main {
    height: calc(100vh - 140px);

    > .ep-card__body {
      padding-bottom: 0;
    }
  }

  &__aside {
    overflow: hidden;
  }
}

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
