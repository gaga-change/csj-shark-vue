
export const streamTableConfig = [
  { label: '库位', prop: 'warehouseSpaceCode', width: 80 },
  { label: '业务单号', prop: 'planCode', width: 150 },
  { label: '货主', prop: 'arrivalName', width: 150 },
  { label: '供应商', prop: 'providerName' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号  ', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '变动类型  ', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum' },
  { label: '变动前数量', prop: 'beforeQty', width: 100 },
  { label: '变动数量', prop: 'changeQty' },
  { label: '变动后数量', prop: 'afterQty', width: 100 },
  { label: '变动时间', prop: 'gmtModify', type: 'time' },
]
