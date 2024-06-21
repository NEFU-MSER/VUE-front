<script setup lang="ts">
import { ref, watch } from 'vue'
import { localDB } from '@/main'

const emits = defineEmits(['updated'])
const props = defineProps({
  cardId: {
    type: String,
    required: true
  }
})

const reasons = ['充值', '扣款', '其他']

const execute = ref(0)
const loading = ref(false)
const reason = ref('')
const another = ref('')

watch(
  execute,
  () => {
    reason.value = execute.value >= 0 ? reasons[0] : reasons[1]
  },
  {
    immediate: true
  }
)
</script>

<template>
  <el-form label-width="15%" v-loading="loading" style="min-height: 100px">
    <el-form-item label="额度">
      <el-input type="number" v-model="execute" placeholder="请输入对余额的操作" />
    </el-form-item>
    <el-form-item label="事由">
      <el-select v-model="reason" placeholder="请选择操作事由">
        <el-option v-for="item in reasons" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="reason === '其他'" label="自定义事由">
      <el-input type="text" v-model="another" />
    </el-form-item>
    <el-form-item>
      <el-button
        style="margin-left: auto"
        type="primary"
        @click="
          async () => {
            loading = true
            await localDB.patientCardData.recharge(
              props.cardId,
              execute,
              reason === '其他' ? another : reason
            )
            emits('updated')
          }
        ">
        确认操作
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
