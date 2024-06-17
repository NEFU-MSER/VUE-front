# 软工实习组前端仓库

## 组员
组长：陆晔

组员：张小鹏 左峻毓 罗丹兵
### 组员分工
#### 前端架构、数据约定
陆晔
#### 登陆、注册页面
陆晔
#### 未完待续


## 技术栈
VUE3+Element-plus 
SpringBoot 

## 约定开发规范
① 按照组件化的方式开发自己的页面，页面中可重用的元素要求拆分出来成为组件(注意拆分的粒度不要太细，也不要不拆分)  
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
//  从main中引入url的根，到时候统一修改很方便
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
'/api' 是固定的不要变  
'/(...)' 是你的页面对应的后端地址，写用户的就是'/user',医生就是'/doctor'  
'/xxx' 就是业务的名字  
### 如果不会写后端就找组长(组长工具人代写)！！！
③ 页面数据我们要求在本地有缓存，以下是示例  
比如说我们要开发一个医生诊疗的页面，页面中有多个患者的挂号信息，要求医生切换页面再回来的时候不需要再次从服务器加载  
那么我们的页面就有两个以上的文件，一个是vue的页面文件，一个是ts文件  
有一个现成的例子，就是已经写好的profile页面：
