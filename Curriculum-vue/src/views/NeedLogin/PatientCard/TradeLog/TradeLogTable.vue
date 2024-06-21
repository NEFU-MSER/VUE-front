<script setup lang="ts">
import { urlRoot } from '@/main'
import { TradeLogData } from '@/views/NeedLogin/PatientCard/TradeLog/TradeLogData'
import { onBeforeMount, ref } from 'vue'
import type { TradeLog } from '@/components/classes/TradeLog'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  urlBase: {
    type: String,
    default: urlRoot + '/api/tradeLog'
  }
})
const tradeLogData = new TradeLogData(props.urlBase)
const loaded = ref(false)
const tableRowClassName = ({ row, rowIndex }: { row: TradeLog; rowIndex: number }) => {
  if (row.execute < 0) {
    return 'minus-row'
  } else {
    return 'add-row'
  }
}

onBeforeMount(async () => {
  await tradeLogData.init(props.cardId)
  loaded.value = true
})
</script>

<template>
  <div style="min-height: 200px" v-loading="!loaded">
    <el-table
      :data="tradeLogData.tradeLogList.value"
      v-if="loaded"
      :row-class-name="tableRowClassName"
      :default-sort="{ prop: 'createTime', order: 'descending' }">
      <el-table-column prop="id" label="流水号" />
      <el-table-column prop="execute" label="交易额" />
      <el-table-column prop="reason" label="事由" />
      <el-table-column label="交易日期">
        <template #default="scope">
          {{
            scope.row.createTime.getFullYear() +
            '年' +
            (scope.row.createTime.getMonth() + 1) +
            '月' +
            scope.row.createTime.getDate() +
            '日'
          }}
        </template>
      </el-table-column>
      <el-table-column label="交易时间">
        <template #default="scope">
          {{
            scope.row.createTime.getHours() +
            ':' +
            (scope.row.createTime.getMinutes() + 1) +
            ':' +
            scope.row.createTime.getSeconds()
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.add-row {
  background: rgba(124, 252, 0, 0.1);
}
.minus-row {
  background: rgba(255, 69, 0, 0.1);
}
</style>
