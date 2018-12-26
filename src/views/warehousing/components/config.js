export const flowTableConfig=[// 流水列表
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
export const flowChildTableConfig=[// 流水子列表
  { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'商品型号',prop:'skuModel', minWidth:120 },//unconfirm
  { label:'商品规格',prop:'skuFormat', minWidth:120 },//unconfirm
  { label:'单位',prop:'skuUnitName', minWidth:120 },
  { label:'商品数量',prop:'planInQty', minWidth:120 },
  { label:'入库数量',prop:'realInQty', minWidth:120 },
  { label:'批次',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  { label:'备注',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  
]
