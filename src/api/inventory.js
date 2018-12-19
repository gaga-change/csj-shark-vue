import request from '@/utils/request'
import {stringify} from 'qs';
import axios from 'axios'

//获取入库计划列表 getInfoInventory,exportLedger
export function getInfoInventory(data) {
  return request({
    url: `/webApi/sku/stock/querySkuStock?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}
//获取入库计划详情
export function exportLedger(data) {
  return request({
    url: `/webApi/sku/stock/exportLedger?${stringify(data)}`,
    method: 'get',
    responseType:'blob',
    headers: {
        'Content-Type': 'application/json'
    },
    // data:data
  })
}



