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
