export const inventoryTableConfig=[// 库存列表
  { label:'商品编码',prop:'skuCode' },
  { label:'商品名称',prop:'skuName'},
  { label:'货主',prop:'ownerName' },
  { label:'规格型号',prop:'skuFormat' },
  { label:'单位',prop:'skuUnitName'},
  { label:'单价',prop:'inPrice'},
  { label:'批次',prop:'batchNo'},
  { label:'最近入库时间',prop:'lastInTime',type:'time' },
  { label:'最近出库时间',prop:'lastOutTime',type:'time' },
  { label:'库存',prop:'skuQty' },
  { label:'库位',prop:'warehouseSpaceCode' },
]

export const streamTableConfig=[
  { label:'变动时间',prop:'gmtCreate',type:'time' },
  // { label:'变动类型',prop:'',useLocalEnum:true,type:'registerStatusEnum'},
  // { label:'单据号',prop:'' },
  { label:'货主',prop:'arrivalName' },
  { label:'供应商',prop:'providerName' },
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName' },
  { label:'规格型号  ',prop:'skuFormat' },
  { label:'单位',prop:'skuUnitName'},
  { label:'数量',prop:'inPrice' },
  { label:'结算',prop:'batchNo'},
  { label:'库位',prop:'warehouseSpaceCode'},
  
]
