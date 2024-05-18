import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { verifyToken } from '@/components/utils/TokenUtils'

const routers: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView/LoginView.vue')
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: () => import('../views/SignInView/SignInView.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/IsLogin/MainPage/MainView.vue'),
    meta: {
      isLogin: true
    },
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/IsLogin/Profile/ProfilesView.vue'),
        meta: {
          isLogin: true
        }
      },
      {
        path: 'lib',
        name: 'lib',
        component: () => import('../views/IsLogin/Lib/LibView.vue'),
        meta: {
          isLogin: true
        }
      },
      // {
      //   path: 'show',
      //   name: 'show',
      //   component: () => import('../views/IsLogin/TempShow.vue'),
      //   meta: {
      //     isLogin: true
      //   }
      // },
      {
        path: 'course',
        name: 'course',
        component: () => import('../views/IsLogin/Course/CourseView.vue'),
        meta: {
          isLogin: true
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
  if (to.meta.isLogin) {
    //判断该路由是否需要权限
    const token = sessionStorage.getItem('token')
    //判断storage是否有登录信息
    if (token != null) {
      if (verifyToken(token)) {
        console.debug('is login')
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
    console.debug('no need login')
    next()
  }
})

export default router
