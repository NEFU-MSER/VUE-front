import { createServer, Model } from 'miragejs'
import { User } from '@/components/classes/User'
import { buildToken } from '@/components/utils/TokenUtils'

export const loginServer = createServer({
  models: {
    User: Model
  },
  routes() {
    this.urlPrefix = 'https://my.api.com'

    this.post('/login', (schema, req) => {
      const userAccount: string = req.params.userAccount
      const userPassword: string = req.params.userPassword
      const user: User = schema.db.users.findBy({ key: userAccount })
      if (user != null) {
        if (userPassword === user.userPassword) {
          console.debug('user=', user)
          sessionStorage.setItem('token', buildToken(user))
          return true
        }
      }
      return false
    })
  },
  seeds(server) {
    const defaultUser = new User('KUKUKING', '2021213196', '112210ly', 'ly112210@outlook.com', 0)
    server.db.loadData({
      users: [{ User: defaultUser }]
    })
  }
})
