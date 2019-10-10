/**
 *  登陆权限验证
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getCookie } from '@/utils/auth'
// import { log } from 'util';

const whiteList = ['/login'] // 不重定向白名单

/** 路由在跳转之前 进度条开启，并且判断用户是否登录，如果登录则继续加载组件，如果没有登录则是跳转到登录页面 **/
router.beforeEach((to, from, next) => {
  NProgress.start()
  store.commit('SET_ID', getCookie('jiatu_userId'))
  store.dispatch('GetInfo').then(() => {
    if (store.getters.session) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        next()
      }
    }
  }).catch(() => {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  })
})
/** 路由在跳转之后 进度条结束 **/
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
