export const planTableConfig=[// 计划单列表
  { label:'下单时间', width:120, prop:'gmtCreate', type:'time' },
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'供应商',prop:'providerName', width:150 },
  { label:'商品总数',prop:'inPlanQty', minWidth:90 },
  { label:'入库状态',prop:'execStatus',useLocalEnum:true, type:'ExecStatusEnum', minWidth:120 },
  { label:'制单人',prop:'createrName', minWidth:90 },
  { label:'已入库数量',prop:'inQty', minWidth:90 },

  // { label:'款项性质',prop:'moneyState',useLocalEnum:true, type:'MoneyStateEnum', minWidth:120, },
]
// flowChildTableConfig
export const planChildTableConfig=[// 计划单子列表
  { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  { label:'单位',prop:'skuUnitName', minWidth:120 },
  { label:'商品数量',prop:'planInQty', minWidth:120 },
  { label:'入库数量',prop:'realInQty', minWidth:120 },
  // { label:'批次',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  // { label:'备注',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  
]
export const planChildTableEditConfig=[// 计划单操作列表
  { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  { label:'单位',prop:'skuUnitName', minWidth:120 },
  { label:'总数量',prop:'planInQty', minWidth:120 },
  { label:'已入库',prop:'realInQty', minWidth:120 },//已入库，取realInQty的值
  { label:'待入库数量',prop:'tempInQty', minWidth:120, },
  { label:'本次实入',prop:'realInQtyIt', width:120,editable:true,fixed:'right' },//unconfirm
  // { label:'批次',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  { label:'备注',prop:'remarkInfo', width:120,editable:true ,fixed:'right'},//unconfirm
  
]
export const planChildTableLabelConfig=[// 计划单商品条码打印列表
  { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'供应商',prop:'providerName', width:150 },
  { label:'入库数量',prop:'realInQty', minWidth:120 },
 
  { label:'批次',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  { label:'打印张数',prop:'printNum', width:120,editable:true,editType:'number',fixed:'right', },//unconfirm 
]
export const planChildTablePrintConfig=[// 计划单打印列表
  // { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  // { label:'单据类型',prop:'skuName', width:100 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'供应商',prop:'providerName', width:150 },
  { label:'应入/已入',prop:'planReal', minWidth:120 },
 
  { label:'条形码',prop:'planCode', width:150,userIf:'images' },//unconfirm
]

export const inTableConfig=[// 入库列表
  { label:'入库时间', width:120, prop:'gmtModify', type:'time' },
  { label:'入库单号',prop:'orderCode', width:150 },
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'供应商',prop:'providerName', width:150 },
  { label:'单据状态',prop:'orderStatus',useLocalEnum:true,type:'OrderStatusEnum', width:90 },

  // { label:'商品总数',prop:'inPlanQty', minWidth:90 },
  { label:'操作人',prop:'modifierName', minWidth:90 },

  // { label:'款项性质',prop:'moneyState',useLocalEnum:true, type:'MoneyStateEnum', minWidth:120, },
]
export const inChildTableConfig=[// 入库子列表
  // { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  // { label:'商品型号',prop:'skuModel', minWidth:120 },//unconfirm
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  // { label:'单位',prop:'skuUnitName', minWidth:120 },
  // { label:'商品数量',prop:'planInQty', minWidth:120 },
  { label:'入库数量',prop:'realInQty', minWidth:120 },
  // { label:'待上架数量',prop:'realInQty', minWidth:120 },
  { label:'批次',prop:'batchNo', minWidth:120 },//unconfirm
  
]
