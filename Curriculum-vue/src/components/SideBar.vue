<script lang="ts" setup>
import { Location } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <el-menu default-active="2" class="mainMenu" :collapse="false">
    <!-- 一级菜单 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>导航栏</span>
      </template>
      <!-- 子菜单 -->
      <el-menu-item-group>
        <template #title><span>主页组</span></template>
        <RouterLink to="/main">
          <el-menu-item index="1-1">
            <span style="text-decoration: none">主页</span>
          </el-menu-item>
        </RouterLink>
      </el-menu-item-group>
      <el-menu-item-group title="实验室">
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<style>
.mainMenu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  max-height: 700px;
}
/*设置点击前的样式 */
a {
  text-decoration: none;
  color: #000;
}
</style>
