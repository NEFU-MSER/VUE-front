import { type Ref, ref } from 'vue'
import type { Prescription } from '@/components/classes/Prescription'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { prescriptionBuilder } from '@/components/classes/Prescription'

export class PrescriptionData {
  loaded: Ref<boolean> = ref(false)
  historyLoad: Ref<boolean> = ref(false)
  private url: string
  private role: string
  prescriptionList: Ref<Prescription[]>
  historyList: Ref<Prescription[]>

  constructor(url: string, role: string) {
    this.url = url
    this.role = role
    this.prescriptionList = ref(new Array<Prescription>())
    this.historyList = ref(new Array<Prescription>())
  }

  refresh(newList: Array<Prescription>) {
    this.prescriptionList.value = newList
  }

  async init(id: string) {
    await axios
      .post(this.url + '/' + this.role + '/getAll', id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            tempList.push(temp)
          }
          this.refresh(tempList)
          this.loaded.value = true
        } else {
          this.loaded.value = false
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  async history(id: string) {
    await axios
      .post(this.url + '/' + this.role + '/history', id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            tempList.push(temp)
          }
          this.historyList.value = tempList
          this.historyLoad.value = true
        } else {
          this.historyLoad.value = false
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  async add(prescription: Prescription): Promise<void> {
    await axios
      .post(this.url + '/add', prescription, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '添加成功'
          })
        } else {
          this.loaded.value = false
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  async update(prescription: Prescription): Promise<void> {
    await axios
      .post(this.url + '/update', prescription, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            tempList.push(temp)
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        } else {
          this.loaded.value = false
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  async toFinish(prescription: Prescription) {
    await axios
      .post(this.url + '/toFinish', prescription, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            tempList.push(temp)
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        } else {
          this.loaded.value = false
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  async finish(prescription: Prescription) {
    await axios
      .post(this.url + '/finish', prescription, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            tempList.push(temp)
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        } else {
          this.loaded.value = false
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  async delete(id: string): Promise<void> {
    await axios
      .post(this.url + '/delete', id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const prescription of res.data.data.prescriptions) {
            const temp = prescriptionBuilder(prescription)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
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
        ElMessage({
          type: 'error',
          message: '网络出错'
        })
      })
  }

  getPrescription(id: string): Prescription | null {
    for (const item of this.prescriptionList.value) {
      if (item.id == id) {
        return item
      }
    }
    return null
  }
}
