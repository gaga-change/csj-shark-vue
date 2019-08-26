export const planOrderTableConfig = [// 出库计划单列表
  { label: '下单时间', width: 140, prop: 'gmtCreate', type: 'time' },
  { label: '拣货状态', prop: 'sortStatus', useLocalEnum: true, type: 'SortStatus', width: 90 },
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 90 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '客户', prop: 'arrivalName', width: 150 },
  { label: '商品总数', prop: 'outPlanQty', minWidth: 90 },
  { label: '出库状态', prop: 'execStatus', minWidth: 90, useLocalEnum: true, type: 'OutExecStatusEnum', },
  { label: '收货人', prop: 'arrivalLinkName', minWidth: 90 },
  { label: '收货地址', prop: 'arrivalAddress', width: 120 },
  { label: '联系电话', prop: 'arrivalLinkTel', width: 150 },
  { label: '已出库数量', prop: 'outQty', minWidth: 90 },
]

export const planOrderChildTableConfig = [// 出库计划单子列表
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuModel', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 120 },
  { label: '商品数量', prop: 'planOutQty', minWidth: 120 },
  { label: '出库数量', prop: 'realOutQty', minWidth: 120 },
  { label: '已通知拣货数量', prop: 'sortQty', minWidth: 120 },
  { label: '已拣货数量', prop: 'realSortQty', minWidth: 120 },
]

export const planChildTableEditConfig = [// 计划单操作列表
  { label: '计划单号', prop: 'planCode', minWidth: 150 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 100 },
  { label: '商品数量', prop: 'planOutQty', minWidth: 120 },
  { label: '已出库数量', prop: 'realOutQty', minWidth: 100 },
  { label: '待出库数量', prop: 'tempOutQty', minWidth: 100, },
  { label: '通知拣货数量', prop: 'sortQty', width: 120, editable: true, fixed: 'right' },
]

export const planChildTableEditAllocationConfig = [ // 计划单操作列表 之 波次分配
  { label: '计划单号', prop: 'planCode', minWidth: 150 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 100 },
  { label: '商品数量', prop: 'planOutQty', minWidth: 120 },
  { label: '通知拣货数量', prop: 'sortQty', width: 120 },
]

export const planChildTableLabelConfig = [// 计划单打印列表
  { label: '计划单号', prop: 'planCode', minWidth: 150 },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '数量', prop: 'printNum', editable: true, editType: 'number' },
  { label: '单位', prop: 'skuUnitName' },
]

export const planChildTablePrintConfig = [// 计划单打印列表
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 100 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '客户', prop: 'arrivalName', width: 150 },
  { label: '应出/已出', prop: 'planReal', minWidth: 100 },
  { label: '条形码', prop: 'planCode', width: 150, userIf: 'images' },//unconfirm
]

