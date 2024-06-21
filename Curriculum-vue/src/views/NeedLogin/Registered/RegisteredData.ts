import { type Ref, ref } from 'vue'
import { DoctorAndRole } from '@/components/classes/DoctorAndRole'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { doctorBuilder } from '@/components/classes/Doctor'
import { roleBuilder } from '@/components/classes/Role'

export class RegisteredData {
  loaded = ref(false)
  doctorAndRoleList: Ref<DoctorAndRole[]>
  private url: string

  constructor(url: string) {
    this.doctorAndRoleList = ref(new Array<DoctorAndRole>())
    this.url = url
  }
  refresh(newList: Array<DoctorAndRole>) {
    this.doctorAndRoleList.value = newList
  }

  async init(departmentId: string) {
    await axios
      .post(
        this.url + '/getAll',
        { id: departmentId },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = Array<DoctorAndRole>()
          for (const temp of res.data.data.doctorAndRoles) {
            tempList.push(new DoctorAndRole(doctorBuilder(temp.doctor), roleBuilder(temp.role)))
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
