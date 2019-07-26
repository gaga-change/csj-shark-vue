//入库状态
export const SortStatus = [

  {
    name: '未拣货',
    value: 0
  },

  {
    name: '拣货中',
    value: 1
  },
  {
    name: '拣货完成',
    value: 2
  },
];
//单据类型
export const BusiBillTypeEnum = [

  {
    name: '采购入库',
    value: 11,
    type: 'in'
  },

  {
    name: '销售退货入库',
    value: 12,
    type: 'in'
  },
  {
    name: '仓储入库',
    value: 13,
    type: 'in'
  },
  {
    name: '拒收入库',
    value: 15,
    type: 'in'
  },
  {
    name: '销售出库',
    value: 21,
    type: 'out'
  },
  {
    name: '退货出库',
    value: 22,
    type: 'out'
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
    show: false,
  },

  {
    name: '暂存',
    value: 1,
    show: true,
  },
  {
    name: '已确认上架',
    value: 2,
    show: true,
  },
  {
    name: '驳回',
    value: 3,
    show: false,
  },
];
//
export const OutOrderStatusEnum = [

  {
    name: '草稿',
    value: 0,
    show: false,
  },

  {
    name: '暂存',
    value: 1,
    show: true,
  },
  {
    name: '已确认出库',
    value: 2,
    show: true,
  },
  {
    name: '驳回',
    value: 3,
    show: false,
  },
];

export const outboundOrderStatus = [
  {
    name: '暂存',
    value: 0
  },
  {
    name: '确认出库',
    value: 1
  },
  {
    name: '取消出库',
    value: 2
  },
]
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
export const registerStatusEnum = [
  {
    name: '未登记',
    value: 0
  },
  {
    name: '已登记',
    value: 1
  },
]

//库区性质
export const WarehouseAreaNatureEnum = [
  {
    name: '存储区',
    value: 1
  },
  {
    name: '残次品区',
    value: 2
  },
  {
    name: '退货区',
    value: 3
  },
]

//是否
export const YesOrNoEnum = [
  {
    name: '否',
    value: 0
  },
  {
    name: '是',
    value: 1
  },
]

export const warehouseSpaceStatus = [
  {
    name: '否',
    value: 0
  },
  {
    name: '是',
    value: 1
  },
]

export const orderStatus = [
  {
    name: '未执行',
    value: 0
  },
  {
    name: '部分执行',
    value: 1
  },
  {
    name: '全部执行',
    value: 2
  },
  {
    name: '终止',
    value: 3
  },
]

export const receiveStatusEnum = [
  {
    name: '未收货',
    value: 0
  },
  {
    name: '部分收货',
    value: 1
  },
  {
    name: '全部收货',
    value: 2
  },
]

export const warehouseSpaceStatusEnum = [
  {
    name: '空库位',
    value: 0
  },
  {
    name: '有货',
    value: 1
  },
]

export const isPushStateEnum = [
  {
    name: '未推送',
    value: 0
  },
  {
    name: '已推送',
    value: 1
  },
  {
    name: '推送失败',
    value: 2
  }
]

export const inLockEnum = [
  {
    name: '正常',
    value: 0
  },
  {
    name: '锁定',
    value: 1
  },
]

export const outLockEnum = [
  {
    name: '正常',
    value: 0
  },
  {
    name: '锁定',
    value: 1
  },
]

export const isVirtualenum = [
  {
    name: '否',
    value: 0
  },
  {
    name: '是',
    value: 1
  },
]

//库区编码
export const AtoZ = [
  { value: 'A', name: 'A', isUsed: false, },
  { value: 'B', name: 'B', isUsed: false, },
  { value: 'C', name: 'C', isUsed: false, },
  { value: 'D', name: 'D', isUsed: false, },
  { value: 'E', name: 'E', isUsed: false, },
  { value: 'F', name: 'F', isUsed: false, },
  { value: 'G', name: 'G', isUsed: false, },
  { value: 'H', name: 'H', isUsed: false, },
  { value: 'I', name: 'I', isUsed: false, },
  { value: 'J', name: 'J', isUsed: false, },
  { value: 'K', name: 'K', isUsed: false, },
  { value: 'L', name: 'L', isUsed: false, },
  { value: 'M', name: 'M', isUsed: false, },
  { value: 'N', name: 'N', isUsed: false, },
  { value: 'O', name: 'O', isUsed: false, },
  { value: 'P', name: 'P', isUsed: false, },
  { value: 'Q', name: 'Q', isUsed: false, },
  { value: 'R', name: 'R', isUsed: false, },
  { value: 'S', name: 'S', isUsed: false, },
  { value: 'T', name: 'T', isUsed: false, },
  { value: 'U', name: 'U', isUsed: false, },
  { value: 'V', name: 'V', isUsed: false, },
  { value: 'W', name: 'W', isUsed: false, },
  { value: 'X', name: 'X', isUsed: false, },
  { value: 'Y', name: 'Y', isUsed: false, },
  { value: 'Z', name: 'Z', isUsed: false, },
]

export const printState = [
  {
    name: '未打印',
    value: 0
  },
  {
    name: '已打印',
    value: 1
  },
]

export const receiveState = [
  {
    name: '未收货',
    value: 0
  },
  {
    name: '部分收货',
    value: 1
  },
  {
    name: '全部收货',
    value: 2
  }
]

export const execStatuslist = [
  {
    name: '未上架',
    value: 0
  },
  {
    name: '部分上架',
    value: 1
  },
  {
    name: '全部上架',
    value: 2
  }
]

export const badStatuslist = [
  {
    name: '未入库',
    value: 0
  },
  {
    name: '部分入库',
    value: 1
  },
  {
    name: '全部入库',
    value: 2
  }
]

export const jobStatusList = [
  {
    name: '未执行',
    value: 0
  },
  {
    name: '未执行',
    value: 1
  },
  {
    name: '未执行',
    value: 2
  },
  {
    name: '未执行',
    value: 3
  },
  {
    name: '已完成',
    value: 4
  },
  {
    name: '已作废',
    value: 5
  },
  {
    name: '异常作业',
    value: 6
  },
  {
    name: '暂停作业',
    value: 8
  }
]

export const busiBillTypeEnum = [
  { name: '采购入库', value: 11 },
  { name: '销售退入库', value: 12 },
  { name: '仓储入库', value: 13 },
  { name: '拒收入库', value: 15 },
  { name: '销售出库', value: 21 },
  { name: '采购退货出库', value: 22 },
  { name: '移库出库', value: 41 },
  { name: '移库入库', value: 51 },
]

export const checkResultEnum = [
  { name: '待检品', value: 0 },
  { name: '残次品', value: 1 },
  { name: '正品', value: 2 },
]

export const executeStatusEnum = [
  { name: '待盘点', value: 0 },
  { name: '盘点中', value: 1 },
  { name: '已取消', value: 2 },
  { name: '已终止', value: 3 },
  { name: '已完成', value: 4 },
]