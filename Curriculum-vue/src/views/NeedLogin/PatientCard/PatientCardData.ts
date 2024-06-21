import { type Ref, ref } from 'vue'
import type { PatientCard } from '@/components/classes/PatientCard'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { patientCardBuilder } from '@/components/classes/PatientCard'
import { types } from 'sass'
import List = types.List

export class PatientCardData {
  loaded: Ref<boolean> = ref(false)
  private url: string
  patientCardList: Ref<PatientCard[]>

  constructor(url: string) {
    this.url = url
    this.patientCardList = ref(new Array<PatientCard>())
  }

  refresh(newList: Array<PatientCard>) {
    this.patientCardList.value = newList
  }

  async init() {
    await axios
      .post(this.url + '/getAll')
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patientCard of res.data.data.patientCards) {
            const temp = patientCardBuilder(patientCard)
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

  async add(patientID: string): Promise<void> {
    await axios
      .post(this.url + '/add', patientID, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patientCard of res.data.data.patientCards) {
            const temp = patientCardBuilder(patientCard)
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
          for (const patientCard of res.data.data.patientCards) {
            const temp = patientCardBuilder(patientCard)
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

  async enable(id: string) {
    await axios
      .post(this.url + '/enable', id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patientCard of res.data.data.patientCards) {
            const temp = patientCardBuilder(patientCard)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '启用成功'
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

  async disable(id: string) {
    await axios
      .post(this.url + '/disable', id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patientCard of res.data.data.patientCards) {
            const temp = patientCardBuilder(patientCard)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '停用成功'
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

  async recharge(id: string, execute: number, reason: string = ''): Promise<boolean> {
    let result = false
    await axios
      .post(
        this.url + '/recharge',
        {
          cardId: id,
          execute: execute,
          reason: reason
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const patientCard of res.data.data.patientCards) {
            const temp = patientCardBuilder(patientCard)
            if (temp.id != '0000000000000000000') {
              tempList.push(temp)
            }
          }
          this.refresh(tempList)
          this.loaded.value = true
          ElMessage({
            type: 'success',
            message: '余额变更成功'
          })
          result = true
        } else {
          const resData = new ResultVO(res.data.code, res.data.message)
          if (resData.code == 403) {
            sessionStorage.clear()
            await router.push('/main')
          }
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
          result = false
        }
      })
      .catch((e) => {
        result = false
        console.error(e)
      })
    return result
  }

  getCards(patientId: string): PatientCard[] {
    const list = new Array<PatientCard>()
    for (const item of this.patientCardList.value) {
      if (item.enable && patientId === item.patientId) {
        list.push(item)
      }
    }
    return list
  }

  getCard(id: string): PatientCard | null {
    for (const item of this.patientCardList.value) {
      if (item.id == id) {
        return item
      }
    }
    return null
  }
}
