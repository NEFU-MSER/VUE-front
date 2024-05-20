<script setup lang="ts">
import { server } from '@/components/Server'
import { onMounted, type Ref, ref, watch } from 'vue'
import { Course } from '@/components/classes/Course'
import { Occupation } from '@/components/classes/Occupation'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OccupationSum } from '@/components/classes/OccupationSum'
import { Clock, CreditCard, Location, Tickets, User as User2 } from '@element-plus/icons-vue'
import { LoadData } from '@/views/IsLogin/Course/LoadData'
import OV from '@/components/views/OccupationVisable.vue'
import type { Lib } from '@/components/classes/Lib'

// 模拟服务器
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Server = server
//数据准备
const loadData = new LoadData('https://my.api.com')

const options = [
  { text: '星期一', value: 1 },
  { text: '星期二', value: 2 },
  { text: '星期三', value: 3 },
  { text: '星期四', value: 4 },
  { text: '星期五', value: 5 },
  { text: '星期六', value: 6 },
  { text: '星期日', value: 7 }
]
const opt = [1, 2, 3, 4, 5, 6, 7]
//新数据
let selectLab: Ref<Lib>
let newCourse: Ref<Course>
let newOccupation: Ref<Occupation>
let appendLibId: Ref<[number, number]> = ref([0, 0])
let timeIndex: number = -1
let timeExcess: Ref<number>
//布尔值
let loadDone = ref(false)
let addCourseFormVisible = ref(false)
let addTimeFormVisible = ref(false)
let changeTimeFormVisible = ref(false)
let init = false

onMounted(async () => {
  loadDone.value = await loadData.init()
  selectLab = ref(loadData.libs.value[0])
  newCourse = ref(new Course(loadData.user, '', 0, 0))
})

function convertDay(day: number): string {
  for (const o of options) {
    if (day == o.value) {
      return o.text
    }
  }
  return options[0].text
}

function convertTime(classTime: { week: [number, number]; day: number; time: number[] }): number {
  return (
    (classTime.week[1] - classTime.week[0] + 1) * (classTime.time[1] - classTime.time[0] + 1) * 0.75
  )
}

function addCourseTip(): { result: boolean; reason: string } {
  if (newCourse.value._courseName === '') {
    return { result: false, reason: '课程名为空' }
  } else {
    if (newCourse.value._courseTime[0] != 0 || !(newCourse.value._courseTime[1] > 0)) {
      return { result: false, reason: '课时设置有误' }
    } else {
      if (!(newCourse.value._courseCredit > 0)) {
        return { result: false, reason: '学分设置有误' }
      }
    }
  }
  return { result: true, reason: '' }
}

async function addCourse() {
  const data: { result: boolean; reason: string } = addCourseTip()
  if (!data.result) {
    ElMessageBox.alert(data.reason, '警告').catch(() => {})
  } else {
    await axios({
      method: 'POST',
      url: 'https://my.api.com/addCourse',
      data: JSON.stringify(newCourse.value)
    }).then((res) => {
      const data: { result: boolean; reason: string } = res.data
      ElMessageBox.alert(data.reason, data.result ? '提示' : '警告').catch((error) => {
        console.error(error)
      })
      if (data.result) {
        loadData.init()
        addCourseFormVisible.value = false
      }
    })
  }
}

