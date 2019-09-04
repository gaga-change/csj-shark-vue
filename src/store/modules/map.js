import { enumsTotal } from '@/api'
const map = {
  state: {
    mapConfig: {},
  },
  mutations: {
    SET_MAP: (state, config) => {
      state.mapConfig = config
    },
  },

  actions: {
    // 获取枚举信息
    gitMap({ commit, state }) {
      config().then(res => {
        commit('SET_MAP', res);
      })
    }
  }
}

async function config() {
  let config = {};
  const data = await enumsTotal()
  data.forEach(v => {
    config[v.name] = v.keyValue
  })
  return config
}

export default map
