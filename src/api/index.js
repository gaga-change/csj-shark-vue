import http from './http'
import axios from 'axios'

//导出库位库存
export const exportLedger = parmas => axios({
  method: 'get',
  url: `/webApi/sku/stock/exportLedger`,
  parmas,
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json'
  }
})

/** 物流公司列表 */
export const getLogisticsList = params => http.get(`/webApi/logistics/basic/list`, { params })
/** 物流公司下拉列表 */
export const getLogisticsSelectList = params => http.get(`/webApi/logistics/basic/select/list`, { params })
/** 物流公司下拉列表 */
export const getLogisticsSearch = params => http.get(`/webApi/logistics/company/search/${params.companyName}`)
/** 物流登记列表 */
export const getLogisticsRegisterList = params => http.get(`/webApi/logistics/register/list`, { params })
/** 获取物流信息 */
export const getLogisticsRegisterInfo = params => http.get(`/webApi/logistics/register/getLogisticsInfo`, { params })
/** 获取用户信息 */
export const getInfo = params => http.get(`/webApi/base/user/info`, { params })
/** 用户登录选择仓库后绑定选择的仓库 */
export const setWarehouseCode = params => http.get(`/webApi/base/user/setWarehouseCode`, { params })
/** 获取代办 */
export const todolist = params => http.get(`/webApi/front/index/statistics`, { params })
export const getInfoInventory = params => http.get(`/webApi/sku/stock/querySkuStock`, { params })
export const getInfoOnPageInventory = params => http.get(`/webApi/sku/stock/querySkuStockList`, { params })
export const querySkuStockRecord = params => http.get(`/webApi/sku/stock/querySkuStockRecord`, { params })
export const querySkuStockByOutJobId = params => http.get(`/webApi/sku/stock/querySkuStockByOutJobId`, { params })
/** 删除库位 */
export const deleteInventorySite = params => http.post(`/webApi/basic/warehouseSpace/delete/${params.id}`)
/** 删除库区 */
export const deleteInventoryArea = params => http.get(`/webApi/basic/warehouseArea/delete/${params.id}`, { params })
export const getSelectInventoryAreaList = params => http.get(`/webApi/basic/warehouseArea/selectList`, { params })
export const selectSumSkuQty = params => http.get(`/webApi/sku/stock/selectSumSkuQty`, { params })
/** 获取入库计划详情 */
export const getInfoDetailWarehousing = params => http.get(`/webApi/plan/in/detail`, { params })
/** 获取到货单详情 */
export const getArrivalDetail = params => http.get(`/webApi/receive/order/detailList`, { params })
/** 获取入库详情 */
export const getInfoDetailInWarehousing = params => http.get(`/webApi/in/selectBarcodePrinting`, { params })
/** 获取出库计划单详情 */
export const getInfoPlanDetailOutWarehousing = params => http.get(`/webApi/plan/out/detail`, { params })
/** 获取出库单列表 */
export const getInfoOutWarehousing = params => http.get(`/webApi/outWarehouse/order/queryOutWarehouseOrder`, { params })
/** 获取出库单详情 */
export const getInfoDetailOutWarehousing = params => http.get(`/webApi/outWarehouse/order/queryOutWarehouseOrderList`, { params })
/** 一键提交入库单 */
export const inboundOrderSubmitQuick = params => http.get(`/webApi/in/upshelf/${params.id}`, { params })
/** 根据商品编码货主，供应商获取批次信息 */
export const getBatchNo = params => http.get(`/webApi/basic/batch/getBatchNo`, { params })
/** 查询明细列表 */
export const orderDetailList = id => http.get(`/webApi/receive/order/detailList/${id}`)
/** 修改收货数量 */
export const orderUpdateReceiveQty = params => http.get(`/webApi/receive/order/updateReceiveQty`, { params })
/** 删除单据 */
export const receiveOrderDelete = id => http.get(`/webApi/receive/order/delete/${id}`)
/** 根据条件查询库位 */
export const warehouseSpaceSelect = params => http.get(`/webApi/basic/warehouseSpace/list`, { params })
/** 根据入库单号查询详情列表 */
export const inOrderSelectDetailList = id => http.get(`/webApi/in/order/selectDetailList/${id}`)
/** 查询拣货单列表 */
export const pickOrderList = params => http.get(`/webApi/pick/order/list`, { params })
/** 查询出库暂存列表 */
export const selectOutWarehouseJobDetail = params => http.get(`/webApi/outWarehouse/job/selectOutWarehouseJobDetail`, { params })
/** 根据拣货单id获取拣货单详情信息 */
export const pickOrderDetail = id => http.get(`/webApi/pick/order/detail/${id}`)
/** 获取所有计划单号 */
export const outcodelist = params => http.get(`/webApi/outWarehouse/job/selectPlanCodeList`, { params })
/** 修改库位状态接口 */
export const warehouseSpaceUpdateLockStatus = (id, params) => http.get(`/webApi/basic/warehouseSpace/updateLockStatus/${id}`, { params })
/** 修改库区状态接口 */
export const warehouseAreaUpdateLockStatus = (id, params) => http.get(`/webApi/basic/warehouseArea/updateLockStatus/${id}`, { params })
/** 开单获取商品 */
export const planInventoryQuerysSkuStockList = params => http.get(`/webApi/plan/inventory/querysSkuStockList`, { params })
/** 分页查询盘点单列表 */
export const planInventoryList = params => http.get(`/webApi/plan/inventory/list`, { params })

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
/** 增加物流公司 */
export const addLogistics = params => http.post(`/webApi/logistics/add`, params)
/** 修改物流公司 */
export const updateLogistics = params => http.put(`/webApi/logistics/update`, params)
/** 删除物流公司 */
export const deleteLogistics = params => http.delete(`/webApi/logistics/delete/${params.id}`)
/** 物流登记信息新增 */
export const addLogisticsRegister = params => http.put(`/webApi/logistics/register/register`, params)
/** 修改密码接口 */
export const updatepassword = params => http.post(`/webApi/base/user/updatePwd`, params)
/** 库区列表 */
export const getInventoryArea = params => http.post(`/webApi/basic/warehouseArea/select`, params)
/** 新增库区 */
export const addInventoryArea = params => http.post(`/webApi/basic/warehouseArea/add`, params)
/** 修改库区 */
export const updateInventoryArea = params => http.post(`/webApi/basic/warehouseArea/update`, params)
/** 获取到货单列表 */
export const getArrivalList = params => http.post(`/webApi/receive/order/list`, params)
/** 新增收货单 */
export const orderAdd = params => http.post(`/webApi/receive/order/add`, params)
/** 获取入库列表 */
export const getInfoInWarehousing = params => http.post(`/webApi/in/list`, params)
/** 更改打印状态 */
export const modifyPrintState = params => http.post(`/webApi/plan/in/print`, params)
/** 更改出库打印状态 */
export const modifyOutPrint = params => http.post(`/webApi/plan/out/print`, params)
/** 获取出库计划单列表 */
export const getInfoPlanOutWarehousing = params => http.post(`/webApi/plan/out/list`, params)
/** 提交出库单 */
export const outboundOrderSubmit = params => http.post(`/webApi/outWarehouse/order/addOutWarehouseOrder`, params)
/** 一键提交出库单 */
export const outboundOrderSubmitQuick = params => http.post(`/webApi/outWarehouse/order/directOutOfTheLibrary`, params)
/** 查询到货单列表 */
export const orderList = params => http.post(`/webApi/receive/order/list`, params)
/** 新增上架任务 */
export const jobAdd = params => http.post(`/webApi/in/job/add`, params)
/** 查询收货单列表 */
export const jobList = params => http.post(`/webApi/in/job/list`, params)
/** 添加入库单以及明细 */
export const inOrderAdd = params => http.post(`/webApi/in/order/add`, params)
/** 查询入库单列表 */
export const inOrderList = params => http.post(`/webApi/in/order/list`, params)
/** 新增拣货单 */
export const pickOrderAdd = params => http.post(`/webApi/pick/order/add`, params)
/** 拣货确认 */
export const orderPickConfirm = params => http.post(`/webApi/pick/order/pickConfirm`, params)
/** 删除拣货单 */
export const orderDelete = id => http.delete(`/webApi/pick/order/delete/${id}`)
/** 拣货终止 */
export const orderPickStop = id => http.post(`/webApi/pick/order/pickStop/${id}`)
/** 根据拣货任务生成出库单 */
export const createOutWareHouseOrder = params => http.post(`/webApi/outWarehouse/order/createOutWareHouseOrder`, params)
/** 根据出库计划单号列表删除出库作业 */
export const deleteByIds = params => http.delete(`/webApi/outWarehouse/job/deleteByIds`, { params })
/** 确认出库 */
export const confirmOutOfTheLibrary = params => http.post(`/webApi/outWarehouse/order/confirmOutOfTheLibrary`, params)
/** 取消出库 */
export const cancelOutOfTheLibrary = params => http.post(`/webApi/outWarehouse/order/cancelOutOfTheLibrary`, params)
/** 获取残次品列表 */
export const badproductlist = params => http.post(`/webApi/receive/order/bad/list`, params)
/** 库存移库 */
export const skuStockMove = params => http.post(`/webApi/sku/stock/stockMove`, params)
/** 状态转移 */
export const skuStockWriteCheckResult = params => http.post(`/webApi/sku/stock/writeCheckResult`, params)
/** 修改库位 */
export const basicWarehouseSpaceUpdate = params => http.post(`/webApi/basic/warehouseSpace/update`, params)
/** 盘点开单 */
export const insertInventoryOrder = params => http.post(`/webApi/plan/inventory/insertInventoryOrder`, params)
