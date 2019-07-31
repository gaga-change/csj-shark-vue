import axios from 'axios'
import {
  Notification,
  Message
} from 'element-ui'

let newAxios = axios.create({
  timeout: 15000 // 请求超时时间
})

// 响应拦截器
newAxios.interceptors.response.use(function (response) {
  let data = response.data
  // 系统异常提示（返回的数据为 null）
  if (data.code === 'user-not-login') {
    Message({
      type: 'error',
      message: '登录失效，请重新登录',
      onClose: () => {
        sessionStorage.setItem('warehouse', '')
        location.href = `/csj_login`
      },
      duration: 1500
    })
    data = null
  } else if (data.code !== '200') {
    let message = data.message || data.errorMsg || ''
    Message({
      type: 'error',
      message: message || '系统异常',
      duration: 3000
    })
    data = null
  }
  return data
}, function (error) {
  let message = error.message || err.errorMsg || ''
  if (message = 'timeout of 1500ms exceeded') message = '请求超时，请稍后再试！'
  Notification({
    title: '错误信息',
    message: message,
    type: 'error',
    duration: 5000,
  })
  return Promise.reject(error)
})


const http = {
  get(...params) {
    return newAxios.get(...params).then(res => res).catch(err => null)
  },
  post(...params) {
    return newAxios.post(...params).then(res => res).catch(err => null)
  },
  delete(...params) {
    return newAxios.delete(...params).then(res => res).catch(err => null)
  },
  put(...params) {
    return newAxios.put(...params).then(res => res).catch(err => null)
  }
}

export default http
