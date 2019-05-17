export const planOrderTableConfig=[// 出库计划单列表
  { label:'下单时间', width:140, prop:'gmtCreate', type:'time' },
  { label:'拣货状态',prop:'sortStatus',useLocalEnum:true,type:'SortStatus', width:90 },
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'客户',prop:'arrivalName', width:150 },
  { label:'商品总数',prop:'outPlanQty', minWidth:90 },
  { label:'出库状态',prop:'execStatus', minWidth:90,useLocalEnum:true,type:'OutExecStatusEnum', },
  { label:'收货人',prop:'arrivalLinkName', minWidth:90 },
  { label:'收货地址',prop:'arrivalAddress', width:120 },
  { label:'联系电话',prop:'arrivalLinkTel', width:150 },
  { label:'已出库数量',prop:'outQty', minWidth:90 },
]

export const planTableConfig=[// 打印出库计划单列表
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'货主名称',prop:'ownerName', width:150 },
  { label:'客户名称',prop:'arrivalName', width:150 },
  { label:'应出/已出',prop:'printplanReal', minWidth:90 },
  { label:'打印状态',prop:'isPrint', useLocalEnum:true, type:'printState', minWidth:90 }
]

export const outTableConfig=[// 计划单号列表
  { label:'序号', prop:'index'},
  { label:'计划单号',prop:'value', width:150 },
]

// orderTableConfig, orderChildTableConfig
export const planOrderChildTableConfig=[// 出库计划单子列表
  // { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuModel', minWidth:120 },
  { label:'单位',prop:'skuUnitName', minWidth:120 },
  { label:'商品数量',prop:'planOutQty', minWidth:120 },
  { label:'出库数量',prop:'realOutQty', minWidth:120 },
  { label:'已通知拣货数量',prop:'sortQty', minWidth:120 },
  { label:'已拣货数量',prop:'realSortQty', minWidth:120 },
  { label:'暂存区数量',prop:'realSortQty', minWidth:120 },

]
export const orderTableConfig=[// 出库单列表
  { label:'出库时间', prop:'gmtCreate', type:'time' },
  { label:'出库单号',prop:'orderCode' },
  { label:'计划单号',prop:'planCode' },
  { label:'推送状态',prop:'isPush',useLocalEnum:true,type:'isPushStateEnum'},
  { label:'单据类型',prop:'orderType',useLocalEnum:true,type:'BusiBillTypeEnum'},
  { label:'单据状态',prop:'orderStatus',useLocalEnum:true,type:'outboundOrderStatus'},
  { label:'客户/供应商',prop:'ownerName',  },
  { label:'操作人',prop:'createrName'},
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

export const planChildTableEditConfig=[// 计划单操作列表
  { label:'计划单号',prop:'planCode', minWidth:150 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  { label:'单位',prop:'skuUnitName', minWidth:100 },
  { label:'商品数量',prop:'planOutQty', minWidth:120 },
  { label:'已出库数量',prop:'realOutQty', minWidth:100 },
  { label:'待出库数量',prop:'tempOutQty', minWidth:100, },
  { label:'通知拣货数量',prop:'sortQty', width:120,editable:true,fixed:'right' },
]

export const planChildTableEditAllocationConfig = [ // 计划单操作列表 之 波次分配
  { label:'计划单号',prop:'planCode', minWidth:150 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  { label:'单位',prop:'skuUnitName', minWidth:100 },
  { label:'商品数量',prop:'planOutQty', minWidth:120 },
  { label:'通知拣货数量',prop:'sortQty', width:120,},
  { label:'本次拣货数量',prop:'sum', width:120,},
]

export const planChildTableLabelConfig=[// 计划单打印列表
  { label:'计划单号',prop:'planCode', minWidth:150 },
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName' },
  { label:'规格型号',prop:'skuFormat'},
  { label:'数量',prop:'printNum',editable:true,editType:'number' },
  { label:'单位',prop:'skuUnitName' },
]

export const outChildTableLabelConfig=[// 计划单打印列表
  { label:'计划单号',prop:'planCode' },
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName' },
  { label:'规格型号',prop:'skuModel'},
  { label:'数量',prop:'realOutQty' },
  { label:'单位',prop:'skuUnitCode' },
]

export const planChildTablePrintConfig=[// 计划单打印列表
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:100 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'客户',prop:'arrivalName', width:150 },
  { label:'应出/已出',prop:'planReal', minWidth:100 },
  { label:'条形码',prop:'planCode', width:150,userIf:'images' },//unconfirm
]

export const pickingtaskConfig=[
  { label:'拣货单号',prop:'orderCode'},
  { label:'拣货总数',prop:'realPickQty'},
  { label:'应拣货总量',prop:'pickQty'},
  // { label:'出库单号',prop:'outOrderCode'},
  { label:'状态',prop:'orderStatus',type:'orderStatus',useLocalEnum:true},
  { label:'创建时间',prop:'gmtCreate',type:'time'},
  { label:'操作',useDom:true,width:300},
]

export const pickingtaskdetailConfig=[
  { label:'计划单号',prop:'planCode'},
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName'},
  { label:'规格型号',prop:'skuFormat'},
  { label:'通知拣货数',prop:'jobQty'},
  // { label:'货位',prop:'warehouseSpaceCode'},
  { label:'货位',prop:'sum'},
]

export const printinConfig=[
  { label:'序号',type:'index',width:50},
  { label:'计划单号',prop:'planCode'},
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName'},
  { label:'规格型号',prop:'skuFormat'},
  { label:'商品数量',prop:'jobQty'},
  { label:'货位',prop:'warehouseSpaceCode'},
]


export const temporaryStorageConfig=[
  { label:'拣货单号',prop:'pickOrderCode'},
  { label:'计划单号',prop:'planCode'},
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName'},
  { label:'规格型号',prop:'skuFormat'},
  { label:'商品数量',prop:'sortQty'},
  { label:'是否已生成出库单',prop:'isCreateOrder',type:'Boolean'},
  { label:'库位',prop:'warehouseSpaceCode'},
  { label:'创建时间', width:150, prop:'gmtCreate', type:'time' },
]
