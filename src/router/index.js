import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/init',
  name: 'Init',
  component: () => import('@/view/init/index.vue')
},
{
  path: '/login',
  name: 'Login',
  component: () => import('@/view/login/index.vue')
},
{
  path: '/viewReport',
  name: 'ViewReport',
  // component: () => import('@/components/analysis/viewReport.vue')
  component: () => import('@/components/viewReport.vue')
},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