async function deleteCourse(sum: OccupationSum) {
  ElMessageBox.confirm('确认要删除该课程吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await axios({
        method: 'POST',
        url: 'https://my.api.com/deleteCourse',
        data: JSON.stringify(sum)
      })
        .then(async (res) => {
          const data: { result: boolean; reason: string } = res.data
          await ElMessageBox.alert(data.reason, data.result ? '提示' : '警告').catch((error) => {
            console.error(error)
          })
          if (data.result) {
            await loadData.init()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

async function deleteOccupation(
  sum: OccupationSum,
  row: {
    libId: number
    timeIndex: number
    classTime: { week: [number, number]; day: number; time: number[] }
  }
) {
  let index: number
  for (const [i, occupation] of sum._occupationByLib.entries()) {
    if (JSON.stringify(occupation) === JSON.stringify(row)) {
      index = i
      break
    }
  }
  ElMessageBox.confirm('确认要删除该课时吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await axios({
        method: 'POST',
        url: 'https://my.api.com/deleteOccupation',
        data: JSON.stringify({
          libId: sum._occupationByLib[index].libId,
          course: sum._course,
          timeId: sum._occupationByLib[index].timeIndex
        })
      })
        .then(async (res) => {
          const data: { result: boolean; reason: string } = res.data
          await ElMessageBox.alert(data.reason, data.result ? '提示' : '警告').catch((error) => {
            console.error(error)
          })
          if (data.result) {
            await loadData.init()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

function initChange(
  sum: OccupationSum,
  row: {
    libId: number
    timeIndex: number
    classTime: { week: [number, number]; day: number; time: [number, number] }
  }
) {
  //初始化数据
  if (!init) {
    timeExcess = ref(
      sum._course._courseTime[1] - sum._course._courseTime[0] + convertTime(row.classTime)
    )
    appendLibId = ref([row.libId, row.libId])
    timeIndex = row.timeIndex
    newOccupation = ref(new Occupation(sum._course, [row.classTime]))
    init = true
  } else {
    timeExcess.value =
      sum._course._courseTime[1] - sum._course._courseTime[0] + convertTime(row.classTime)
    appendLibId.value = [row.libId, row.libId]
    timeIndex = row.timeIndex
    newOccupation.value = new Occupation(sum._course, [row.classTime])
  }
  //弹窗
  changeTimeFormVisible.value = true
}

async function changeOccupation() {
  newOccupation.value._timeDescribe = Occupation.classTimeConvert(newOccupation.value._classTime)
  appendLibId.value[0] = selectLab.value._libId
  ElMessageBox.confirm('确认要修改该课时吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await axios({
        method: 'POST',
        url: 'https://my.api.com/changeOccupation',
        data: JSON.stringify({
          libId: appendLibId.value,
          timeIndex: timeIndex,
          newOccupation: newOccupation.value
        })
      })
        .then(async (res) => {
          const data: { result: boolean; reason: string } = res.data
          await ElMessageBox.alert(data.reason, data.result ? '提示' : '警告').catch((error) => {
            console.error(error)
          })
          if (data.result) {
            await loadData.init()
            changeTimeFormVisible.value = false
          }
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '修改取消'
      })
    })
}

function initAdd(sum: OccupationSum) {
  if (!init) {
    timeExcess = ref(sum._course._courseTime[1] - sum._course._courseTime[0])
    appendLibId = ref([loadData.libs.value[0]._libId, loadData.libs.value[0]._libId])
    newOccupation = ref(new Occupation(sum._course, [{ week: [1, 1], day: 1, time: [1, 1] }]))
    init = true
  } else {
    timeExcess.value = sum._course._courseTime[1] - sum._course._courseTime[0]
    appendLibId.value = [loadData.libs.value[0]._libId, loadData.libs.value[0]._libId]
    newOccupation.value = new Occupation(sum._course, [{ week: [1, 1], day: 1, time: [1, 1] }])
  }
  //弹窗
  addTimeFormVisible.value = true
}

async function addOccupation() {
  newOccupation.value._timeDescribe = Occupation.classTimeConvert(newOccupation.value._classTime)
  ElMessageBox.confirm('确认要添加该课时吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await axios({
        method: 'POST',
        url: 'https://my.api.com/addOccupation',
        data: JSON.stringify({
          libId: selectLab.value._libId,
          newOccupation: newOccupation.value
        })
      })
        .then(async (res) => {
          const data: { result: boolean; reason: string } = res.data
          await ElMessageBox.alert(data.reason, data.result ? '提示' : '警告').catch((error) => {
            console.error(error)
          })
          if (data.result) {
            await loadData.init()
            addTimeFormVisible.value = false
          }
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '添加取消'
      })
    })
}

