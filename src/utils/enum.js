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
//库区状态
export const WarehouseAreaStatusEnum = [
  {
    name: '启用',
    value: 0
  },
  {
    name: '禁用',
    value: 1
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

//库区编码
export const AtoZ = [
  {value:'A',name:'A',isUsed:false,},
  {value:'B',name:'B',isUsed:false,},
  {value:'C',name:'C',isUsed:false,},
  {value:'D',name:'D',isUsed:false,},
  {value:'E',name:'E',isUsed:false,},
  {value:'F',name:'F',isUsed:false,},
  {value:'G',name:'G',isUsed:false,},
  {value:'H',name:'H',isUsed:false,},
  {value:'I',name:'I',isUsed:false,},
  {value:'J',name:'J',isUsed:false,},
  {value:'K',name:'K',isUsed:false,},
  {value:'L',name:'L',isUsed:false,},
  {value:'M',name:'M',isUsed:false,},
  {value:'N',name:'N',isUsed:false,},
  {value:'O',name:'O',isUsed:false,},
  {value:'P',name:'P',isUsed:false,},
  {value:'Q',name:'Q',isUsed:false,},
  {value:'R',name:'R',isUsed:false,},
  {value:'S',name:'S',isUsed:false,},
  {value:'T',name:'T',isUsed:false,},
  {value:'U',name:'U',isUsed:false,},
  {value:'V',name:'V',isUsed:false,},
  {value:'W',name:'W',isUsed:false,},
  {value:'X',name:'X',isUsed:false,},
  {value:'Y',name:'Y',isUsed:false,},
  {value:'Z',name:'Z',isUsed:false,},
]