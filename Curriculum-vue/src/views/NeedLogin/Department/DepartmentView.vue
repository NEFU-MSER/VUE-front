<script setup lang="ts">
import { localDB } from '@/main'
import { onMounted, ref } from 'vue'
import ChangeDepartment from '@/views/NeedLogin/Department/ChangeForm/ChangeDepartment.vue'
import { Department } from '@/components/classes/Department'
import { ElMessage, ElMessageBox } from 'element-plus'
import VditorViewer from '@/components/Vditor/VditorViewer.vue'

const departmentData = localDB.departmentData
const changeBoxVisible = ref(false)
const addMethod = ref(true)
let choose: Department = new Department('', '', '')
const mdStr = ref('## 还未选择任何科室')

onMounted(async () => {
  if (departmentData.loaded.value != true) {
    await departmentData.init()
  }
})

function select(selected: Department) {
  if (typeof selected.description != 'undefined') {
    mdStr.value = '# ' + selected.name + '  \n' + selected.description
  } else {
    mdStr.value = '# ' + selected.name + '  \n'
  }
  choose = selected
}

function initAdd(add: boolean, data: Department) {
  if (add) {
    choose = new Department('', data.id, '')
  } else {
    choose = data
  }
  addMethod.value = add
  changeBoxVisible.value = true
}

async function initDelete(department: Department) {
  await ElMessageBox.confirm('确定要删除吗? 这将附带删除这个科室下的所有科室!', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await departmentData.delete(department)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}
</script>

<template>
  <div style="min-height: 200px" v-loading="!departmentData.loaded.value">
    <el-row v-if="departmentData.departmentsTree.value.length <= 0">
      <el-button type="primary" @click="initAdd(true, new Department('', '', ''))">添加</el-button>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tree
          style="width: 100%"
          :data="departmentData.departmentsTree"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <template #default="{ data }">
            <span class="custom-tree-node" @click="select(data)">
              <el-dropdown>
                <span>{{ data.name }}</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      style="margin: auto; color: #1e90ff"
                      @click="initAdd(true, data)">
                      添加
                    </el-dropdown-item>
                    <el-dropdown-item
                      style="margin: auto; color: #1e90ff"
                      @click="initAdd(false, data)">
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      style="margin: auto; color: #ff0000"
                      @click="initDelete(data)">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="19" :offset="1">
        <el-scrollbar>
          <div v-loading="changeBoxVisible" style="min-height: 300px">
            <vditor-viewer :active="false" :md-str="mdStr" :key="mdStr" v-if="!changeBoxVisible" />
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
  <el-drawer v-model="changeBoxVisible" direction="btt" size="90%">
    <change-department
      v-if="changeBoxVisible"
      :parents="departmentData.departments.value"
      :department="choose"
      :add-method="addMethod"
      @updated="changeBoxVisible = false" />
  </el-drawer>
</template>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
