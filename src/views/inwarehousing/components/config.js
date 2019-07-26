export const planTableConfig = [// 计划单列表
  { label: '下单时间', width: 140, prop: 'gmtCreate', type: 'time' },
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 130 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '商品总数', prop: 'inPlanQty', minWidth: 90 },
  { label: '入库状态', prop: 'execStatus', useLocalEnum: true, type: 'ExecStatusEnum', minWidth: 120 },
  { label: '收货状态', prop: 'receiveStatus', useLocalEnum: true, type: 'receiveState', minWidth: 120 },
  { label: '制单人', prop: 'createrName', minWidth: 90 },
  { label: '已入库数量', prop: 'inQty', width: 85 },
]

export const printplanTableConfig = [// 计划单列表
  { label: '下单时间', width: 140, prop: 'gmtCreate', type: 'time' },
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 130 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '商品总数', prop: 'inPlanQty', minWidth: 90 },
  { label: '入库状态', prop: 'execStatus', useLocalEnum: true, type: 'ExecStatusEnum', minWidth: 120 },
  { label: '收货状态', prop: 'receiveStatus', useLocalEnum: true, type: 'receiveStatusEnum', minWidth: 120 },
  { label: '制单人', prop: 'createrName', minWidth: 90 },
  { label: '应入/已入', prop: 'printplanReal', minWidth: 90 },
  { label: '打印状态', prop: 'isPrint', useLocalEnum: true, type: 'printState', minWidth: 90 },
]

// flowChildTableConfig
export const planChildTableConfig = [// 计划单子列表
  { label: '业务行号', prop: 'busiIndex', minWidth: 80 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 120 },
  { label: '商品数量', prop: 'planInQty', minWidth: 120 },
  { label: '入库数量', prop: 'realInQty', minWidth: 120 },
  { label: '收货数量', prop: 'hasReceiveQty', minWidth: 120 },
]

export const businessChildTableEditConfig = [// 计划单操作列表
  { label: '业务行号', prop: 'busiIndex', minWidth: 80 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 120 },
  { label: '入库数量', prop: 'realInQty' },
  { label: '商品数量', prop: 'planInQty' },
  { label: '收货数量', prop: 'hasReceiveQty' },
  { label: '正品数量(自动计算)', prop: 'receiveQty', width: 180 }
]

export const planChildTableLabelConfig = [// 计划单商品条码打印列表
  { label: '业务行号', prop: 'busiIndex', minWidth: 80 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '入库数量', prop: 'realInQty', minWidth: 120 },
  { label: '批次', prop: 'batchNo', minWidth: 120 },
  { label: '打印条数', prop: 'printNum', width: 200, editable: true, editType: 'inputNumber', fixed: 'right', max: 100 },//unconfirm 
]

export const planChildTablePrintConfig = [// 计划单打印列表
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 100 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '应入/已入', prop: 'planReal', width: 100 },
  { label: '条形码', prop: 'planCode', width: 150, userIf: 'images' },
]

export const inTableConfig = [// 入库列表
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '入库单号', prop: 'orderCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 90 },
  { label: '入库时间', width: 120, prop: 'gmtModify', type: 'time' },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '单据状态', prop: 'orderStatus', useLocalEnum: true, type: 'OrderStatusEnum', width: 90 },
  { label: '操作人', prop: 'modifierName', minWidth: 90 },
]

export const inChildTableConfig = [// 入库子列表
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '入库数量', prop: 'realInQty', minWidth: 120 },
  { label: '批次', prop: 'batchNo', minWidth: 120 },

]

export const arrivalTableConfig = [// 收货单列表 unconfirmed
  { label: '计划单号', prop: 'planCode' },
  { label: '供应商', prop: 'providerName' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '残次品数量', prop: 'badReceiveQty' },
  { label: '入库数量', prop: 'badRealInQty' },
  { label: '发生时间', prop: 'gmtModify', type: 'time' },
  { label: '状态', prop: 'execStatus', useLocalEnum: true, type: 'badStatuslist' },
  { label: '操作', useDom: true, width: 100 },
]

