import Vue from 'vue'
import App from './App'
import Filters from '@/filter/filter.js'
import store from './store/index.js'

Vue.config.productionTip = false
Vue.use(Filters)
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
console.log('app', Vue);
app.$mount() //挂载 Vue 实例
