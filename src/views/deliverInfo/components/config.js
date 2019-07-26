export const tableConfig = [// 物流登记
  { label: '下单时间', prop: 'placeOrderTime', width: 140, type: 'time' },
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', minWidth: 90 },
  { label: '供应商', prop: 'ownerName', width: 150 },
  { label: '登记状态', prop: 'register', minWidth: 90, useLocalEnum: true, type: 'registerStatusEnum' },
  { label: '收货人', prop: 'receiver', width: 120 },
  { label: '收获地址', prop: 'receiveAddress', width: 120 },
  { label: '联系电话', prop: 'linkTel', width: 150 },
  { label: '物流公司', prop: 'logisticsComName', width: 150 },
  { label: '物流单号', prop: 'logisticsOrderCode', width: 150 },
  { label: '件数', prop: 'carrierQty', width: 150 },
  { label: '运费承担方', prop: 'payType', width: 150, formatter: (a, b, c, d) => { return c ? '客户付' : '我方付' } },
  { label: '运费', prop: 'freightAmt', width: 90, type: 'money' },
  { label: '配送状态', prop: 'logisticsStatus', width: 90, useLocalEnum: true, type: 'logisticsStatusEnum' },
  { label: '到达时间', prop: 'deliverTime', width: 120, type: 'time' },
]

export const baseInfoConfig = [
  { title: '计划单号', prop: 'planCode', span: 8 },
  { title: '下单时间', prop: 'placeOrderTime', type: 'time', span: 8 },
  { title: '收货人', prop: 'receiver', span: 8 },
  { title: '收货地址', prop: 'receiveAddress', span: 8 },
]