export const arrivalConfig = [// 收货单列表 unconfirmed
  { label: '收货单号', prop: 'orderCode' },
  { label: '计划单号', prop: 'planCode' },
  { label: '上架状态', prop: 'execStatus', useLocalEnum: true, type: 'execStatuslist' },
  { label: '收货时间', prop: 'gmtCreate', type: 'time' },
  { label: '单据类型', prop: 'orderType', useLocalEnum: true, type: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
]


// flowChildTableConfig
export const arrivalChildTableConfig = [// 收货单子列表 unconfirmed
  { label: '业务行号', prop: 'busiIndex', },
  { label: '商品编码', prop: 'skuCode', },
  { label: '商品名称', prop: 'skuName', },
  { label: '规格型号', prop: 'skuFormat', },
  { label: '单位', prop: 'skuUnitName', },
  { label: '商品数量', prop: 'planQty', },
  { label: '批次', prop: 'batchNo', },
  { label: '收货数量', prop: 'receiveQty', editable: true },
  { label: '已入库数量', prop: 'realInQty', width: 85 },
]


export const arrivalAlertConfig = [
  { label: '序号', type: 'index', width: 50 },
  { label: '商品编号', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '商品规格', prop: 'skuFormat' },
  { label: '批次', prop: 'batchNo' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '总数量', prop: 'planQty' },
  { label: '已入库', prop: 'realInQty' },
  { label: '收货量', prop: 'receiveQty' },
  { label: '上架量/货位', width: 100, dom: formatWareHousing() },
  { label: '操作', useLink: true, fixed: 'right', width: 180 },
]

export const putQtyConfig = [
  { label: '序号', type: 'index', width: 50 },
  { label: '批次', prop: 'batchNo', width: 100 },
  { label: '库位(编码)', prop: 'warehouseSpaceCode' },
  { label: '上架数量', prop: 'putQty' },
]

export const batchNoConfig = [
  { label: '序号', type: 'index', width: 50 },
  { label: '批次', prop: 'batchNo' },
  { label: '正品数量', prop: 'receiveQty', width: 200 },
]

function formatWareHousing() {
  return (row, column, cellValue, index) => {
    let str = '';
    row['warehousingArr'].forEach(item => {
      str += item.putQty + '/' + item.warehouseSpaceCode + ' , '
    })
    return str.slice(0, -1)
  }
}

function Storehouse() {
  return (row, column, cellValue, index) => {
    let str = '';
    row['putSpaceInfoVOList'].forEach(item => {
      str += item.warehouseSpaceCode + ' , '
    })
    return str.slice(0, -1)
  }
}

export const recordListConfig = [
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '收货单', prop: 'receiveOrderCode', width: 130 },
  { label: '已生成入库单', type: 'Boolean', prop: 'isCreateOrder' },
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '上架时间', type: 'time', prop: 'gmtCreate', width: 120, format: 'YYYY-MM-DD  HH:mm' },
  { label: '上架数量', prop: 'jobQty', editable: true },
  { label: '操作人', prop: 'createrName' },
]


export const inPushOrderConfig = [
  { label: '计划单号', prop: 'planCode' },
  { label: '入库单号', prop: 'orderCode' },
  { label: '单据类型', prop: 'orderType', useLocalEnum: true, type: 'busiBillTypeEnum' },
  { label: '入库日期', prop: 'gmtCreate', type: 'time' },
  { label: '推送状态', prop: 'isPush', useLocalEnum: true, type: 'isPushStateEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
  { label: '操作', useLink: true },
]

export const inPushOrderDetailConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitCode' },
  // { label:'商品数量',prop:''},
  { label: '入库数量', prop: 'inQty' },
  { label: '库位', dom: Storehouse() },
  // { label:'批次',prop:''},
]
