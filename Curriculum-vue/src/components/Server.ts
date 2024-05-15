import { createServer } from 'miragejs'
import { User } from '@/classes/User'
import { buildToken } from '@/components/utils/TokenUtils'
import { Course } from '@/classes/Course'
import { Lib } from '@/classes/Lib'
import { Occupation } from '@/classes/Occupation'

function isLegal(user: User) {
  return (
    user._userName != null &&
    user._userAccount != null &&
    user._userPassword != null &&
    user._email != null &&
    (user._gender === 0 || user._gender === 1)
  )
}

export const server = createServer({
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

    this.get('/getCourses', (schema) => {
      return JSON.stringify({ result: schema.db.Courses, reason: 0 })
    })

    this.get('getLibs', (schema) => {
      return JSON.stringify({
        result: schema.db.Libs.sort((first: any, second: any) => (first.key > second.key ? 1 : -1)),
        reason: 0
      })
    })

    this.post('/addCourse', (schema, req) => {
      const course: Course = JSON.parse(req.requestBody)
      console.debug(course)
      if (!schema.db.Courses.includes({ key: course._courseName })) {
        schema.db.Courses.push({ Course: course, key: course._courseName })
        return JSON.stringify({ result: true, reason: 0 })
      } else {
        return JSON.stringify({ result: false, reason: 1 })
      }
    })

    this.post('/addLib', (schema, req) => {
      const postForm: { _libId: number; _libType: string } = JSON.parse(req.requestBody)
      if (schema.db.Libs.findBy({ key: postForm._libId }) == null) {
        const lib: Lib = new Lib(postForm._libId, postForm._libType)
        schema.db.Libs.push({ Lib: lib, key: lib._libId })
        return JSON.stringify({ result: true, reason: '创建成功' })
      } else {
        return JSON.stringify({ result: false, reason: '创建失败，该教室已存在' })
      }
    })
  },

  seeds(server) {
    const defaultUser = new User('KUKUKING', '2021213196', '112210ly', 'ly112210@outlook.com', 0)
    server.db.loadData({
      users: [{ User: defaultUser, key: defaultUser._userAccount }]
    })

    //课程实例
    const exampleCourse0: Course = new Course(defaultUser, 'web框架')
    const exampleCourse1: Course = new Course(defaultUser, '软件测试')
    const exampleCourse2: Course = new Course(defaultUser, '需求管理')
    const exampleCourse3: Course = new Course(defaultUser, 'Java开发')
    //实验室实例
    const exampleLib1: Lib = new Lib(906, '计算机实验室')
    const exampleLib0: Lib = new Lib(908, '计算机实验室')
    //空列表成功添加
    exampleLib0.addOccupation(
      new Occupation(exampleCourse0, {
        week: [1, 13],
        day: 1,
        time: [1, 2]
      })
    )
    //空列表成功添加
    exampleLib1.addOccupation(
      new Occupation(exampleCourse1, {
        week: [2, 8],
        day: 1,
        time: [5, 6]
      })
    )
    //时间冲突失败添加
    exampleLib1.addOccupation(
      new Occupation(exampleCourse2, {
        week: [1, 3],
        day: 1,
        time: [1, 6]
      })
    )
    //时间不冲突成功添加
    exampleLib1.addOccupation(
      new Occupation(exampleCourse3, {
        week: [2, 8],
        day: 1,
        time: [3, 4]
      })
    )

    server.db.loadData({
      Courses: [
        { Course: exampleCourse0, key: exampleCourse0._courseName },
        { Course: exampleCourse1, key: exampleCourse1._courseName }
      ],
      Libs: [
        { Lib: exampleLib0, key: exampleLib0._libId },
        { Lib: exampleLib1, key: exampleLib1._libId }
      ]
    })
  }
})
