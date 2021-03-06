import { getInfo } from '@/api'
import { connectSocket } from '@/api/socket'
import { MessageBox } from 'element-ui';

const user = {
  state: {
    userInfo: null,
    company: null,
    companyId: null,
    permissionCodes: [],
    chooseWarehouse: null,
    roles: [],
    warehouseMap: [],
    todolist: null
  },

  mutations: {
    SET_USERINFO: (state, info) => {
      state.userInfo = info
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_COMPANYID: (state, id) => {
      state.companyId = id
    },
    SET_PERMISSIONCODES: (state, permissionCodes) => {
      state.permissionCodes = permissionCodes
    },
    SET_WAREHOUSE: (state, warehouse) => {
      sessionStorage.setItem('warehouse', warehouse)
      state.chooseWarehouse = warehouse
    },
    SET_WAREHOUSEENUM: (state, info) => {
      state.roles = info.roles
      state.warehouseMap = info.warehouses
      if (info && info.warehouses.length === 0) {
        MessageBox.alert('当前用户未配置仓库，请联系管理员配置后再进行登录。点击确定退出到登录页面。', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              location.href = `/login`
            }
          }
        });
      }
    },
    SET_TODOLIST: (state, todolist) => {
      state.todolist = todolist
    },
  },

  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      return getInfo().then(res => {
        if (res) {
          const data = res.data
          commit('SET_USERINFO', data)
          commit('SET_PERMISSIONCODES', data.permissionCodes || [])
          commit('SET_COMPANY', data.companyname || '')
          commit('SET_COMPANYID', data.companyid || '')
          commit('SET_WAREHOUSEENUM', data)
          connectSocket(data)
        }
        return res
      })
    },
    SetWarehouse({ commit }, warehouse) {
      commit('SET_WAREHOUSE', warehouse)
    },
    setTodolist({ commit }, todolist) {
      commit('SET_TODOLIST', todolist)
    }
  }
}



export default user
