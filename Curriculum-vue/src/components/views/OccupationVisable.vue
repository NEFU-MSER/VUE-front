<script setup lang="ts">
import { Lib } from '@/components/classes/Lib'
import { onMounted, type Ref, ref, watch } from 'vue'
import { dayConvert, Occupation } from '@/components/classes/Occupation'

interface timeTableItem {
  colourIndex: number
  name: string
  start: boolean
  long: number
}

// 屏幕宽度
const windowWidth = ref(0)
// 屏幕高度
const windowHeight = ref(0)
// 生命周期
onMounted(() => {
  getWindowResize()
  window.addEventListener('resize', getWindowResize)
})
// 获取屏幕尺寸
const getWindowResize = function () {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

let props = defineProps({
  lib: Object,
  newOccupation: Occupation
})

let tableWidth = ref('1000px')
let localLib = ref(props.lib as Lib)
let tips = ref('')
let weekNum = ref(1)
let week: Ref<(timeTableItem | false)[][]> = ref([
  [false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false, false, false]
])
const colour: string[] = [
  'background-image: linear-gradient( 135deg, #FDEB71 10%, #F8D800 100%)',
  'background-image: linear-gradient( 135deg, #FEB692 10%, #EA5455 100%)',
  'background-image: linear-gradient( 135deg, #F97794 10%, #623AA2 100%)',
  'background-image: linear-gradient( 135deg, #FCCF31 10%, #F55555 100%)',
  'background-image: linear-gradient( 135deg, #FEC163 10%, #DE4313 100%)',
  'background-image: linear-gradient( 135deg, #F05F57 10%, #360940 100%)',
  'background-image: linear-gradient( 135deg, #FF6FD8 10%, #3813C2 100%)',
  'background-image: linear-gradient( 135deg, #F6D242 10%, #FF52E5 100%)',
  'background-image: linear-gradient( 135deg, #FFA8A8 10%, #FCFF00 100%)',
  'background-image: linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%)',
  'background-image: linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)',
  ''
]

function convert() {
  let tempTable: (false | timeTableItem)[][] = [
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false]
  ]
  if (typeof props?.lib === 'object') {
    localLib.value = props.lib as Lib
    for (const [index, occupation] of props.lib._libOccupations.entries()) {
      for (const classTime of occupation._classTime) {
        if (classTime.week[0] <= weekNum.value && weekNum.value <= classTime.week[1]) {
          for (let i = classTime.time[0] - 1; i < classTime.time[1]; i++) {
            tempTable[classTime.day - 1][i] = {
              name: occupation._course._courseName,
              colourIndex: index % 10,
              start: i == classTime.time[0] - 1,
              long: i == classTime.time[0] ? classTime.time[1] - classTime.time[0] + 1 : 0
            }
          }
        }
      }
    }
    week.value = tempTable
  }
  if (typeof props?.newOccupation === 'object') {
    const classTime = props.newOccupation._classTime[0]
    if (classTime.week[0] <= weekNum.value && weekNum.value <= classTime.week[1]) {
      let right = true
      for (let i = classTime.time[0] - 1; i < classTime.time[1]; i++) {
        if (week.value[classTime.day - 1][i] != false) {
          right = false
          break
        }
      }
      if (right) {
        for (let i = classTime.time[0] - 1; i < classTime.time[1]; i++) {
          tempTable[classTime.day - 1][i] = {
            name: props.newOccupation._course._courseName,
            colourIndex: 10,
            start: i == classTime.time[0] - 1,
            long: i == classTime.time[0] - 1 ? classTime.time[1] - classTime.time[0] + 1 : 0
          }
          week.value = tempTable
        }
        tips.value = ''
      } else {
        tips.value = '时间冲突'
      }
    }
  }
}
watch(
  props,
  () => {
    convert()
    console.log('startConvert', props)
  },
  {
    immediate: true
  }
)
</script>

<template>
  <el-descriptions
    class="margin-top"
    :title="'第' + weekNum.toString() + '周' + localLib?._libId.toString() + '课表'"
    :column="1"
    size="small"
    border>
    <template v-for="(day, indexDay) of week" :key="indexDay">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item" style="padding: 5px 0 5px 0">
            {{ dayConvert(indexDay) }}
          </div>
        </template>
        <el-row :style="tableWidth" class="row">
          <template v-for="(time, indexTime) of day" :key="indexTime">
            <template v-if="time == false">
              <el-col :span="2" style="height: 30px">
                <h4 class="none">第{{ indexTime + 1 }}节</h4>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="time.long * 2" :v-if="time.start">
                <h4 class="startAndEnd" :style="colour[time.colourIndex]">{{ time.name }}</h4>
              </el-col>
            </template>
          </template>
        </el-row>
      </el-descriptions-item>
    </template>
  </el-descriptions>
  <h3 style="color: red" v-if="tips != ''">{{ tips }}</h3>
</template>

<style scoped>
.start {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-left: 2px;
  text-decoration: none;
  color: whitesmoke;
  font-weight: bold;
  font-family: 'Microsoft YaHei UI Light', serif;
}
.none {
  text-align: center;
  height: 100%;
  border-radius: 5px;
  text-decoration: none;
  color: rgba(47, 79, 79, 0.5);
  font-weight: bold;
  font-size: small;
  font-family: 'Microsoft YaHei UI Light', serif;
  margin: 0 2px 0 2px;
  background: rgba(95, 158, 160, 0.15);
}
.end {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-right: 2px;
}
.startAndEnd {
  border-radius: 5px;
  text-decoration: none;
  color: rgba(17, 17, 17, 0.6);
  font-weight: bold;
  font-size: medium;
  font-family: 'Microsoft YaHei UI Light', serif;
  text-align: center;
  margin: 0 2px 0 2px;
  height: 100%;
}
h4 {
  margin: auto;
}
.row {
  height: 30px;
}
</style>
