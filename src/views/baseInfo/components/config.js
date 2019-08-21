export const areaTableConfig = [// 库区列表
  { label: '库区编码', prop: 'warehouseAreaCode' },
  { label: '库区性质', prop: 'warehouseAreaNature', useLocalEnum: true, type: 'WarehouseAreaNatureEnum' },
  { label: '入库锁', prop: 'inLock', width: 80, useLocalEnum: true, type: 'inLockEnum', },
  { label: '出库锁', prop: 'outLock', width: 80, useLocalEnum: true, type: 'outLockEnum', },
  { label: '是否虚拟区', prop: 'isVirtual', useLocalEnum: true, type: 'isVirtualenum' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '描述', prop: 'warehouseAreaDesc' },
]

export const siteTableConfig = [// 库位列表
  { label: '库区编码', prop: 'warehouseAreaCode', minWidth: 120 },
  { label: '库位编码', prop: 'warehouseSpaceCode', minWidth: 120 },
  { label: '入库锁', prop: 'inLock', width: 80, useLocalEnum: true, type: 'inLockEnum', },
  { label: '出库锁', prop: 'outLock', width: 80, useLocalEnum: true, type: 'outLockEnum', },
  { label: '创建人', prop: 'createrName', minWidth: 90 },
  { label: '创建时间', prop: 'gmtCreate', minWdth: 120, type: 'time' },
]