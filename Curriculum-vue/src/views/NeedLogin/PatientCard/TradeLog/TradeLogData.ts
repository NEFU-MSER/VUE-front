import { type Ref, ref } from 'vue'
import type { TradeLog } from '@/components/classes/TradeLog'
import axios from 'axios'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { tradeLogBuilder } from '@/components/classes/TradeLog'

export class TradeLogData {
  loaded: Ref<boolean> = ref(false)
  private url: string
  tradeLogList: Ref<TradeLog[]>

  constructor(url: string) {
    this.url = url
    this.tradeLogList = ref(new Array<TradeLog>())
  }

  refresh(newList: Array<TradeLog>) {
    this.tradeLogList.value = newList
  }

  async init(id: string) {
    await axios
      .post(this.url + '/getAll', id, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (res) => {
        if (res.data.code === 200) {
          const tempList = []
          for (const tradeLog of res.data.data.tradeLogs) {
            const temp = tradeLogBuilder(tradeLog)
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
      })
  }
}
