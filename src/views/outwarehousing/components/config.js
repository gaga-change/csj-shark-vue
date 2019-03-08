export const planOrderTableConfig=[// 出库计划单列表
  { label:'下单时间', width:120, prop:'gmtCreate', type:'time' },
  { label:'拣货状态',prop:'sortStatus',useLocalEnum:true,type:'SortStatus', width:90 },
  { label:'计划单号',prop:'planCode', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'供应商',prop:'arrivalName', width:150 },
  { label:'商品总数',prop:'outPlanQty', minWidth:90 },
  { label:'出库状态',prop:'execStatus', minWidth:90,useLocalEnum:true,type:'OutExecStatusEnum', },
  { label:'收货人',prop:'arrivalLinkName', minWidth:90 },
  { label:'收货地址',prop:'arrivalAddress', width:120 },
  { label:'联系电话',prop:'arrivalLinkTel', width:150 },
  { label:'已出库数量',prop:'outQty', minWidth:90 },
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
  // { label:'出库批次',prop:'batchNo', minWidth:120 },
  { label:'备注',prop:'remarkInfo', minWidth:120 },

]
export const orderTableConfig=[// 出库单列表
  { label:'出库时间', prop:'gmtCreate', type:'time' },
  { label:'出库单号',prop:'orderCode' },
  { label:'计划单号',prop:'planCode' },
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
  { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', minWidth:120 },
  { label:'单位',prop:'skuUnitName', minWidth:120 },
  { label:'商品数量',prop:'planOutQty', minWidth:120 },//unconfirm
  { label:'已出库数量',prop:'realOutQty', minWidth:120 },//unconfirm
  { label:'待出库数量',prop:'tempOutQty', minWidth:120, },//unconfirm
  { label:'本次出库',prop:'realOutQtyIt', width:120,editable:true,fixed:'right' },//unconfirm
  // { label:'批次',prop:'skuUnitConvert', minWidth:120 },//unconfirm
  { label:'备注',prop:'remarkInfo', width:120,editable:true,fixed:'right' },//unconfirm

]
export const planChildTableLabelConfig=[// 计划单打印列表
  // { label:'业务行号',prop:'busiIndex', minWidth:80 },
  // { label:'商品编码',prop:'skuCode', width:150 },
  { label:'商品名称',prop:'skuName', width:150 },
  { label:'规格型号',prop:'skuFormat', width:200 },
  { label:'数量',prop:'printNum', width:120,editable:true,editType:'number' },
  { label:'单位',prop:'skuUnitName', width:80 },
]
export const planChildTablePrintConfig=[// 计划单打印列表
  // { label:'业务行号',prop:'busiIndex', minWidth:80 },
  { label:'计划单号',prop:'planCode', width:150 },
  // { label:'单据类型',prop:'skuName', width:150 },
  { label:'单据类型',prop:'busiBillType',useLocalEnum:true,type:'BusiBillTypeEnum', width:90 },
  { label:'货主',prop:'ownerName', width:150 },
  { label:'供应商',prop:'arrivalName', width:150 },
  { label:'应出/已出',prop:'planReal', minWidth:120 },

  { label:'条形码',prop:'planCode', width:150,userIf:'images' },//unconfirm
]

export const pickingtaskConfig=[
  { label:'拣货单号',prop:'orderCode'},
  { label:'拣货总数',prop:'realPickQty'},
  { label:'应拣货总量',prop:'pickQty'},
  { label:'出库单号',prop:'outOrderCode'},
  { label:'状态',prop:'orderStatus',type:'orderStatus',useLocalEnum:true},
  { label:'创建时间',prop:'gmtCreate',type:'time'},
  { label:'操作',useDom:true,width:300},
]

export const pickingtaskdetailConfig=[
  { columnType:'selection',width:50},
  { label:'计划单号',prop:'planCode'},
  { label:'商品编码',prop:'skuCode'},
  { label:'商品名称',prop:'skuName'},
  { label:'规格型号',prop:'skuFormat'},
  { label:'商品数量',prop:'jobQty'},
  { label:'货位',prop:'warehouseSpaceCode'},
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
  { label:'商品数量',prop:'realSortQty'},
  { label:'库位',prop:'warehouseSpaceCode'},
  { label:'创建时间', width:120, prop:'gmtCreate', type:'time' },
]
