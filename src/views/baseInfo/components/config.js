export const tableConfig=[// 物流公司
  // { label:'序号', minWidth:80, prop:'id'},
  { label:'公司编码',prop:'companyCode', width:120 },
  { label:'物流公司名称',prop:'companyName', width:120 },
  { label:'地址',prop:'linkAddress', width:150 },
  { label:'联系人',prop:'linkUser', width:120 },
  // { label:'供应商',prop:'qqownerName', width:120 },
  { label:'创建人  ',prop:'createrName', minWidth:90 },
]
export const areaTableConfig=[// 库区列表
  // { label:'序号', minWidth:80, prop:'id'},
  { label:'库区编码',prop:'warehouseAreaCode', width:120 },
  { label:'库区性质',prop:'warehouseAreaNature', width:120,useLocalEnum:true,type:'WarehouseAreaNatureEnum', },
  { label:'状态',prop:'warehouseAreaStatus', width:80,useLocalEnum:true,type:'WarehouseAreaStatusEnum', },
  // { label:'供应商',prop:'qqownerName', width:120 },
  { label:'创建人  ',prop:'createrName', minWidth:90 },
  { label:'创建时间',prop:'gmtCreate', width:120,type:'time' },
  { label:'库区描述',prop:'warehouseAreaDesc', width:120 },

]

export const siteTableConfig=[// 库位列表
  // { label:'序号', minWidth:80, prop:'id'},
  { label:'库区编码',prop:'warehouseAreaCode', minWidth:120 },
  { label:'库位编码',prop:'warehouseSpaceCode', minWidth:120 },
  // { label:'库区性质',prop:'warehouseAreaNature', width:120,useLocalEnum:true,type:'WarehouseAreaNatureEnum', },
  { label:'状态',prop:'openStatus', width:80,useLocalEnum:true,type:'WarehouseAreaStatusEnum', },
  // { label:'供应商',prop:'qqownerName', width:120 },
  { label:'创建人  ',prop:'createrName', minWidth:90 },
  { label:'创建时间',prop:'gmtCreate', minWdth:120,type:'time' },
  // { label:'库区描述',prop:'warehouseAreaDesc', width:120 },

]