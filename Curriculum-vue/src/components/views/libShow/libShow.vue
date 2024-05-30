<script setup lang="ts">
import { Lib } from '@/components/classes/Lib'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import LibChange from '@/components/views/libChange/libChange.vue'
import { occupationData } from '@/views/IsLogin/Occupation/occupationData'
import { libData } from '@/views/IsLogin/Lib/LibData'
import OccupationVisible from '@/components/views/occupationVisible/OccupationTable.vue'

const props = defineProps({
  libs: { type: Array<Lib>, required: true },
  urlBase: { type: String, required: true }
})
const emits = defineEmits(['updated'])

const change = ref(false)
const changeLib = ref(new Lib(null, '', ''))
const visible = ref(false)
const libOccupation = ref()

async function initShow(libId: string) {
  visible.value = false
  for (const lib2O of occupationData.lib2Occupations) {
    if (libId == lib2O.lib.id) {
      libOccupation.value = lib2O
      visible.value = true
    }
  }
  if (!visible.value) {
    await occupationData.libInit(libData.getIds())
    for (const lib2O of occupationData.lib2Occupations) {
      if (libId == lib2O.lib.id) {
        libOccupation.value = lib2O
        visible.value = true
      }
    }
  }
}

function initChange(lib: Lib) {
  changeLib.value = lib
  change.value = true
}

function initAdd() {
  changeLib.value = new Lib(null, '', '')
  change.value = true
}

async function deleteLib(id: string, url: string) {
  await ElMessageBox.confirm('确定要删除吗? 这将附带删除在这个教室的所有预约!', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await axios
        .post(url, id, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(async (response) => {
          if (response.data.code === 200) {
            emits('updated')
            await ElMessageBox.alert('删除成功', '提示').catch()
          } else {
            await ElMessageBox.alert('删除失败', '错误').catch()
          }
        })
        .catch((e) => {
          console.error(e)
        })
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
  <el-row>
    <p>教室查询</p>
    <el-button type="primary" @click="initAdd()" style="margin-left: auto">添加教室</el-button>
  </el-row>
  <el-table :data="props.libs">
    <el-table-column prop="name" label="教室编号" sortable />
    <el-table-column prop="type" label="教室类型" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="initShow(scope.row.id)">查看</el-button>
        <el-button link type="primary" size="small" @click="initChange(scope.row)">修改</el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="deleteLib(scope.row.id, props.urlBase + '/idDelete')">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗 -->
  <el-dialog class="margin-top" :column="3" size="large" border v-model="change" width="70%">
    <lib-change :url-base="urlBase" :lib="changeLib" @updated="emits('updated')" v-if="change" />
  </el-dialog>
  <!-- 显示占用情况 -->
  <el-drawer v-model="visible" direction="btt" size="90%">
    <template #header>
      <h3 style="margin: 0">查看课室课表</h3>
    </template>
    <occupation-visible
      :lib-name="libOccupation.lib.name + libOccupation.lib.type"
      :occupations="libOccupation.occupations"
      v-if="visible" />
  </el-drawer>
</template>

<style scoped></style>
