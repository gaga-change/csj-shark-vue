import http from './http'

/** 修改库位状态 */
export const updateInventorySite = params => http.get(`/webApi/basic/warehouseSpace/updateLockStatus/${params.id}`, {params})

// export const temp = params => http.get(`temp`, {params})

/** 获取入库计划列表 */
export const getInfoWarehousing = params => http.post(`/webApi/plan/in/list`, params)
/** 新增库位
 * "warehouseAreaCode": "string //库区编码",
  "platoonStart": "int //库位排号 开始位置",
  "platoonEnd": "int //库位排号 结束位置",
  "columnStart": "int //库位列号 开始位置",
  "columnEnd": "int //库位列号 结束位置",
  "floorStart": "int //库位层号 开始位置",
  "floorEnd": "int //库位层号 结束位置"
 */
export const addInventorySite = params => http.post(`/webApi/basic/warehouseSpace/addByBatch`, params)
/** 库位列表 */
export const getInventorySite = params => http.post(`/webApi/basic/warehouseSpace/select`, params)

// export const temp = params => http.post(`temp`, params)
