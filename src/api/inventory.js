import request from '@/utils/request'
import {stringify} from 'qs';


export function getInfoInventory(data) {
  return request({
    url: `/webApi/sku/stock/querySkuStock?${stringify(data)}`,
    method: 'get',
  })
}
export function getInfoOnPageInventory(data) {
  return request({
    url: `/webApi/sku/stock/querySkuStockList?${stringify(data)}`,
    method: 'get',
  })
}

export function querySkuStockRecord(data) {
  return request({
    url: `/webApi/sku/stock/querySkuStockRecord?${stringify(data)}`,
    method: 'get',
  })
}
export function querySkuStockByOutJobId(data) {
  return request({
    url: `/webApi/sku/stock/querySkuStockByOutJobId?${stringify(data)}`,
    method: 'get',
  })
}

//导出库位库存
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


/**
 *删除库位
 *
 * @export
 * @param {*} data
 * id	int	false	
 * @returns
 */
export function deleteInventorySite(data) {
  return request({
    url: `/webApi/basic/warehouseSpace/delete/${data.id}`,
    method: 'get',
    // data:data
  })
}

/**
  *
  * 库区列表
  * @export
  * @param {*} data
  *  "warehouseAreaCode": "string //库区编码",
  "warehouseAreaName": "string //库区名称",
  "warehouseCode": "string //仓库编码",
  "isVirtual": "int //是否虚拟库区\r      0:否 1:是",
  "warehouseAreaNature": "int //库区性质:\r      1:存储区 2:残次品区 3:退货区",
  "warehouseAreaStatus": "int //库区状态:\r      0：启用 1：禁用",
  "warehouseAreaDesc": "string //库区描述"
  * @returns
  */
 export function getInventoryArea(data) {
  return request({
    url: `/webApi/basic/warehouseArea/select`,
    method: 'post',
    data:data
  })
}

/**
 *新增库区
 * "warehouseAreaCode": "string //库区编码",
  "warehouseAreaName": "string //库区名称",
  "warehouseCode": "string //仓库编码",
  "isVirtual": "int //是否虚拟库区\r      0:否 1:是",
  "warehouseAreaNature": "int //库区性质:\r      1:存储区 2:残次品区 3:退货区",
  "warehouseAreaStatus": "int //库区状态:\r      0：启用 1：禁用",
  "warehouseAreaDesc": "string //库区描述"
 * @export
 * @param {*} data
 * @returns
 */
export function addInventoryArea(data) {
  return request({
    url: `/webApi/basic/warehouseArea/add`,
    method: 'post',
    data:data
  })
}

/**
 *修改库区
 *
 * @export
 * @param {*} data
 *  "warehouseAreaCode": "string //库区编码",
  "warehouseAreaName": "string //库区名称",
  "warehouseCode": "string //仓库编码",
  "isVirtual": "int //是否虚拟库区\r      0:否 1:是",
  "warehouseAreaNature": "int //库区性质:\r      1:存储区 2:残次品区 3:退货区",
  "warehouseAreaStatus": "int //库区状态:\r      0：启用 1：禁用",
  "warehouseAreaDesc": "string //库区描述"
 * @returns
 */
export function updateInventoryArea(data) {
  return request({
    url: `/webApi/basic/warehouseArea/update`,
    method: 'post',
    data:data
  })
}

/**
 *删除库区
 *
 * @export
 * @param {*} data
 * id	int	false	
 * @returns
 */
export function deleteInventoryArea(data) {
  return request({
    url: `/webApi/basic/warehouseArea/delete/${data.id}`,
    method: 'get',
    // data:data
  })
}

export function getSelectInventoryAreaList(data) {
  return request({
    url: `/webApi/basic/warehouseArea/selectList?${stringify(data)}`,
    method: 'get',
    // data:data
  })
}

export function selectSumSkuQty(data) {
  return request({
    url: `/webApi/sku/stock/selectSumSkuQty?${stringify(data)}`,
    method: 'get',
  })
}




