import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',     //使用history模式，不会像hash命名url时多个#
  base: '/monitor/',   
  routes: [
    {                      //默认路径
      path: '/',
      redirect: '/user'
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/login'),
      children: [
        {
          path: 'signIn',
          component: () => import('@/components/common/loginBoard/signInBoard.vue')
        },
        {
          path: 'register',
          component: () => import('@/components/common/loginBoard/registerBoard.vue')
        }
      ]
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/main'),
      children: [
        {
          path: 'area',
          component: () => import('@/components/content/area.vue')
        },
        {
          path: 'room',
          component: () => import('@/components/content/room.vue')
        },
      ]
    }
  ]
})
