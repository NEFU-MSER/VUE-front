<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { Occupation, dayConvert } from '@/components/classes/Occupation'

interface timeTableItem {
  colourIndex: number
  name: string
  start: boolean
  long: number
}

const props = defineProps({
  occupations: {
    type: Array<Occupation>,
    required: true
  },
  newOccupation: {
    type: Occupation,
    default: null
  },
  libName: {
    type: String,
    required: true
  },
  remainderTime: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['conflict', 'overLength', 'correct'])

let tips = ref('')
let weekIndex = ref(1)
const weekNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
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
  const map = new Map<string, number>()
  let count = 0
  if (props.occupations?.length == 0 && typeof props.newOccupation == 'undefined') {
    return
  }
  for (const occupation of props.occupations) {
    if (occupation.week[0] <= weekIndex.value && weekIndex.value <= occupation.week[1]) {
      let index = map.get(occupation.courseId)
      if (typeof index == 'undefined') {
        index = count
        map.set(occupation.courseId, index)
        count++
      }
      for (let i = occupation.time[0] - 1; i < occupation.time[1]; i++) {
        tempTable[occupation.day - 1][i] = {
          name: occupation.courseName,
          colourIndex: index % 10,
          start: i == occupation.time[0] - 1,
          long: i == occupation.time[0] ? occupation.time[1] - occupation.time[0] + 1 : 0
        }
      }
    }
  }
  week.value = tempTable
  if (props.newOccupation) {
    const newOccupation = props.newOccupation
    if (newOccupation.week[0] <= weekIndex.value && weekIndex.value <= newOccupation.week[1]) {
      let right = true
      if (newOccupation.calculate() <= props.remainderTime) {
        for (let i = newOccupation.time[0] - 1; i < newOccupation.time[1]; i++) {
          if (week.value[newOccupation.day - 1][i] != false) {
            right = false
            emits('conflict')
            break
          }
        }
      } else {
        tips.value = '课时超时'
        emits('overLength')
        return
      }
      if (right) {
        for (let i = newOccupation.time[0] - 1; i < newOccupation.time[1]; i++) {
          tempTable[newOccupation.day - 1][i] = {
            name: props.newOccupation.courseName,
            colourIndex: 10,
            start: i == newOccupation.time[0] - 1,
            long:
              i == newOccupation.time[0] - 1 ? newOccupation.time[1] - newOccupation.time[0] + 1 : 0
          }
          week.value = tempTable
        }
        tips.value = ''
        emits('correct')
      } else {
        tips.value = '时间冲突'
        emits('conflict')
      }
    }
  }
}
watch(
  props,
  () => {
    convert()
  },
  {
    immediate: true
  }
)
watch(weekIndex, () => {
  convert()
})
</script>

<template>
  <el-row class="row" style="margin-bottom: 15px">
    <p style="font-size: medium; margin: auto 10px auto 0">{{ props.libName }}课表&nbsp;周次选择</p>
    <el-segmented v-model="weekIndex" :options="weekNum" size="large" style="max-height: 30px" />
    <p style="color: red; font-size: medium; margin: auto 10px auto auto" v-if="tips != ''">
      {{ tips }}
    </p>
  </el-row>
  <template v-for="(day, indexDay) of week" :key="indexDay">
    <el-row>
      <el-col :span="1" style="margin: 5px 0 5px 0">
        <div class="cell-item" style="padding: 5px 0 5px 0">
          {{ dayConvert(indexDay + 1) }}
        </div>
      </el-col>
      <el-col :span="23" style="margin: 5px 0 5px 0">
        <el-row class="row">
          <template v-for="(time, indexTime) of day" :key="indexTime">
            <template v-if="time == false">
              <el-col :span="2" style="height: 30px">
                <div class="none">
                  <h4 class="text">第{{ indexTime + 1 }}节</h4>
                </div>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="time.long * 2" :v-if="time.start">
                <div class="startAndEnd" :style="colour[time.colourIndex]">
                  <h4 class="text">
                    {{
                      time.long * 4 < time.name.length
                        ? time.name.slice(0, time.long * 4 - 1) + '...'
                        : time.name
                    }}
                  </h4>
                </div>
              </el-col>
            </template>
          </template>
        </el-row>
      </el-col>
    </el-row>
  </template>
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
  margin: 0 2px 0 2px;
  height: 100%;
}
.text {
  color: rgba(17, 17, 17, 0.6);
  font-weight: bold;
  font-size: medium;
  font-family: 'Microsoft YaHei UI Light', serif;
  text-align: center;
}
.center {
  margin: auto;
}
h4 {
  margin: auto;
}
.row {
  height: 30px;
}
</style>
