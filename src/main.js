import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

//网络请求
import axios from 'axios'
import {get,post,patch,put} from '@/network/request.js'

//UI框架
import iView from 'iview'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'


Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$patch = patch
Vue.prototype.$put = put

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
