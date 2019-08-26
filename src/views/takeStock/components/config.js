
export const takeStockSelectProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库存数量', prop: 'skuQty' },
  { label: '库区库位', prop: 'areaSpceCode' },
]

export const takeStockDetailConfig = [
  { label: '盘点单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '盘点人', prop: 'inventoryName' },
  { label: '盘点时间', prop: 'inventoryTime', type: 'time' },
  { label: '备注', prop: 'remarkInfo' },
]

export const takeStockDetailProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库区库位', prop: 'areaSpceCode' },
  { label: '库存数量', prop: 'stockQty' },
  { label: '实际盘点数量', prop: 'inventoryQty' },
  { label: '盈亏数量', prop: 'profitLossQty' },
  { label: '状态', prop: 'executeStatus', useLocalEnum: true, type: 'executeStatus2Enum' },
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
  { label: '库存数量', prop: 'stockQty' },
  { label: '实际盘点数量', prop: 'inventoryQty', edit: true, inputType: "number", width: 160 },
  { label: '盈亏数量（自动计算）', prop: 'profitLossQty', width: 150 },
  { label: '状态', prop: 'executeStatus', useLocalEnum: true, type: 'executeStatus2Enum' },
]
