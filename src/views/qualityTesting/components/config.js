
export const qualityTestingListConfig = [
  { label: '质检单号 ', prop: 'orderCode' },
  { label: '收货单号 ', prop: 'receiveOrderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]

export const qualityTestingListSearchConfig = [
  { label: '质检单号', prop: 'orderCode', type: 'input' },
  { label: '创建时间', prop: 'createTimeArea', type: 'timeArea' },
]

export const selectGoodsSearchConfig = [
  { label: '收货单号', prop: 'orderCode', type: 'input' },
  { label: '收货时间', prop: 'createTimeArea', type: 'timeArea' },
]

export const quailtyTestingDetailConfig = [
  { label: '质检单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]

export const arrivalConfig = [
  { label: '收货单号', prop: 'orderCode' },
  { label: '计划单号', prop: 'planCode' },
  { label: '上架状态', prop: 'execStatus', useLocalEnum: true, type: 'execStatuslist' },
  { label: '收货时间', prop: 'gmtCreate', type: 'time' },
  { label: '单据类型', prop: 'orderType', useLocalEnum: true, type: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
]

export const arrivalChildTableConfig = [// 收货单子列表 unconfirmed
  { label: '业务行号', prop: 'busiIndex', },
  { label: '商品编码', prop: 'skuCode', },
  { label: '商品名称', prop: 'skuName', },
  { label: '规格型号', prop: 'skuFormat', },
  { label: '单位', prop: 'skuUnitName', },
  { label: '商品数量', prop: 'planQty', },
  { label: '批次', prop: 'batchNo', },
  { label: '收货数量', prop: 'receiveQty', width: 100, editable: true },
  { label: '已入库数量', prop: 'realInQty', width: 85 },
]

export const qualityTestingDetailTableConfig = [
  { label: '收货单号', prop: 'receiveOrderCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '收货数量', prop: 'receiveQty' },
  { label: '质检数量', prop: 'checkQty' },
  { label: '质检结果', prop: 'checkResult', useLocalEnum: true, type: 'checkResult2Enum' },
]

export const qualityTestingCreateTableConfig = [
  { label: '收货单号', prop: 'orderCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '收货数量', prop: 'receiveQty' },
  { label: '质检数量', prop: 'receiveQty' },
  { label: '质检结果', prop: 'checkResult', edit: true, inputType: 'select', type: 'checkResult3Enum' },
]
