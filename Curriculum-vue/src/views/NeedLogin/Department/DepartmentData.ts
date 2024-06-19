import { type Ref, ref } from 'vue'
import { Department, departmentBuilder, structured, toList } from '@/components/classes/Department'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessageBox } from 'element-plus'

export class DepartmentData {
  loaded = ref(false)
  departmentsTree: Ref<Department[]>
  departments: Ref<Department[]>
  private url: string

  constructor(url: string) {
    this.departments = ref(new Array<Department>())
    this.departmentsTree = ref(new Array<Department>())
    this.url = url
  }

  private refresh(newDepartments: Department[]) {
    this.departments.value = newDepartments
    this.departmentsTree.value = structured(newDepartments)
  }

  async init() {
    await axios
      .post(this.url + '/getAll')
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = Array<Department>()
          for (const temp of res.data.data.departments) {
            const tempDepartment = departmentBuilder(temp)
            if (tempDepartment.id != '0000000000000000000') {
              tempList.push(tempDepartment)
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

  async add(parentId: string, name: string, description: string): Promise<void> {
    await axios
      .post(
        this.url + '/add',
        {
          id: null,
          parentId: parentId,
          name: name,
          description: description
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = Array<Department>()
          for (const temp of res.data.data.departments) {
            const tempDepartment = departmentBuilder(temp)
            if (tempDepartment.id != '0000000000000000000') {
              tempList.push(tempDepartment)
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

  async update(id: string, parentId: string, name: string, description: string) {
    await axios
      .post(
        this.url + '/update',
        {
          id: id,
          parentId: parentId,
          name: name,
          description: description
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = Array<Department>()
          for (const temp of res.data.data.departments) {
            const tempDepartment = departmentBuilder(temp)
            if (tempDepartment.id != '0000000000000000000') {
              tempList.push(tempDepartment)
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

  async delete(department: Department) {
    const list = toList(department.children)
    const idList = [department.id]
    for (const item of list) {
      idList.push(item.id)
    }
    await axios
      .post(this.url + '/deleteAll', idList, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = Array<Department>()
          for (const temp of res.data.data.departments) {
            const tempDepartment = departmentBuilder(temp)
            if (tempDepartment.id != '0000000000000000000') {
              tempList.push(tempDepartment)
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

  findById(id: string): Department | null {
    for (const item of this.departments.value) {
      if (item.id === id) {
        return item
      }
    }
    return null
  }
}
