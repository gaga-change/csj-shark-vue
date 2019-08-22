import Vue from 'vue'
import ElementUI from 'element-ui'
import ItemTitle from '@/components/ItemTitle/index'
import ItemCard from '@/components/ItemCard/index'
import TabLabel from '@/components/TabLabel/index'
import BarCode from '@/components/BarCode/index'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import BaseTable from '@/components/Table'
import BaseTable2 from '@/components/BaseTable2'
import SearchForm2 from '@/components/SearchForm2'
import BaseList from '@/components/BaseList'
import SearchForm from '@/components/SearchForm/index'

import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import App from './App'
import router from './router'
import store from './store'

import '@/icons'
import '@/permission'

import { EXTENDS } from './assets/extends'
const { MessageBox } = ElementUI
Vue.component('BaseTable', BaseTable);
Vue.component('BaseTable2', BaseTable2);
Vue.component('SearchForm', SearchForm);
Vue.component('SearchForm2', SearchForm2);
Vue.component('BaseList', BaseList);
Vue.prototype.$delConfirm = (msg, api) => MessageBox.confirm(msg || '此操作将永久删除改行, 是否继续?', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning',
  beforeClose: (action, instance, done) => {
    if (action === 'confirm') {
      instance.confirmButtonLoading = true
      api().then(() => {
        done()
        setTimeout(() => {
          instance.confirmButtonLoading = false
        }, 300)
      })
    } else {
      done()
    }
  }
}).then(() => {
}).catch(() => { })

Vue.use(ElementUI, { locale, size: 'mini' })
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
