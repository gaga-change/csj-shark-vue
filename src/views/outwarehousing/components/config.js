export const orderTableConfig=[// 出库单列表
  { label:'出库时间', width:120, prop:'gmtCreate', type:'time' },
  { label:'出库单号',prop:'orderCode', width:150 },
  { label:'预约单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'客户/供应商',prop:'ownerName', width:150 },
  { label:'操作人',prop:'createrName', minWidth:90 },
]
// orderTableConfig, orderChildTableConfig
export const orderChildTableConfig=[// 出库单子列表
  // { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuModel', minWidth:120 },
  { label:'单位',prop:'skuUnitCode', minWidth:120 },
  { label:'商品数量',prop:'numberOfProducts', minWidth:120 },
  { label:'出库数量',prop:'realOutQty', minWidth:120 },
  { label:'出库批次',prop:'batchNo', minWidth:120 },
  { label:'备注',prop:'remarkInfo', minWidth:120 },
  
]
