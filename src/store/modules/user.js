import { getInfo } from '@/api'
import { MessageBox, Notification } from 'element-ui';
import io from 'socket.io-client'

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
              location.href = `/csj_logout`
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

function connectSocket(user) {
  /** 发布环境 - 监听版本更新 */
  const { truename: username, email } = user
  if (process.env.NODE_ENV !== "development") {
    let nowVersion = process.env.IMAGE_TAG
    const roomName = location.hostname
    // const roomName = 'shark.csjmro.com'
    const socket = io('http://csj-center-egg-v2.shop.csj361.com/user', {
      // 实际使用中可以在这里传递参数
      query: {
        room: roomName,
        userId: user.id + '#' + email,
        username,
        version: process.env.IMAGE_TAG
      }
    })
    /** 监听在线人数 */
    socket.on('online', msg => {
      const res = {}
      let { clients } = msg
      clients.forEach(item => {
        if (res[item.userId]) {
          res[item.userId].clientNum++
        } else {
          res[item.userId] = { ...item, clientNum: 1 }
        }
      })
      let str = Object.keys(res).map(key => {
        let user = res[key]
        return `${user.username}[${user.clientNum}]`
      }).join('、')
      console.log(`%c===== 当前在线人员，临时打印（用户名[客户端数量]）${new Date().toLocaleString()} ====`, 'background-color: #42b983;color: #fff;')
      console.log('%c' + str, 'color:blue')
    })
    /** 监听改域名的版本通知 */
    socket.on('exchange', msg => {
      const { data } = msg
      const { action, payload } = data
      if (action === 'version update' && payload.version) {
        if (nowVersion !== payload.version) {
          nowVersion = payload.version
          update(nowVersion)
        }
      }
    });
    function update(v) {
      Notification({
        title: '提示',
        message: `当前系统版本更新，刷新页面获取最新内容！当前版本：${process.env.IMAGE_TAG}，最新版本：${v}`,
        duration: 0
      });
    }
  }
}

export default user
