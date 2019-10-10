import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import 'animate.css/animate.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import { getData } from '@/api/getData'
import * as filters from '@/utils/filters.js'
import Print from '@/utils/print.js' // 引入附件的js文件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import BaiduMap from 'vue-baidu-map'
import VueBus from 'vue-bus'
import echarts from 'echarts'
import '@/icons' // icon
import '@/permission' // permission control
import 'babel-polyfill' // ie兼容模块

Vue.use(VueBus)
Vue.use(VueQuillEditor)
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(Print)
Vue.use(BaiduMap, {
  ak: 'YjOy0eqhX1nDPLziRi38G0NF7fOPwrVr'
})

Vue.config.productionTip = false

Vue.prototype.getData = getData
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
  el: '#app',
  router,
  store,
  getData,
  render: h => h(App)
})
