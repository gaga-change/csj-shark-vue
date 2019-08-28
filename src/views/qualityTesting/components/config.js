
export const quailtyTestingDetailConfig = [
  { label: '质检单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]

export const qualityTestingDetailTableConfig = [
  { label: '收货单号', prop: 'receiveOrderCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '收货数量', prop: 'receiveQty' },
  { label: '质检数量', prop: 'checkQty' },
  { label: '质检结果', prop: 'checkResult', useLocalEnum: true, type: 'checkResult2Enum' },
]

export const qualityTestingCreateTableConfig = [
  { label: '收货单号', prop: 'orderCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '收货数量', prop: 'receiveQty' },
  { label: '质检数量', prop: 'receiveQty' },
  { label: '质检结果', prop: 'checkResult', edit: true, inputtype: 'enum', type: 'checkResult3Enum' },
]
