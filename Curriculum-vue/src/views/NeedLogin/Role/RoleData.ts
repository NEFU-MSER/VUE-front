import { type Ref, ref } from 'vue'
import type { Role } from '@/components/classes/Role'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { roleBuilder } from '@/components/classes/Role'

export class RoleData {
  loaded: Ref<boolean> = ref(false)
  private url: string
  roleList: Ref<Role[]>

  constructor(url: string) {
    this.url = url
    this.roleList = ref(new Array<Role>())
  }

  refresh(newList: Array<Role>) {
    this.roleList.value = newList
  }

  async init() {
    await axios
      .post(this.url + '/getAll')
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const role of res.data.data.roles) {
            const temp = roleBuilder(role)
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

  async add(role: Role): Promise<void> {
    await axios
      .post(this.url + '/add', role, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const role of res.data.data.roles) {
            const temp = roleBuilder(role)
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

  async update(role: Role): Promise<void> {
    await axios
      .post(this.url + '/update', role, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const role of res.data.data.roles) {
            const temp = roleBuilder(role)
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
          for (const role of res.data.data.roles) {
            const temp = roleBuilder(role)
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
}
