
export const qualityTestingListConfig = [
  { label: '质检单号 ', prop: 'orderCode' },
  { label: '收货单号 ', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]

export const qualityTestingListSearchConfig = [
  { label: '质检单号', prop: 'orderCode', type: 'input' },
  { label: '创建时间', prop: 'createTimeArea', type: 'timeArea' },
]

export const takeStockSelectProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库存数量', prop: 'skuQty' },
  { label: '仓库名称', prop: 'warehouseName' },
]

export const quailtyTestingDetailConfig = [
  { label: '质检单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]

export const arrivalConfig = [
  { label: '收货单号', prop: 'receiveOrderCode' },
  { label: '计划单号', prop: 'planCode' },
  { label: '上架状态', prop: 'execStatus', useLocalEnum: true, type: 'execStatuslist' },
  { label: '收货时间', prop: 'gmtCreate', type: 'time' },
  { label: '单据类型', prop: 'orderType', useLocalEnum: true, type: 'busiBillTypeEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
]

export const takeStockRecordConfig = [
  { label: '盘点单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '备注', prop: 'remarkInfo' },
]

export const takeStockRecordProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库区库位', prop: 'areaSpceCode' },
  { label: '库存数量', prop: 'skuQty' },
  { label: '实际盘点数量', prop: 'inventoryQty', edit: true, inputType: "number", width: 160 },
  { label: '盈亏数量（自动计算）', prop: 'profitLossQty', width: 150 },
  { label: '状态', prop: 'executeStatus', useLocalEnum: true, type: 'executeStatus2Enum' },
]
