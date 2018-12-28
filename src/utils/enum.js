//单据类型
export const BusiBillTypeEnum = [
  
  {
    name: '采购入库',
    value: 11,
    type:'in'
  },

  {
    name: '销售退货入库',
    value: 12,
    type:'in'
  },
  {
    name: '仓储入库',
    value: 13,
    type:'in'
  },
  {
    name: '拒收入库',
    value: 15,
    type:'in'
  },
  {
    name: '销售出库',
    value: 21,
    type:'out'
  },
  {
    name: '退货出库',
    value: 22,
    type:'out'
  },

];

//入库状态
export const ExecStatusEnum = [
  
  {
    name: '未入库',
    value: 0
  },

  {
    name: '部分入库',
    value: 5
  },
  {
    name: '全部入库',
    value: 8
  },
];
//出库状态
export const OutExecStatusEnum = [
  
  {
    name: '未出库',
    value: 0
  },

  {
    name: '部分出库',
    value: 5
  },
  {
    name: '全部出库',
    value: 8
  },
];

//单据状态
export const OrderStatusEnum = [
  
  {
    name: '草稿',
    value: 0,
    show:false,
  },

  {
    name: '暂存',
    value: 1,
    show:true,
  },
  {
    name: '已确认上架',
    value: 2,
    show:true,
  },
  {
    name: '驳回',
    value: 3,
    show:false,
  },
];
//
export const OutOrderStatusEnum = [
  
  {
    name: '草稿',
    value: 0,
    show:false,
  },

  {
    name: '暂存',
    value: 1,
    show:true,
  },
  {
    name: '已确认出库',
    value: 2,
    show:true,
  },
  {
    name: '驳回',
    value: 3,
    show:false,
  },
];
//物流状态
export const logisticsStatusEnum = [
  {
    name: '已出库',
    value: 0
  },
  {
    name: '配送中',
    value: 1
  },
  {
    name: '已完成',
    value: 2
  },
]
//登记状态
export var registerStatusEnum = [
  {
    name: '未登记',
    value: 0
  },
  {
    name: '已登记',
    value: 1
  },
]