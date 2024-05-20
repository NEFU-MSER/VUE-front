import { createServer } from 'miragejs'
import { User } from '@/components/classes/User'
import { buildToken } from '@/components/utils/TokenUtils'
import { Course } from '@/components/classes/Course'
import { Lib } from '@/components/classes/Lib'
import { Occupation } from '@/components/classes/Occupation'
import type { OccupationSum } from '@/components/classes/OccupationSum'
import { cloneDeep } from 'lodash'

function isLegal(user: User) {
  return (
    user._userName != null &&
    user._userAccount != null &&
    user._userPassword != null &&
    user._email != null &&
    (user._gender === 0 || user._gender === 1)
  )
}

function convertTime(classTime: { week: [number, number]; day: number; time: number[] }): number {
  return (
    (classTime.week[1] - classTime.week[0] + 1) * (classTime.time[1] - classTime.time[0] + 1) * 0.75
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
        user._userPassword = ''
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
      const tempCourse: Course = JSON.parse(req.requestBody)
      if (schema.db.Libs.findBy({ key: tempCourse._courseName }) == null) {
        const course: Course = new Course(
          new User('', '', '', '', 0),
          tempCourse._courseName,
          tempCourse._courseCredit,
          tempCourse._courseTime[1]
        )
        course._teacherName = tempCourse._teacherName
        course._teacherId = tempCourse._teacherId
        schema.db.Courses.insert({ Course: course, key: course._courseName })
        return JSON.stringify({ result: true, reason: '成功添加 ' + tempCourse._courseName })
      } else {
        return JSON.stringify({ result: false, reason: '课程已存在' })
      }
    })

    this.post('/addLib', (schema, req) => {
      const postForm: { _libId: number; _libType: string } = JSON.parse(req.requestBody)
      if (schema.db.Libs.findBy({ key: postForm._libId }) == null) {
        const newLib: Lib = new Lib(Number(postForm._libId), postForm._libType)
        schema.db.Libs.insert({ Lib: newLib, key: newLib._libId })
        console.debug(schema.db.Libs)
        return JSON.stringify({ result: true, reason: '创建成功' })
      } else {
        return JSON.stringify({ result: false, reason: '创建失败，该教室已存在' })
      }
    })

    this.get('/getAllData', (schema) => {
      return JSON.stringify(schema.db)
    })

    this.get('/getMyCourses', (schema) => {
      let account = sessionStorage.getItem('token')
      const courses = new Array<Course>()
      if (account != null) {
        account = account.split('(')[1].split(')')[0]
      } else {
        sessionStorage.clear() //token失效
        return JSON.stringify({ result: null, reason: 'token失效' })
      }
      for (const course of schema.db.Courses) {
        if (course.Course._teacherId === account) {
          courses.push(course.Course)
        }
      }
      return JSON.stringify({ result: courses, reason: '查找成功' })
    })

    this.post('/deleteOccupation', (schema, req) => {
      const postForm: { libId: number; course: Course; timeId: number } = JSON.parse(
        req.requestBody
      )
      if (postForm.libId != null && postForm.course != null && postForm.timeId != null) {
        const temp = schema.db.Libs.findBy({ key: postForm.libId })
        if (temp != null) {
          const lib: Lib = temp.Lib
          for (const [index, occ] of lib._libOccupations.entries()) {
            if (occ._course._courseName === postForm.course._courseName) {
              //先删除课程对应的课时
              const course: Course = schema.db.Courses.findBy({
                key: occ._course._courseName
              }).Course
              course.deleteTime(convertTime(occ._classTime[postForm.timeId]))
              //occupation里面只有一个时间段，那就整个删除
              if (occ._timeDescribe.length <= 1) {
                lib._libOccupations.splice(index, 1)
              } else {
                //只删除对应时间段
                occ.deleteTime(postForm.timeId)
              }
            }
          }
          return JSON.stringify({ result: true, reason: '删除成功' })
        }
      }
      return JSON.stringify({ result: false, reason: '删除失败' })
    })

    this.post('/deleteCourse', (schema, req) => {
      const sum: OccupationSum = JSON.parse(req.requestBody)
      if (sum != null) {
        //删除所有lib内符合的occupation
        for (const lib of sum._occupationByLib) {
          const temp: Lib = schema.db.Libs.findBy({ key: lib.libId }).Lib
          for (const [index, o] of temp._libOccupations.entries()) {
            if (o._course._courseName === sum._course._courseName) {
              temp._libOccupations.splice(index, 1)
            }
          }
        }
        //删除课程名
        schema.db.Courses.remove({ key: sum._course._courseName })
        return JSON.stringify({ result: true, reason: '删除成功' })
      }
      return JSON.stringify({ result: false, reason: '参数错误' })
    })

    this.post('/changeOccupation', (schema, req) => {
      const data: { libId: [number, number]; timeIndex: number; newOccupation: Occupation } =
        JSON.parse(req.requestBody)
      if (data.libId != null && data.timeIndex != null && data.newOccupation != null) {
        const course: Course = schema.db.Courses.findBy({
          key: data.newOccupation._course._courseName
        }).Course
        if (data.libId[0] == data.libId[1]) {
          //实验室位置没变
          const lib: Lib = schema.db.Libs.findBy({ key: data.libId[0] }).Lib
          //深度克隆lib
          const tempLib: Lib = cloneDeep(lib)
          let result: { result: boolean; reason: string }
          for (const [index, occupation] of tempLib._libOccupations.entries()) {
            if (occupation._course._courseName === data.newOccupation._course._courseName) {
              //假删除对应时间段
              occupation.deleteTime(data.timeIndex)
              //尝试添加新的时间段
              result = tempLib.addOccupation(data.newOccupation)
              if (result.result) {
                //真正删除对应时间段
                lib._libOccupations[index].deleteTime(data.timeIndex)
                //真正添加新的时间段
                lib.addOccupation(data.newOccupation)
                //删除课程对应的课时
                course.deleteTime(convertTime(occupation._classTime[data.timeIndex]))
                //增加新的课时
                course.addTime(convertTime(data.newOccupation._classTime[0]))
                return JSON.stringify(result)
              } else {
                return JSON.stringify(result)
              }
            }
          }
          //newOccupation不在list里
          result = lib.addOccupation(data.newOccupation)
          return JSON.stringify(result)
        } else {
          //实验室位置变了
          const oldLib: Lib = schema.db.Libs.findBy({ key: data.libId[1] }).Lib
          const newLib: Lib = schema.db.Libs.findBy({ key: data.libId[0] }).Lib
          const newTempLib: Lib = cloneDeep(newLib)
          //尝试添加新课时
          const result: { result: boolean; reason: string } = newTempLib.addOccupation(
            data.newOccupation
          )
          if (result.result) {
            for (const [index, occupation] of oldLib._libOccupations.entries()) {
              if (occupation._course._courseName === data.newOccupation._course._courseName) {
                //先删除课程对应的课时
                course.deleteTime(convertTime(occupation._classTime[data.timeIndex]))
                //occupation里面只有一个时间段，那就整个删除
                if (occupation._classTime.length <= 1) {
                  oldLib._libOccupations.splice(index, 1)
                } else {
                  //只删除对应时间段
                  occupation.deleteTime(data.timeIndex)
                }
              }
            }
            newLib.addOccupation(data.newOccupation)
            course.addTime(convertTime(data.newOccupation._classTime[0]))
          }
          return JSON.stringify(result)
        }
      } else {
        return JSON.stringify({ result: false, reason: '参数错误' })
      }
    })

    this.post('/addOccupation', (schema, req) => {
      const data: { libId: number; newOccupation: Occupation } = JSON.parse(req.requestBody)
      if (data.libId != null && data.newOccupation != null) {
        const lib: Lib = schema.db.Libs.findBy({ key: data.libId }).Lib
        const tempLib: Lib = cloneDeep(lib)
        const course: Course = schema.db.Courses.findBy({
          key: data.newOccupation._course._courseName
        }).Course
        //尝试添加安排
        const libResult: { result: boolean; reason: string } = tempLib.addOccupation(
          data.newOccupation
        )
        //尝试添加课时
        const courseResult: { result: boolean; reason: string } = cloneDeep(course).addTime(
          convertTime(data.newOccupation._classTime[0])
        )
        if (libResult.result) {
          //添加课时
          if (courseResult.result) {
            course.addTime(convertTime(data.newOccupation._classTime[0]))
            lib.addOccupation(data.newOccupation)
          } else {
            return JSON.stringify(courseResult)
          }
        }
        return JSON.stringify(libResult)
      }
      return JSON.stringify({ result: false, reason: '参数错误' })
    })
  },

  seeds(server) {
    const defaultUser = new User('KUKUKING', '1234567890', '123456', 'ly112210@outlook.com', 0)
    //课程实例
    const exampleCourse0: Course = new Course(defaultUser, 'web框架', 3, 40)
    const exampleCourse1: Course = new Course(defaultUser, '软件测试', 2.5, 25)
    const exampleCourse2: Course = new Course(defaultUser, '需求管理', 2, 20)
    const exampleCourse3: Course = new Course(defaultUser, 'Java开发', 3, 24)
    //实验室实例
    const exampleLib1: Lib = new Lib(906, '计算机实验室')
    const exampleLib0: Lib = new Lib(908, '计算机实验室')
    //空列表成功添加,课时为39
    exampleCourse0.addTime(39)
    exampleLib0.addOccupation(
      new Occupation(exampleCourse0, [
        {
          week: [1, 13],
          day: 1,
          time: [1, 2]
        }
      ])
    )
    exampleLib1.addOccupation(
      new Occupation(exampleCourse0, [
        {
          week: [1, 13],
          day: 3,
          time: [3, 4]
        }
      ])
    )
    //空列表成功添加两占用课时,课时为21
    exampleCourse1.addTime(21)
    exampleLib1.addOccupation(
      new Occupation(exampleCourse1, [
        {
          week: [2, 8],
          day: 1,
          time: [5, 6]
        },
        {
          week: [2, 8],
          day: 5,
          time: [1, 4]
        }
      ])
    )
    //时间冲突失败添加
    exampleLib1.addOccupation(
      new Occupation(exampleCourse2, [
        {
          week: [1, 3],
          day: 1,
          time: [1, 6]
        }
      ])
    )
    //时间不冲突成功添加
    exampleCourse3.addTime(24)
    exampleLib1.addOccupation(
      new Occupation(exampleCourse3, [
        {
          week: [1, 8],
          day: 1,
          time: [1, 4]
        }
      ])
    )
    //初始化数据库
    server.db.loadData({
      users: [{ User: defaultUser, key: defaultUser._userAccount }],
      Courses: [
        { Course: exampleCourse0, key: exampleCourse0._courseName },
        { Course: exampleCourse1, key: exampleCourse1._courseName },
        { Course: exampleCourse2, key: exampleCourse2._courseName },
        { Course: exampleCourse3, key: exampleCourse3._courseName }
      ],
      Libs: [
        { Lib: exampleLib0, key: exampleLib0._libId },
        { Lib: exampleLib1, key: exampleLib1._libId }
      ]
    })
  }
})
