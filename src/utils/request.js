import axios from 'axios'
import store from '@/store'
import {  MessageBox,Notification } from 'element-ui'
import { LoginPath } from '@/utils'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== '200' && !res.success && res.code!=='success') {
      if (res.code === '512') {
        MessageBox.alert('验证失败,请重新登录').then(_ => {
          location.href = `/csj_login`
        })
      } else {
        let message=res.message||res.errorMsg||'';
        if(message=='用户未登录'){
          location.href = `/csj_login`
        }
        Notification({
          title:'错误信息',
          message:message,
          type: 'error',
          duration:5*1000
        })
      }
      return Promise.reject(res)
    } else {
      return res;
    }
  },
  error => {
    let message=error.message||err.errorMsg||''
    if(message=='用户未登录'){
      location.href = `/csj_login`
    }
    Notification({
      title:'错误信息',
      message: message,
      type: 'error',
      duration:5*1000,
      onClose:()=> Promise.reject(error)
      
    })
  }
)

export default service
