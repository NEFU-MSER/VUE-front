<script setup lang="ts">
import axios from 'axios'
import { server } from '@/components/Server'
import { onMounted, ref } from 'vue'
import { Lib } from '@/components/classes/Lib'
import { ElMessageBox } from 'element-plus'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Server = server

let loadDone = ref(false)
let libs = ref(new Array<Lib>())
let lib = ref(new Lib(-1, '0'))
let postForm = ref({
  _libId: -1,
  _libType: ''
})
let add = ref(false)

async function loadData() {
  await axios({
    method: 'GET',
    url: 'https://my.api.com/getLibs'
  })
    .then((res) => {
      const data = res.data
      if (data.reason === 0) {
        libs.value.splice(0, libs.value.length)
        const temp: any[] = data.result
        for (let i = 0; i < temp.length; i++) {
          libs.value.push(temp[i].Lib)
        }
        loadDone.value = true
      }
    })
    .catch((e) => {
      console.debug(e)
    })
}

async function addLib() {
  if (postForm.value._libType === '' || postForm.value._libId == 0) {
    await ElMessageBox.alert('教室编号不能为0 且 教室类型不能为空。', '警告').catch((error) => {
      console.error(error)
    })
  } else {
    await axios({
      method: 'POST',
      url: 'https://my.api.com/addLib',
      data: JSON.stringify(postForm.value)
    })
      .then(async (res) => {
        const response: { result: boolean; reason: string } = res.data
        await ElMessageBox.alert(response.reason, response.result ? '提示' : '警告').catch(
          (error) => {
            console.error(error)
          }
        )
        if (response.result) {
          await loadData()
          add.value = false
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
}

function openAddForm() {
  postForm = ref({
    _libId: 0,
    _libType: ''
  })
  add.value = !add.value
}

function setAdd() {
  add.value = false
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <el-row v-if="loadDone">
    <el-col :span="3">
      <p>教室编号:</p>
    </el-col>
    <el-col :span="8">
      <el-select
        v-model="lib"
        placeholder="选择一个教室"
        size="large"
        class="input"
        @change="setAdd">
        <el-option v-for="l in libs" :key="l._libId" :label="l._libId" :value="l"></el-option>
      </el-select>
    </el-col>
    <el-col :span="3" style="padding-top: 8px">
      <el-button type="primary" @click="openAddForm">{{ add ? '取消添加' : '添加教室' }}</el-button>
    </el-col>
  </el-row>

  <el-card style="max-width: 800px" v-if="lib._libId != -1 && !add">
    <template #header>
      <div class="card-header">
        <span>{{ lib._libId }} {{ lib._libType }}</span>
      </div>
    </template>
    <el-table :data="lib._libOccupations" stripe style="width: 100%">
      <el-table-column prop="_course._courseName" label="课程名" width="250px" />
      <el-table-column prop="_course._teacherName" label="授课人" width="200px" />
      <el-table-column prop="_timeDescribe" label="授课时间" width="300px" />
    </el-table>
  </el-card>

  <el-card style="max-width: 800px" v-if="add">
    <template #header>
      <el-row>
        <el-col :span="16">
          <div class="card-header">
            <span>添加实验室</span>
          </div>
        </el-col>
        <el-button type="primary" @click="addLib">确认添加</el-button>
      </el-row>
    </template>
    <el-row>
      <el-col :span="12">
        <el-input type="number" v-model="postForm._libId" class="input">
          <template #prepend>教室编号</template>
        </el-input>
      </el-col>
      <el-input type="text" v-model="postForm._libType" class="input">
        <template #prepend>教室类型</template>
      </el-input>
    </el-row>
  </el-card>
</template>

<style scoped>
.input {
  width: 350px;
  padding: 5px 0 0 10px;
}
</style>
