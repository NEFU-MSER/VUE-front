import { createServer, Model } from 'miragejs'
import { User } from '@/components/classes/User'
import { buildToken } from '@/components/utils/TokenUtils'

function isLegal(user: User) {
  return (
    user.userName != null &&
    user.userAccount != null &&
    user.userPassword != null &&
    user.email != null &&
    (user.gender === 0 || user.gender === 1)
  )
}

export const accountServer = createServer({
  models: {
    user: Model
  },
  routes() {
    this.urlPrefix = 'https://my.api.com'

    this.post('/login', (schema, req) => {
      const user = JSON.parse(req.requestBody)
      const temp: User = schema.db.users.findBy({ key: user.userAccount }).user
      if (temp != null) {
        if (user.userPassword === temp.userPassword) {
          console.debug(temp)
          sessionStorage.setItem('token', buildToken(temp))
          return true
        }
      }
      return false
    })

    this.post('/signIn', (schema, req) => {
      const user: User = JSON.parse(req.requestBody)
      console.debug(user)
      if (isLegal(user)) {
        if (schema.db.users.findBy({ key: user.userAccount }) == null) {
          schema.db.users.insert({ User: user, key: user.userAccount })
          sessionStorage.setItem('token', buildToken(user))
          return { result: true, reason: 0 }
        }
      } else return { result: false, reason: 2 }
      return { result: false, reason: 1 }
    })

    this.get('/profile', (schema) => {
      const token = sessionStorage.getItem('token')
      if (token != null) {
        const account = token.split('(')[1].split(')')[0]
        const user: User = schema.db.users.findBy({ key: account })
        return { result: true, data: user }
      }
      return { result: false, data: null }
    })
  },
  seeds(server) {
    const defaultUser = new User('KUKUKING', '2021213196', '112210ly', 'ly112210@outlook.com', 0)
    server.db.loadData({
      users: [{ User: defaultUser, key: defaultUser.userAccount }]
    })
  }
})
