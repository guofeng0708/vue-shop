import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import productRouter from './modules/product'
import settingRouter from './modules/setting'
import systemRouter from './modules/system'
import nprogress from 'nprogress' // @types/nprogress
import 'nprogress/nprogress.css'
import { store } from '@/store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin/home'
  },
  {
    path: '/admin',
    component: AppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'home', // 默认子路由
        name: 'home',
        component: () => import('../views/home/index.vue'),
        meta: { title: '首页' }
      },
      productRouter,
      settingRouter,
      systemRouter
    ]
  },
  {
    path: '/admin/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 路由模式
  routes // 路由规则
})

router.beforeEach((to, from) => {
  nprogress.start() // 开始加载进度条
  if (to.meta.requiresAuth && !store.state.user) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/admin/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath }
    }
  }
})

router.afterEach(() => {
  nprogress.done() // 加载进度条
})

export default router
