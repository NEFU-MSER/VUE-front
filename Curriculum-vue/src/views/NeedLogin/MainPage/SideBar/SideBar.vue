<script lang="ts" setup>
import { Location } from '@element-plus/icons-vue'
import { bar1 } from '@/views/NeedLogin/MainPage/SideBar/SideBarItem'
</script>

<template>
  <el-menu default-active="2" class="mainMenu" :collapse="false">
    <!-- 一级菜单 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>基础管理</span>
      </template>
      <!-- 子菜单 -->
      <template v-for="[j, group] in bar1.entries()" :key="j">
        <el-menu-item-group>
          <template #title>
            <span>{{ group.name }}</span>
          </template>
          <template v-for="[i, item] in group.items.entries()" :key="i">
            <router-link :to="item.path">
              <el-menu-item :index="j.toString() + '-' + i.toString()">
                <span style="text-decoration: none">{{ item.name }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-menu-item-group>
      </template>
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
