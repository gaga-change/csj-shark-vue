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
//获取到货单列表
/**
 *
 *  "warehouseCode": "string //仓库编码",
  "orderCode": "string //收货单号",
  "orderType": "int //收货单类型 11:采购入库收货 12：销售退货入库收货",
  "orderStatus": "int //0:草稿1:待审2:审核通过3:驳回\r      一期只有 审核通过",
  "planCode": "string //入库计划单",
  "ownerCode": "string //货主",
  "ownerName": "string //货主名称",
  "providerCode": "string //供应商编码",
  "providerName": "string //供应商名称"
 * @export
 * @param {*} data
 * @returns
 */
export function getArrivalList(data) {
  return request({
    url: '/webApi/receive/order/list',
    method: 'post',
    data:data
  })
}
/**
 *新增收货单
 *
 * @export
 * @param {*} data
 * @returns
 */
export function addArrival(data) {
  return request({
    url: '/webApi/receive/order/add',
    method: 'post',
    data:data
  })
}

/**
 *新增上架单
 *
 * @export
 * @param {*} data
 * @returns
 */
export function addPutJob(data) {
  return request({
    url: '/webApi/receive/order//add',
    method: 'post',
    data:data
  })
}
//获取到货单详情
export function getArrivalDetail(data) {
  return request({
    url: `/webApi/receive/order/detailList/${stringify(data.id)}`,
    method: 'get',
    // data:data
  })
}


//获取入库列表
export function getInfoInWarehousing(data) {
  return request({
    url: `/webApi/in/list`,
    method: 'post',
    data:data
  })
}
//获取入库详情
export function getInfoDetailInWarehousing(data) {
  return request({
    url: `/webApi/in/selectBarcodePrinting?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}
//获取出库计划单列表
export function getInfoPlanOutWarehousing(data) {
  return request({
    url: `/webApi/plan/out/list`,
    method: 'post',
    data:data
  })
}
//获取出库计划单详情
export function getInfoPlanDetailOutWarehousing(data) {
  return request({
    url: `/webApi/plan/out/detail?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}
//获取出库单列表
export function getInfoOutWarehousing(data) {
  return request({
    url: `/webApi/outWarehouse/order/queryOutWarehouseOrder?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}
//获取出库单详情
export function getInfoDetailOutWarehousing(data) {
  return request({
    url: `/webApi/outWarehouse/order/queryOutWarehouseOrderList?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}
//提交入库单
export function inboundOrderSubmit(data) {
  return request({
    url: `/webApi/in/add`,
    method: 'post',
    data:data
  })
}
//一键提交入库单 
export function inboundOrderSubmitQuick(data) {
  return request({
    url: `/webApi/in/upshelf/${data.id}`,
    method: 'get',
    // data:data
  })
}
// outboundOrderSubmit
//提交出库单
export function outboundOrderSubmit(data) {
  return request({
    url: `/webApi/outWarehouse/order/addOutWarehouseOrder`,
    method: 'post',
    data:data
  })
}
//一键提交出库单 
export function outboundOrderSubmitQuick(data) {
  return request({
    url: `/webApi/outWarehouse/order/directOutOfTheLibrary`,
    method: 'post',
    data:data
  })
}
//根据商品编码货主，供应商获取批次信息
export function getBatchNo(data) {
  return request({
    url: `/webApi/basic/batch/getBatchNo?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}