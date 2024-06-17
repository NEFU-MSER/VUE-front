import { User, userBuilder } from '@/components/classes/User'
import axios from 'axios'
import { getServerToken } from '@/components/utils/TokenUtils'
import { ElMessageBox } from 'element-plus'
import { ResultVO } from '@/components/utils/ResultVO'
import router from '@/router'
//  无参的构造函数下要引用main里面的urlRoot
//  import { urlRoot } from '@/main'

export class ProfileData {
  user: User | null = null
  url: string = ''

  //  写构造函数的时候不要在里面写初始化，不然所有的页面的所有数据都会在打开的一瞬间加载，后端会去世的
  //  构造函数获取url的根，你也可以在这里直接写无参的构造函数，在下面的axios那边我们讲无参的构造函数怎么写url
  constructor(url: string) {
    this.url = url
  }

  //  这是初始化函数，只有我们让他初始化，他才初始化。这个函数也还能用来作为刷新data的函数使用
  async init() {
    await axios
      //  如果你写了无参的构造函数，就把this.url 写成" urlRoot + 'api/user/profile' "即可
      //  这里是post，你写成get也是一样的写法
      .post(this.url, {
        token: getServerToken()
      })
      //  post后用then接住返回的数据 .then(async (res) => { ... })这个写法几乎是定死的
      .then(async (res) => {
        //  如果后端返回的结果代号不是200，证明后端的响应有错误
        if (res.data.code === 200) {
          //  这里就调用了我们写类的时候写的从json构建User的函数
          this.user = userBuilder(res.data.data.user)
        } else {
          //  如果后端报错了，我们也可以接住后端的报错数据，就在 res.data.message 里面，你可以直接复制这段代码 👇
          const resData = new ResultVO(res.data.code, res.data.message)
          //  如果后端返回的结果代号是403，那就代表登陆失效了，这段代码会让页面跳转到登陆页
          if (resData.code == 403) {
            sessionStorage.clear()
            await router.push('/main')
          }
          //  这段代码是生成一格弹窗，告诉用户错误是啥
          await ElMessageBox.alert(resData.message, resData.code.toString()).catch()
          //  👆复制到这里结束
        }
      })
      //  这个catch是为了防止有意料之外的错误而放的，也可以直接复制到你的代码就行
      .catch((error) => {
        console.error(error)
      })
  }
}
