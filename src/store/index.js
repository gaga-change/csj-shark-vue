import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import map from './modules/map'
import tagsView from './modules/tagsView'
import getters from './getters'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    map
  },
  getters
})

export default store
