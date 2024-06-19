<script setup>
import { onMounted, computed } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
const props = defineProps({
  active: { type: Boolean, default: false },
  mdStr: { type: String, default: '# 这里什么都没有' }
})
let active = computed({
  get() {
    return props.active
  }
})
const IPreviewOptions = {
  theme: { current: props.active ? 'dark' : 'light' },
  mode: 'dark',
  speech: { enable: true }
}
const mdStr = props.mdStr

function ReInitVidor() {
  Vditor.preview(document.getElementById('vditor'), mdStr, IPreviewOptions)
}

onMounted(() => {
  addEventListener('resize', ReInitVidor)
  ReInitVidor()
})
</script>

<template>
  <div>
    <div hidden>{{ active }}</div>
    <div id="vditor"></div>
  </div>
</template>
