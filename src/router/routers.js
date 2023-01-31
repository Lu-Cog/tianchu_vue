import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/renyuan',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'add',
        component: (resolve) => require(['@/views/member/renyuan/add'], resolve),
        name: 'add',
        meta: { title: '添加用户' }
      }
    ]
  },
  {
    path: '/qingjia',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/checking/qingjia/list'], resolve),
        name: '历史记录',
        meta: { title: '历史记录' }
      }
    ]
  },
  {
    path: '/biaojidian',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'item',
        component: (resolve) => require(['@/views/resources/biaojidian/item'], resolve),
        name: '标记点管理',
        meta: { title: '标记点管理' }
      }
    ]
  }
]

export default new Router({
  mode: 'hash',
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
