# 软工实习组前端仓库

## 组员  
组长：陆晔  
组员：张小鹏 左峻毓 罗丹兵  
### 组员分工  
#### 陆晔  
前端框架开发，后端开发，项目开发规范，项目管理与代码合并，大模型接入  
#### 张小鹏  
功能性需求分析，后端软件测试，登陆、注册、个人信息、就诊卡管理模块，文档编写  
#### 左峻毓  
可行性研究分析，数据库设计，患者管理、职务管理、医生管理模块，文档编写  
#### 罗丹兵  
非功能性需求分析，前端软件测试，处方管理模块、缴费结算模块，文档编写

#### 所有页面
1. ✔️登陆页(登陆、跳转注册)  
2. ✔️注册页(注册、跳转登陆)  
3. ✔️个人信息页(修改信息、登出)  
4. ✔️科室管理页(添加科室、修改科室、删除科室、科室介绍)  
5. ✔️患者管理页(添加患者、修改患者信息、删除患者信息、同步生成就诊卡、申请就诊卡)  
6. ✔️职务管理页(添加职务、修改职务、删除职务、职务对应挂号费)  
7. ✔️医生管理页(添加医生、修改医生信息、删除医生、赋予职务、上下班管理)  
8. ✔️就诊卡管理页(就诊卡挂失、就诊卡启用、就诊卡充值、就诊卡删除)  
9. ✔️挂号页(选择患者、选择医生、就诊卡扣费)  
10. ✔️处方管理页(处理挂号、开具处方、就诊卡扣费)
11. ✔️缴费结算页(处方缴费)
12. ✔️大模型客服(导诊台)

## 技术栈
VUE3 +
[Element-plus](https://element-plus.org/zh-CN/component/overview.html)   
SpringBoot 

## 约定开发规范
① 按照组件化的方式开发自己的页面，页面中可重用的元素要求拆分出来成为组件(注意拆分的粒度不要太细，也不要不拆分)
可以参考这个[Profile](Curriculum-vue/src/views/NeedLogin/Profile)  
② 所有要访问后端的代码，不要写死访问的连接  
错误示范：
```ts
import axios from 'axios'

//  这里就是写死了
//  要是以后要修改那得慢慢找所有用到后端地址的文件一个个改
const myUrl = 'http://localhost:8080/api/user/login'
await axios({
  method: 'POST',
  url: myUrl,
  data: loginForm
}).then( () => {
  //......
})
//......
```
正确做法：  
```ts
import axios from 'axios'
//  从main中引入url的根，到时候统一修改很方便, urlRoot = 'http://localhost:8080'
import { urlRoot } from '@/main'

await axios({
  method: 'POST',
  //  用url根组合成你的目标地址
  url: urlRoot + '/api/user/login',
  data: loginForm
}).then( () => {
  //......
})
//......
```
最后解释一下怎么写你对应的后端地址：  
比如一个'/api/(...)/xxx'  
'/api' 是固定的不要变  
'/(...)' 是你的页面对应的后端地址，写用户的就是'/user',医生就是'/doctor'  
'/xxx' 就是业务的名字  
### 如果不会写后端就找组长(组长工具人代写)！！！
③ 页面数据我们要求在本地有缓存，以下是示例  
比如说我们要开发一个医生诊疗的页面，页面中有多个患者的挂号信息，要求医生切换页面再回来的时候不需要再次从服务器加载  
那么我们的页面就有两个以上的文件，一个是vue的页面文件，一个是ts文件  
有一个现成的例子，就是已经写好的[profileData.ts](Curriculum-vue/src/views/NeedLogin/Profile/ProfileData.ts)
👈一定要看这个！  
然后我们再到[LocalDB.ts](Curriculum-vue/src/components/classes/LocalDB.ts)把你的类加到构造函数里面，如下：
```ts
import { ProfileData } from '@/views/NeedLogin/Profile/ProfileData'
import { urlRoot } from '@/main'

export class LocalDB {
  //   把你页面数据的类作为字段放进这个类里面，比如
  //   userData: UserData
  profileData: ProfileData

  //   这是无参的构造函数，用来统一构造所有页面的Data类
  constructor() {
    //   你写好你的类的字段后，把它的构造函数写进这个类的构造函数里面，比如
    //   this.userData = new UserData()
    this.profileData = new ProfileData(urlRoot + '/api/user/profile')
  }
}
```
最后就是Vue页面绑定数据了[ProfilesView.vue](Curriculum-vue/src/views/NeedLogin/Profile/ProfilesView.vue)：

```vue

<script setup lang="ts">
  //  引入localDB的实例
  import { localDB } from '@/main'
  import { onMounted, ref } from 'vue'

  //  这里的profileData有点类似c的指针，并不是复制了一个新的变量，只是引用，你操作的还是localDB里面的profileData
  const profileData = localDB.profileData
  //  这里是表示加载完的信号量，不然的话前后端交互有延迟，数据还没加载上页面就开始渲染了会报错
  const loaded = ref(false)

  //  这是vue的生命周期函数，在页面加载的时候这个函数会自动触发， async表示这是个异步函数，前后端有交互的函数都要加异步
  onMounted(async () => {
    //  加了异步后会等待有await的语句执行完，再执行下一条语句，这里的init()就是我们之前写的profileData的初始化函数
    await profileData.init()
    //  执行完init()后loaded里面的value才会变成true
    loaded.value = true
  })
</script>

<template>
  <!-- 在这里就可以愉快地使用了，注意要用v-if和loaded在加载完了再渲染，不然报错 -->
  <h1 v-if="loaded">{{ profileData.name }}</h1>
</template>
```
④ 前后端数据交互格式，我们使用json  
表示成功的响应(我们以user为例)：
```json
{
    "code": 200,
    "data": {
        "user": {
            "id": "1252145346215026688",
            "account": "12345678902",
            "idCard": "123456789012345679",
            "password": "",
            "name": "张小鹏",
            "email": "1234567890@nefu.edu.cn",
            "gender": 1,
            "createTime": "2024-06-17T14:18:34",
            "updateTime": "2024-06-17T14:18:34"
        }
    }
}
```
表示失败的响应(当然不止一种错误代码)：
```json
{
  "code": 400,
  "message": "用户已存在"
}
```
⑤ 每一个需要和后端交互的类都要写一个从json构建对象的函数  
比如[User.ts](Curriculum-vue/src/components/classes/User.ts)
里面就有一个userBuilder()
```ts
//  从后端发过来的json文件构建一个user对象
export function userBuilder(responseData: any): User {
  const user = new User(
    //  这里的 ?. 意思是不确定responseData里面是否有name，直接用 . 可能会导致有时候报错
    responseData?.name,
    responseData?.account,
    responseData?.idCard,
    responseData?.password,
    responseData?.email,
    responseData?.gender
  )
  user.id = responseData?.id
  return user
}
```
这个函数在[profileData.ts](Curriculum-vue/src/views/NeedLogin/Profile/ProfileData.ts)
里面就有用到
```ts
then(async (res) => {
  //  如果后端返回的结果代号不是200，证明后端的响应有错误
  if (res.data.code === 200) {
    //  这里就调用了我们写类的时候写的从json构建User的函数
    this.user = userBuilder(res.data.data.user)
  } else {
    // ......
  }
})
```

