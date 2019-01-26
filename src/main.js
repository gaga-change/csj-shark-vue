import Vue from 'vue'
import ElementUI from 'element-ui'
import ItemTitle from '@/components/ItemTitle/index' 
import ItemCard from '@/components/ItemCard/index' 
import TabLabel from '@/components/TabLabel/index' 
import BarCode from '@/components/BarCode/index' 
import locale from 'element-ui/lib/locale/lang/zh-CN'

import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import App from './App'
import router from './router'
import store from './store'

import '@/icons' 
import '@/permission' 

import { EXTENDS } from './assets/extends'

Vue.use(ElementUI, { locale })
Vue.use(EXTENDS)
Vue.use(ItemTitle);  
Vue.use(ItemCard);  
Vue.use(TabLabel); 
Vue.use(BarCode);  

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
