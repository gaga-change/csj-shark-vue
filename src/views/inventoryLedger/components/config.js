export const inventoryTableConfig=[// 库存列表
  { label:'序号', minWidth:80, prop:'id'},
  { label:'仓库',prop:'warehouseName', width:120 },
  { label:'商品编码',prop:'skuCode', width:120 },
  { label:'商品名称',prop:'skuName', width:120 },
  { label:'货主',prop:'ownerName', width:120 },
  // { label:'供应商',prop:'qqownerName', width:120 },
  { label:'规格型号  ',prop:'skuForma', minWidth:90 },
  
  { label:'单位',prop:'skuUnitName', minWidth:90 },
  { label:'单价',prop:'inPrice', minWidth:90 },
  { label:'批次',prop:'batchNo', minWidth:90 },
  { label:'最近入库时间',prop:'lastInTime', minWidth:120,type:'time' },
  { label:'最近出库时间',prop:'lastOutTime', minWidth:120,type:'time' },
  { label:'库存',prop:'skuQty', minWidth:90 },
  
  // { label:'款项性质',prop:'moneyState',useLocalEnum:true, type:'MoneyStateEnum', minWidth:120, },
]
