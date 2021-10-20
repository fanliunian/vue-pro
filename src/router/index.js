import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index')
  },
  {
    path: '/element',
    component: () => import('@/views/element/index')
  },
  {
    path: '/demo',
    component: () => import('@/views/demo/index')
  }
]

const createRouter = () => new Router({
  routes: constantRoutes
})

const router = createRouter()

export default router
