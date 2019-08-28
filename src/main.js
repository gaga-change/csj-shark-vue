import Vue from 'vue'
import ElementUI from 'element-ui'
import moment from 'moment'
import ItemTitle from '@/components/ItemTitle/index'
import ItemCard from '@/components/ItemCard/index'
import BarCode from '@/components/BarCode/index'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import BaseTable from '@/components/BaseTable'
import SearchForm from '@/components/SearchForm'
import BaseList from '@/components/BaseList'
import DoubleList from '@/components/DoubleList'
import PrintTableDialog from '@/components/PrintTableDialog'
import DetailItem from '@/components/DetailItem'

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
Vue.component('SearchForm', SearchForm);
Vue.component('BaseList', BaseList);
Vue.component('DoubleList', DoubleList);
Vue.component('PrintTableDialog', PrintTableDialog);
Vue.component('DetailItem', DetailItem);
Vue.prototype.$apiConfirm = (msg, api) => MessageBox.confirm(msg || '此操作将永久删除该行, 是否继续?', '提示', {
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
})

Vue.filter('date', function (value, format) {
  if (!value) return ''
  return moment(value).format(format || "YYYY-MM-DD HH:mm:ss")
})

Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(EXTENDS)
Vue.use(ItemTitle);
Vue.use(ItemCard);
Vue.use(BarCode);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
