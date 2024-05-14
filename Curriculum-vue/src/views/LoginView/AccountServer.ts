import { createServer, Model } from 'miragejs'
import { User } from '@/classes/User'
import { buildToken } from '@/components/utils/TokenUtils'

function isLegal(user: User) {
  return (
    user._userName != null &&
    user._userAccount != null &&
    user._userPassword != null &&
    user._email != null &&
    (user._gender === 0 || user._gender === 1)
  )
}

export const accountServer = createServer({
  models: {
    user: Model
  },

  routes() {
    this.urlPrefix = 'https://my.api.com'

    this.post('/login', (schema, req) => {
      const postForm = JSON.parse(req.requestBody)
      const result = schema.db.users.findBy({ key: postForm.userAccount })
      if (result != null) {
        const user: User = result.User
        if (postForm.userPassword === user._userPassword) {
          sessionStorage.setItem('token', buildToken(user)) //生成Token
          return { result: true, reason: 0 } //登陆成功
        } else {
          return { result: false, reason: 2 } //密码不匹配
        }
      }
      return { result: false, reason: 1 } //查无此人
    })

    this.post('/signIn', (schema, req) => {
      const user: User = JSON.parse(req.requestBody)
      console.debug(user)
      if (isLegal(user)) {
        if (schema.db.users.findBy({ key: user._userAccount }) == null) {
          schema.db.users.insert({ User: user, key: user._userAccount })
          sessionStorage.setItem('token', buildToken(user)) //生成token
          console.debug(schema.db.users)
          return { result: true, reason: 0 } //注册成功
        } else {
          return { result: false, reason: 1 } //用户已存在
        }
      } else return { result: false, reason: 2 } //信息不合法
    })

    this.get('/profile', (schema) => {
      const token = sessionStorage.getItem('token')
      console.debug('profile')
      if (token != null) {
        const account = token.split('(')[1].split(')')[0] //切割token的用户名
        const user: User = schema.db.users.findBy({ key: account }).User
        return { result: true, data: user } //返回用户信息
      }
      return { result: false, data: null } //失败
    })

    this.post('/changeProfile', (schema, req) => {
      const user: User = JSON.parse(req.requestBody)
      console.debug(user)
      let account = sessionStorage.getItem('token')
      if (account != null) {
        account = account.split('(')[1].split(')')[0]
      } else {
        sessionStorage.clear() //token失效
        return { result: false, reason: 2 }
      }
      console.debug(account)
      console.debug('db:', schema.db.users)
      //防止篡改account
      if (account === user._userAccount) {
        schema.db.users.update({ key: user._userAccount }, { User: user })
        console.debug('db:', schema.db.users)
        return { result: true, reason: 0 } //修改成功了
      } else return { result: false, reason: 1 } //修改失败了
    })
  },

  seeds(server) {
    const defaultUser = new User('KUKUKING', '2021213196', '112210ly', 'ly112210@outlook.com', 0)
    server.db.loadData({
      users: [{ User: defaultUser, key: defaultUser._userAccount }]
    })
  }
})
