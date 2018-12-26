import { getInfo} from '@/api/login'

const user = {
  state: {
    userInfo: null,
    company: null,
    companyId: null,
    permissionCodes: [],
    chooseWarehouse: null,
    roles:[],
    warehouseMap: [],
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
    SET_WAREHOUSE: (state,warehouse) => {
      sessionStorage.setItem('warehouse',warehouse)
      state.chooseWarehouse = warehouse
    },
    SET_WAREHOUSEENUM:(state,info) => {
      state.roles = info.roles
      state.warehouseMap = info.warehouses
      //后台已控制.filter(item=> state.roles.includes(item.warehouseNo))
    }
  },

  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data;
          if(!data){
              reject(response) 
          }
          commit('SET_USERINFO', data)
          commit('SET_PERMISSIONCODES', data.permissionCodes||[])
          commit('SET_COMPANY', data.companyname||'')
          commit('SET_COMPANYID', data.companyid||'')
          commit('SET_WAREHOUSEENUM',data)
          resolve(response)
        }).catch(error => {
      
          reject(error)
        })
      })
    },
    SetWarehouse({commit},warehouse){
      commit('SET_WAREHOUSE',warehouse)
    }
  }
}

export default user
