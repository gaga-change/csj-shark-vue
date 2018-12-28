import axios from 'axios'
import store from '@/store'
import {  MessageBox,Notification,Message } from 'element-ui'
import { LoginPath } from '@/utils'


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})
// service.interceptors.request.use(req=>{
//   console.log(req,'aaaaaaa');
//   return req
// },err => {
//   console.log(err,'reqerr');
  
//   return Promise.resolve(err)
// })
// respone拦截器
service.interceptors.response.use(
  response => {
    console.log(response,'ssssss');
    const res = response.data;
    if (res.code !== '200' && !res.success && res.code!=='success') {
      if (res.code === 'shark-512') {
        Message({type:'error',message:'登录失效，请重新登录',onClose:()=>{
          location.href = `/csj_login`
        },duration:1500})
        // MessageBox.alert('验证失败,请重新登录').then( _ => {
        //   location.href = `/csj_login`
        // }).catch(err=>{
        //   location.href = `/csj_login`
        // })
       
      }else if (res.size&&res.type) {//blob对象，目前没法直接判断类型
        return res
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
      console.log(2);
      
      return res;
    }
  },
  error => {
    console.log(error.code,'abcddddd');
    
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
