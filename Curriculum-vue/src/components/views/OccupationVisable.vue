<script setup lang="ts">
import { Lib } from '@/components/classes/Lib'
import { type Ref, ref, watch } from 'vue'
import { dayConvert, Occupation } from '@/components/classes/Occupation'

interface timeTableItem {
  colourIndex: number
  name: string
  start: boolean
  long: number
}

let props = defineProps({
  lib: Object,
  newOccupation: Occupation
})

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
          for (let i = classTime.time[0]; i <= classTime.time[1]; i++) {
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
  }
  if (typeof props?.newOccupation === 'object') {
    const classTime = props.newOccupation._classTime[0]
    if (classTime.week[0] <= weekNum.value && weekNum.value <= classTime.week[1]) {
      let right = true
      for (let i = classTime.time[0]; i <= classTime.time[1]; i++) {
        right = week.value[classTime.day - 1][i] == false
      }
      if (right) {
        for (let i = classTime.time[0]; i <= classTime.time[1]; i++) {
          tempTable[classTime.day - 1][i] = {
            name: props.newOccupation._course._courseName,
            colourIndex: 10,
            start: i == classTime.time[0] - 1,
            long: i == classTime.time[0] ? classTime.time[1] - classTime.time[0] + 1 : 0
          }
          week.value = tempTable
        }
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
    <template v-for="(day, indexWeek) of week" :key="indexWeek">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item" style="padding: 5px 0 5px 0">
            {{ dayConvert(indexWeek) }}
          </div>
        </template>
        <el-row style="height: 30px; width: 900px">
          <template v-for="(time, indexDay) of day" :key="indexDay">
            <template v-if="time == false">
              <el-col :span="2" style="height: 30px">
                <h4 class="none">&nbsp;</h4>
              </el-col>
            </template>
            <template v-else>
              <el-col
                :span="time.long * 2"
                class="startAndEnd"
                :style="colour[time.colourIndex] + ';height: 30px'"
                v-if="time.start">
                <h4>{{ time.name }}</h4>
              </el-col>
            </template>
          </template>
        </el-row>
      </el-descriptions-item>
    </template>
  </el-descriptions>
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
  text-decoration: none;
  color: darkslategrey;
  font-weight: bold;
  font-family: 'Microsoft YaHei UI Light', serif;
}
.end {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-right: 2px;
}
.startAndEnd {
  border-radius: 5px;
  padding: 0 0 0 20px;
  text-decoration: none;
  color: rgba(17, 17, 17, 0.7);
  font-weight: bold;
  font-size: medium;
  font-family: 'Microsoft YaHei UI Light', serif;
}
h4 {
  margin: auto;
}
</style>
