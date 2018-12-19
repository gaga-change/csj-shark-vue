import request from '@/utils/request'
import {stringify} from 'qs';


//获取入库计划列表
export function getInfoWarehousing(data) {
  return request({
    url: 'webApi/plan/in/list',
    method: 'post',
    data:data
  })
}
//获取入库计划详情
export function getInfoDetailWarehousing(data) {
  return request({
    url: `webApi/plan/in/detail?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}



