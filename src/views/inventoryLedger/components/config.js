export const inventoryTableConfig=[// 库存列表
  { label:'库位',prop:'warehouseSpaceCode' },
  { label:'商品编码',prop:'skuCode' },
  { label:'商品名称',prop:'skuName'},
  { label:'货主',prop:'ownerName' },
  { label:'规格型号',prop:'skuFormat' },
  { label:'单位',prop:'skuUnitName'},
  { label:'单价',prop:'inPrice'},
  { label:'批次',prop:'batchNo'},
  { label:'最近入库时间',prop:'lastInTime',type:'time' },
  { label:'最近出库时间',prop:'lastOutTime',type:'time' },
  { label:'冻结数量',prop:'blockQty' },
  { label:'库存',prop:'skuQty' },
]

export const streamTableConfig=[
  { label:'库位',prop:'warehouseSpaceCode',width:80},
  { label:'业务单号',prop:'planCode',width:150},
  { label:'货主',prop:'arrivalName',width:150 },
  { label:'供应商',prop:'providerName' },
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName' },
  { label:'规格型号  ',prop:'skuFormat' },
  { label:'单位',prop:'skuUnitName'},
  { label:'变动前数量',prop:'beforeQty' },
  { label:'变动数量',prop:'changeQty' },
  { label:'变动后数量',prop:'afterQty' },
  { label:'变动时间',prop:'gmtModify',type:'time' },
]
