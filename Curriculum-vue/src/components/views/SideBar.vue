<script lang="ts" setup>
// import { Location } from '@element-plus/icons-vue'
</script>

<template>
  <el-menu default-active="2" class="mainMenu" :collapse="false">
    <!-- 一级菜单 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <!--          <location />-->
        </el-icon>
        <span>导航栏</span>
      </template>
      <!-- 子菜单 -->
      <el-menu-item-group>
        <template #title><span>账户管理</span></template>
        <router-link to="/main/profile">
          <el-menu-item index="1-1">
            <span style="text-decoration: none">个人信息</span>
          </el-menu-item>
        </router-link>
      </el-menu-item-group>
      <el-menu-item-group title="教学管理">
        <router-link to="/main/lib">
          <el-menu-item index="2-1">
            <span style="text-decoration: none">教室管理</span>
          </el-menu-item>
        </router-link>
        <router-link to="/main/course">
          <el-menu-item index="2-2">
            <span style="text-decoration: none">课程管理</span>
          </el-menu-item>
        </router-link>
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
