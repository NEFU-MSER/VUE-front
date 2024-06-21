import { type Ref, ref } from 'vue'
import type { Patient } from '@/components/classes/Patient'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { patientBuilder } from '@/components/classes/Patient'
import { localDB } from '@/main'

export class PatientData {
  loaded: Ref<boolean> = ref(false)
  private url: string
  patientList: Ref<Patient[]>

  constructor(url: string) {
    this.url = url
    this.patientList = ref(new Array<Patient>())
  }

  refresh(newList: Array<Patient>) {
    this.patientList.value = newList
  }

  async init() {
    await axios
      .post(this.url + '/getAll')
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patient of res.data.data.patients) {
            const temp = patientBuilder(patient)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
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
      })
  }

  async add(patient: Patient): Promise<void> {
    await axios
      .post(this.url + '/add', patient, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patient of res.data.data.patients) {
            const temp = patientBuilder(patient)
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
          await localDB.patientCardData.init()
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
      })
  }

  async update(patient: Patient): Promise<void> {
    await axios
      .post(this.url + '/update', patient, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patient of res.data.data.patients) {
            const temp = patientBuilder(patient)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
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
          for (const patient of res.data.data.patients) {
            const temp = patientBuilder(patient)
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
      })
  }

  getPatient(id: string): Patient | null {
    for (const item of this.patientList.value) {
      if (item.id == id) {
        return item
      }
    }
    return null
  }
}
