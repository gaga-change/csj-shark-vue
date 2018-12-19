import request from '@/utils/request'
import {stringify} from 'qs';

//修改密码接口
export function updatepassword(data) {
  return request({
    url: '/webApi/base/user/updatePwd',
    method: 'post',
    data: stringify(data)
  })
}

//获取用户信息
export function getInfo() {
  return request({
    url: '/webApi/base/user/info',
    method: 'get'
  })
}
//用户登录选择仓库后绑定选择的仓库
export function setWarehouseCode(data) {
  return request({
    url: `/webApi/base/user/setWarehouseCode?${stringify(data)}`,
    method: 'get'
  })
}




