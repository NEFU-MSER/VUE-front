import { type Ref, ref } from 'vue'
import type { Doctor } from '@/components/classes/Doctor'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { doctorBuilder } from '@/components/classes/Doctor'

export class DoctorData {
  loaded: Ref<boolean> = ref(false)
  private url: string
  doctorList: Ref<Doctor[]>

  constructor(url: string) {
    this.url = url
    this.doctorList = ref(new Array<Doctor>())
  }

  refresh(newList: Array<Doctor>) {
    this.doctorList.value = newList
  }

  async init() {
    await axios
      .post(this.url + '/getAll')
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const doctor of res.data.data.doctors) {
            const temp = doctorBuilder(doctor)
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

  async add(doctor: Doctor): Promise<void> {
    await axios
      .post(this.url + '/add', doctor, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const doctor of res.data.data.doctors) {
            const temp = doctorBuilder(doctor)
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

  async update(doctor: Doctor): Promise<void> {
    await axios
      .post(this.url + '/update', doctor, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const doctor of res.data.data.doctors) {
            const temp = doctorBuilder(doctor)
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
          for (const doctor of res.data.data.doctors) {
            const temp = doctorBuilder(doctor)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
          }
          this.refresh(tempList)
          this.loaded.value = true
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
}