function changeLib() {
  for (const l of loadData.libs.value) {
    if (appendLibId.value[0] == l._libId) {
      selectLab.value = l
    }
  }
}
</script>

<template>
  <el-row>
    <h1>你的课程</h1>
    <el-button type="primary" @click="addCourseFormVisible = true" style="margin: 17px 0 0 20px">
      添加课程
    </el-button>
  </el-row>
  <el-scrollbar>
    <template v-if="loadDone">
      <el-collapse accordion>
        <template v-for="(sum, index) of loadData.Sum.value" :key="index">
          <el-collapse-item :title="sum._course._courseName">
            <!--    添加课时      -->
            <el-row>
              <!--  @click="addOccupation()"          -->
              <el-col :span="3">
                <h4>已安排课时: {{ sum._course._courseTime[0] }}</h4>
              </el-col>
              <el-col :span="3">
                <h4>总课时: {{ sum._course._courseTime[1] }}</h4>
              </el-col>
              <el-col :span="12">
                <el-progress
                  :text-inside="true"
                  :stroke-width="26"
                  :percentage="(sum._course._courseTime[0] / sum._course._courseTime[1]) * 100"
                  style="margin-top: 15px" />
              </el-col>
              <el-col :span="4" style="margin-left: auto">
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteCourse(sum)"
                  style="margin: 17px 0 0 0">
                  删除课程
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="initAdd(sum)"
                  style="margin: 17px 0 0 20px">
                  添加课时
                </el-button>
              </el-col>
            </el-row>
            <!--    课时展示      -->
            <el-table :data="sum._occupationByLib" :stripe="true">
              <el-table-column prop="libId" label="授课教室" :sortable="true" />
              <el-table-column prop="classTime.week[0]" label="开始周" :sortable="true" />
              <el-table-column prop="classTime.week[1]" label="结束周" :sortable="true" />
              <el-table-column prop="classTime.day" label="星期" :sortable="true" />
              <el-table-column prop="classTime.time[0]" label="上课时间" :sortable="true" />
              <el-table-column prop="classTime.time[1]" label="下课时间" :sortable="true" />
              <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="initChange(sum, scope.row)">
                    修改
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="deleteOccupation(sum, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </template>
      </el-collapse>
    </template>
  </el-scrollbar>
  <!-- 新课程对话框 -->
  <el-dialog v-model="addCourseFormVisible" title="添加课程" width="70%">
    <el-form :model="newCourse">
      <el-form-item label="课程名" label-width="10%">
        <el-input v-model="newCourse._courseName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课时" label-width="10%">
        <el-input v-model="newCourse._courseTime[1]" type="number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学分" label-width="10%">
        <el-input v-model="newCourse._courseCredit" type="number" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="addCourseFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addCourse()">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 添加课时 -->
  <el-dialog v-model="addTimeFormVisible" title="添加新课时" width="80%">
    <OV :lib="selectLab" :new-occupation="newOccupation" />
    <el-descriptions class="margin-top" :column="3" size="large" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <User2 />
            </el-icon>
            授课人
          </div>
        </template>
        <p>{{ loadData.user._userName }}</p>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <tickets />
            </el-icon>
            课程名
          </div>
        </template>
        <p>{{ newOccupation._course._courseName }}</p>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <location />
            </el-icon>
            课室
          </div>
        </template>
        <p>{{ appendLibId[0] }}</p>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <clock />
            </el-icon>
            时间
          </div>
        </template>
        <el-row>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ newOccupation._classTime[0].week[0] }} - {{ newOccupation._classTime[0].week[1] }} 周
          </el-tag>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ convertDay(newOccupation._classTime[0].day) }}
          </el-tag>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ newOccupation._classTime[0].time[0] }} - {{ newOccupation._classTime[0].time[1] }} 节
          </el-tag>
        </el-row>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <credit-card />
            </el-icon>
            课时统计
          </div>
        </template>
        <el-row>
          <el-tag size="large" style="margin: 0 10px 0 10px; width: 110px">
            已选课时:&nbsp;{{ convertTime(newOccupation._classTime[0]) }}
          </el-tag>
          <el-tag size="large" type="warning" style="margin: 0 10px 0 10px; width: 110px">
            最大课时:&nbsp;{{ timeExcess }}
          </el-tag>
        </el-row>
      </el-descriptions-item>
    </el-descriptions>
    <el-form :model="newOccupation">
      <el-form-item label="周次安排" label-width="10%">
        <el-slider v-model="newOccupation._classTime[0].week" range show-stops :max="18" :min="1" />
      </el-form-item>
      <el-form-item label="星期选择" label-width="10%">
        <el-segmented v-model="newOccupation._classTime[0].day" :options="opt" size="large" />
      </el-form-item>
      <el-form-item label="课次安排" label-width="10%">
        <el-slider v-model="newOccupation._classTime[0].time" range show-stops :max="12" :min="1" />
      </el-form-item>
      <el-form-item label="课室安排" label-width="10%">
        <el-select v-model="appendLibId[0]" @change="changeLib()">
          <el-option
            v-for="tempLib of loadData.libs.value"
            :key="tempLib._libId"
            :label="tempLib._libId"
            :value="tempLib._libId" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="addTimeFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="convertTime(newOccupation._classTime[0]) > timeExcess"
          @click="addOccupation()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 修改课时 -->
  <el-dialog v-model="changeTimeFormVisible" title="修改课时" width="70%">
    <el-descriptions class="margin-top" title="修改后数据" :column="3" size="large" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <User2 />
            </el-icon>
            授课人
          </div>
        </template>
        <p>{{ loadData.user._userName }}</p>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <tickets />
            </el-icon>
            课程名
          </div>
        </template>
        <p>{{ newOccupation._course._courseName }}</p>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <location />
            </el-icon>
            课室
          </div>
        </template>
        <p>{{ appendLibId[0] }}</p>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <clock />
            </el-icon>
            时间
          </div>
        </template>
        <el-row>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ newOccupation._classTime[0].week[0] }} - {{ newOccupation._classTime[0].week[1] }} 周
          </el-tag>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ convertDay(newOccupation._classTime[0].day) }}
          </el-tag>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ newOccupation._classTime[0].time[0] }} - {{ newOccupation._classTime[0].time[1] }} 节
          </el-tag>
        </el-row>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <credit-card />
            </el-icon>
            课时统计
          </div>
        </template>
        <el-row>
          <el-tag size="large" style="margin: 0 10px 0 10px">
            {{ convertTime(newOccupation._classTime[0]) }}
          </el-tag>
          <el-tag size="large" type="warning" style="margin: 0 10px 0 10px">
            最大课时: {{ timeExcess }}
          </el-tag>
        </el-row>
      </el-descriptions-item>
    </el-descriptions>
    <el-form :model="newOccupation">
      <el-form-item label="周次安排" label-width="10%">
        <el-slider v-model="newOccupation._classTime[0].week" range show-stops :max="18" :min="1" />
      </el-form-item>
      <el-form-item label="星期选择" label-width="10%">
        <el-segmented v-model="newOccupation._classTime[0].day" :options="opt" size="large" />
      </el-form-item>
      <el-form-item label="课次安排" label-width="10%">
        <el-slider v-model="newOccupation._classTime[0].time" range show-stops :max="12" :min="1" />
      </el-form-item>
      <el-form-item label="课室安排" label-width="10%">
        <el-select v-model="appendLibId[0]" @change="changeLib()">
          <el-option
            v-for="tempLib of loadData.libs.value"
            :key="tempLib._libId"
            :label="tempLib._libId"
            :value="tempLib._libId" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="changeTimeFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="changeOccupation()"
          :disabled="convertTime(newOccupation._classTime[0]) > timeExcess">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
