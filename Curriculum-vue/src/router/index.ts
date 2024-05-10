import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { parseToken } from '@/components/utils/TokenUtils'

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
    path: '/',
    name: 'home',
    component: () => import('../App.vue'),
    meta: {
      isLogin: true
    },
    children: [
      {
        path: '/main',
        name: 'main',
        component: () => import('../views/IsLogin/MainPage/MainView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers
})

router.beforeEach((to, from, next) => {
  if (to.meta.isLogin) {
    //判断该路由是否需要权限
    const token = sessionStorage.getItem('token')
    //判断storage是否有登录信息
    if (token != null) {
      if (parseToken(token)) {
        console.debug('is login')
        next()
      } else {
        console.debug('is block')
        next({
          path: '/login'
        })
      }
    }
  } else {
    console.debug('is block')
    next()
  }
})

export default router
