export const tableConfig = [
  { label: '公司编码', prop: 'companyCode' },
  { label: '物流公司名称', prop: 'companyName' },
  { label: '地址', prop: 'linkAddress' },
  { label: '联系人', prop: 'linkUser' },
  { label: '创建人  ', prop: 'createrName' },
]
export const areaTableConfig = [// 库区列表
  { label: '库区编码', prop: 'warehouseAreaCode' },
  { label: '库区性质', prop: 'warehouseAreaNature', useLocalEnum: true, type: 'WarehouseAreaNatureEnum' },
  { label: '状态', prop: 'warehouseAreaStatus', useLocalEnum: true, type: 'WarehouseAreaStatusEnum' },
  { label: '是否虚拟区', prop: 'isVirtual', useLocalEnum: true, type: 'isVirtualenum' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '描述', prop: 'warehouseAreaDesc' },
]

export const siteTableConfig = [// 库位列表
  { label: '库区编码', prop: 'warehouseAreaCode', minWidth: 120 },
  { label: '库位编码', prop: 'warehouseSpaceCode', minWidth: 120 },
  { label: '状态', prop: 'openStatus', width: 80, useLocalEnum: true, type: 'openStatusEnum', },
  { label: '创建人', prop: 'createrName', minWidth: 90 },
  { label: '创建时间', prop: 'gmtCreate', minWdth: 120, type: 'time' },
]