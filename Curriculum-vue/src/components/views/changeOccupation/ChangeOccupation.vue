<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue'
import { occupationData } from '@/views/IsLogin/Occupation/occupationData'
import { libData } from '@/views/IsLogin/Lib/LibData'
import { Course2Occupation } from '@/components/classes/Course2Occupation'
import OccupationVisible from '@/components/views/occupationVisible/OccupationTable.vue'
import { Occupation } from '@/components/classes/Occupation'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash'
import type { Lib2Occupation } from '@/components/classes/Lib2Occupation'

const props = defineProps({
  course2Occupation: {
    type: Course2Occupation,
    required: true
  },
  changeId: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['updated'])

const visible = ref(false)
const libOccupation: Ref<Lib2Occupation | null> = ref(null)
const loaded = ref(false)
const selectLib = ref('')
const opt = [1, 2, 3, 4, 5, 6, 7]
let newOccupation: Ref<Occupation>
const disable = ref(false)
const tips = ref('')
const urlBase = 'http://localhost:8080/api/occupation'
const active = ref(1)
const course2Occupation = ref(cloneDeep(props.course2Occupation))

// 初始化
async function initShow(libId: string) {
  visible.value = false
  for (const lib2O of occupationData.lib2Occupations) {
    if (libId == lib2O.lib.id) {
      libOccupation.value = cloneDeep(lib2O)
      visible.value = true
    }
  }
  if (!visible.value) {
    await occupationData.libInit(libData.getIds())
    for (const lib2O of occupationData.lib2Occupations) {
      if (libId == lib2O.lib.id) {
        libOccupation.value = cloneDeep(lib2O)
        visible.value = true
      }
    }
  }
}

async function initLib() {
  if (libData.libs.length == 0) {
    await libData.init()
  }
  return libData.libs
}

//页面状态
function overLength() {
  disable.value = true
  tips.value = '课时超时'
}

function conflict() {
  disable.value = true
  tips.value = '课时冲突'
}

function correct() {
  disable.value = false
  tips.value = ''
}

//方法
async function submit() {
  newOccupation.value.libId = selectLib.value
  await axios
    .post(
      urlBase + '/change',
      {
        token: getServerToken(),
        data: newOccupation.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(async (res) => {
      if (res.data.code === 200) {
        emits('updated')
        await ElMessageBox.alert('添加成功', '提示').catch()
      } else {
        const resData = new ResultVO(res.data.code, res.data.message)
        if (resData.code == 403) {
          sessionStorage.clear()
          await router.push('/main')
        }
        await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

//预载
watch(
  selectLib,
  async () => {
    await initShow(selectLib.value)
  },
  {
    immediate: true
  }
)

onMounted(async () => {
  loaded.value = false
  await initLib()
  for (const [index, occupation] of course2Occupation.value.occupations.entries()) {
    if (occupation.id === props.changeId) {
      newOccupation = ref(cloneDeep(occupation))
      course2Occupation.value.sumTime -= occupation.calculate()
      course2Occupation.value.occupations.splice(index, 1)
      if (occupation.libId) {
        selectLib.value = occupation.libId
        await initShow(selectLib.value)
        if (libOccupation.value) {
          // eslint-disable-next-line no-unsafe-optional-chaining
          for (const [i, t] of libOccupation.value?.occupations.entries()) {
            if (t.id === props.changeId) {
              libOccupation.value.occupations.splice(i, 1)
              loaded.value = true
              break
            }
          }
        }
      }
      break
    }
  }
})
</script>

<template>
  <el-form v-if="loaded" v-model="newOccupation" v-loading="!visible">
    <el-collapse v-model="active">
      <el-collapse-item :name="1">
        <template #title>
          <h3>教室课表</h3>
        </template>
        <occupation-visible
          :lib-name="libOccupation.lib.name + libOccupation.lib.type"
          :occupations="libOccupation.occupations"
          :new-occupation="newOccupation"
          :remainder-time="course2Occupation.course.time - course2Occupation.sumTime"
          @conflict="conflict()"
          @over-length="overLength()"
          @correct="correct()"
          v-if="loaded && visible && libOccupation" />
      </el-collapse-item>
      <el-collapse-item :name="2">
        <template #title>
          <h3>课程详情</h3>
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-form-item label="教室安排" label-width="7%">
      <el-select v-model="selectLib">
        <template v-for="data of libData.libs" :key="data.name">
          <el-option :label="data.name + data.type" :value="data.id" />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="周次安排" label-width="7%">
      <el-slider v-model="newOccupation.week" range show-stops :max="18" :min="1" />
    </el-form-item>
    <el-form-item label="星期选择" label-width="7%">
      <el-segmented v-model="newOccupation.day" :options="opt" size="large" />
    </el-form-item>
    <el-form-item label="课次安排" label-width="7%">
      <el-slider v-model="newOccupation.time" range show-stops :max="12" :min="1" />
    </el-form-item>
    <el-form-item>
      <h3 style="color: red">{{ tips }}</h3>
      <el-button
        @click="submit()"
        :type="disable ? 'danger' : 'primary'"
        :disabled="disable"
        style="margin-left: auto"
        size="large">
        &nbsp;提交&nbsp;
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
