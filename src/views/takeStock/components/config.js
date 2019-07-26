
export const takeStockSelectProductTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '批次', prop: 'batchNo' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '库存数量', prop: 'skuQty' },
  { label: '仓库名称', prop: 'warehouseName' },
]

export const takeStockListConfig = [
  { label: '盘点单号', prop: 'orderCode' },
  { label: '状态', prop: 'executeStatus', useLocalEnum: true, type: 'executeStatusEnum' },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '盘点人', prop: 'inventoryName' },
  { label: '盘点时间', prop: 'inventoryTime', type: 'time' },
]

export const takeStockListSearchConfig = [
  { label: '盘点单号', prop: 'orderCode', type: 'input' },
  { label: '状态', prop: 'executeStatus', type: 'select', enum: 'executeStatusEnum' },
  { label: '创建时间', prop: 'createTimeArea', type: 'timeArea' },
  // { label: '库区', prop: 'warehouseAreaCode', type: 'warehouseAreaCode' },
  // { label: '库位', prop: 'warehouseSpaceCode', type: 'warehouseSpaceCode' }
]