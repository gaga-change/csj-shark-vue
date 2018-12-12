import { getInfo} from '@/api/login'

const user = {
  state: {
    userInfo: null,
    company: null,
    companyId: null,
    permissionCodes: []
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
          resolve(response)
        }).catch(error => {
      
          reject(error)
        })
      })
    }
  }
}

export default user
