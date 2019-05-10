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

//更改打印状态
export function modifyPrintState(data) {
  return request({
    url: '/webApi/plan/in/print',
    method: 'post',
    data: data
  })
}

//更改出库打印状态
export function modifyOutPrint(data) {
  return request({
    url: '/webApi/plan/out/print',
    method: 'post',
    data: data
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
//新增收货单
export function orderAdd(data) {
  return request({
    url: `/webApi/receive/order/add`,
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
  })
}

//查询到货单列表 
export function orderList(data) {
  return request({
    url: `/webApi/receive/order/list`,
    method: 'post',
    data:data
  })
}

//查询明细列表
export function orderDetailList(data) {
  return request({
    url: `/webApi/receive/order/detailList/${data}`,
    method: 'get',
  })
}

//修改收货数量
export function orderUpdateReceiveQty(data) {
  return request({
    url: `/webApi/receive/order/updateReceiveQty?${stringify(data)}`,
    method: 'get',
  })
}

//删除单据
export function receiveOrderDelete(data) {
  return request({
    url: `/webApi/receive/order/delete/${data}`,
    method: 'get',
  })
}


//根据条件查询库位
export function warehouseSpaceSelect() {
  return request({
    url: `/webApi/basic/warehouseSpace/list`,
    method: 'get',
  })
}


//新增上架任务
export function jobAdd(data) {
  return request({
    url: `/webApi/in/job/add`,
    method: 'post',
    data:data
  })
}

//上架并入库
export function jobAddIn(data) {
  return request({
    url: `/webApi/in/job/addAndOrder`,
    method: 'post',
    data:data
  })
}

//查询收货单列表
export function jobList(data) {
  return request({
    url: `/webApi/in/job/list`,
    method: 'post',
    data:data
  })
}

//添加入库单以及明细
export function inOrderAdd(data) {
  return request({
    url: `/webApi/in/order/add`,
    method: 'post',
    data:data
  })
}

//查询入库单列表
export function inOrderList(data) {
  return request({
    url: `/webApi/in/order/list`,
    method: 'post',
    data:data
  })
}

//根据入库单号查询详情列表
export function inOrderSelectDetailList(orderId) {
  return request({
    url: `/webApi/in/order/selectDetailList/${orderId}`,
    method: 'get',
  })
}

//新增拣货单
export function pickOrderAdd(data) {
  return request({
    url: `/webApi/pick/order/add`,
    method: 'post',
    data:data
  })
}

//查询拣货单列表
export function pickOrderList(data) {
  return request({
    url: `/webApi/pick/order/list?${stringify(data)}`,
    method: 'get',
  })
}

//查询出库暂存列表
export function selectOutWarehouseJobDetail(data) {
  return request({
    url: `/webApi/outWarehouse/job/selectOutWarehouseJobDetail?${stringify(data)}`,
    method: 'get',
  })
}


//根据拣货单id获取拣货单详情信息
export function pickOrderDetail(id) {
  return request({
    url: `/webApi/pick/order/detail/${id}`,
    method: 'get',
  })
}

//拣货确认
export function orderPickConfirm(data) {
  return request({
    url: `/webApi/pick/order/pickConfirm`,
    method: 'post',
    data:data
  })
}


//删除拣货单
export function orderDelete(pickOrderId) {
  return request({
    url: `/webApi/pick/order/delete/${pickOrderId}`,
    method:'delete',
  })
}

//拣货终止
export function orderPickStop(pickOrderId) {
  return request({
    url: `/webApi/pick/order/pickStop/${pickOrderId}`,
    method:'post',
  })
}

//根据拣货任务生成出库单
export function createOutWareHouseOrder(data) {
  return request({
    url: `/webApi/outWarehouse/order/createOutWareHouseOrder`,
    method:'post',
    data:data
  })
}

//根据出库计划单号列表删除出库作业
export function deleteByIds(data) {
  return request({
    url: `/webApi/outWarehouse/job/deleteByIds`,
    method:'delete',
    data:data
  })
}

//确认出库
export function confirmOutOfTheLibrary(data) {
  return request({
    url: `/webApi/outWarehouse/order/confirmOutOfTheLibrary`,
    method:'post',
    data:data
  })
}

//取消出库
export function cancelOutOfTheLibrary(data) {
  return request({
    url: `/webApi/outWarehouse/order/cancelOutOfTheLibrary`,
    method:'post',
    data:data
  })
}


//到货并入库
export function receiveAndInStock(data) {
  return request({
    url: `/webApi/receive/order/receiveAndInStock`,
    method:'post',
    data:data
  })
}

//获取残次品列表
export function badproductlist(data) {
  return request({
    url: `/webApi/receive/order/bad/list`,
    method:'post',
    data:data
  })
}

//获取所有计划单号
export function outcodelist() {
  return request({
    url: `/webApi/outWarehouse/job/selectPlanCodeList`,
    method:'get'
  })
}