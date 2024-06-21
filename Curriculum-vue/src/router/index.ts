import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { verifyToken } from '@/components/utils/TokenUtils'

const routers: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/NoLogin/LoginView/LoginView.vue'),
    meta: {
      title: '课程管理平台登陆'
    }
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: () => import('@/views/NoLogin/SignInView/SignInView.vue'),
    meta: {
      title: '用户注册'
    }
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/NeedLogin/MainPage/MainView.vue'),
    meta: {
      isLogin: true
    },
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/NeedLogin/Profile/ProfilesView.vue'),
        meta: {
          isLogin: true,
          title: '个人信息'
        }
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('../views/NeedLogin/Department/DepartmentView.vue'),
        meta: {
          isLogin: true,
          title: '科室管理'
        }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('../views/NeedLogin/Role/RoleView.vue'),
        meta: {
          isLogin: true,
          title: '职务管理'
        }
      },
      {
        path: 'doctor',
        name: 'doctor',
        component: () => import('../views/NeedLogin/Doctor/DoctorView.vue'),
        meta: {
          isLogin: true,
          title: '医生管理'
        }
      },
      {
        path: 'patient',
        name: 'patient',
        component: () => import('../views/NeedLogin/Patient/PatientView.vue'),
        meta: {
          isLogin: true,
          title: '患者管理'
        }
      },
      {
        path: 'patientCard',
        name: 'patientCard',
        component: () => import('../views/NeedLogin/PatientCard/PatientCardView.vue'),
        meta: {
          isLogin: true,
          title: '诊疗卡管理'
        }
      },
      {
        path: 'registered',
        name: 'registered',
        component: () => import('../views/NeedLogin/Registered/RegisteredView.vue'),
        meta: {
          isLogin: true,
          title: '挂号'
        }
      },
      {
        path: 'prescription',
        name: 'prescription',
        component: () => import('../views/NeedLogin/Prescription/PrescriptionView.vue'),
        meta: {
          isLogin: true,
          title: '问诊'
        }
      },
      {
        path: 'outPatient',
        name: 'outPatient',
        component: () => import('../views/NeedLogin/Outpatient/OutpatientView.vue'),
        meta: {
          isLogin: true,
          title: '缴费处'
        }
      },
      {
        path: 'patientHistory',
        name: 'patientHistory',
        component: () => import('../views/NeedLogin/Outpatient/PatientHistoryView.vue'),
        meta: {
          isLogin: true,
          title: '既往处方'
        }
      },
      {
        path: 'doctorHistory',
        name: 'doctorHistory',
        component: () => import('../views/NeedLogin/Prescription/DoctorHistoryView.vue'),
        meta: {
          isLogin: true,
          title: '既往处方'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  if (to.meta.isLogin) {
    //判断该路由是否需要权限
    const token = sessionStorage.getItem('token')
    //判断storage是否有登录信息
    if (token != null) {
      if (verifyToken(token)) {
        next()
      } else {
        console.debug('fake token')
        next({
          path: '/login'
        })
      }
    } else {
      console.debug('null token')
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
