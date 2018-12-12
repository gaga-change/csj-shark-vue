//发票性质
export const NatureInvoice = [
  
  {
    name: '蓝字发票',
    value: 1
  },

  {
    name: '红字发票',
    value: 2
  },
];

//业务板块
export const busiPlateConfig = [
  
  {
    name: '钢铁',
    value: 0
  },

  {
    name: '汽车',
    value: 1
  },
];


//发票性质枚举类型
export const NatureInvoiceEnum = [
  
  {
    name: '蓝字发票',
    value: 'BLUE_INVOICE'
  },

  {
    name: '红字发票',
    value: 'CREDIT_NOTE'
  },
]

//单据状态
export const TicketStatus = [
  {
    name: '草稿',
    value: 0
  },
  {
    name: '待审核',
    value: 1
  },
  {
    name: '待登记',
    value: 2
  },
  {
    name: '待复核',
    value: 3
  },
  {
    name: '已复核',
    value: 4
  },
  {
    name: '已驳回',
    value: 5
  },
]

//发票状态
export const InvoiceStatus = [
  {
    name: '正常',
    value: 0
  },
  {
    name: '被红冲',
    value: 1
  },
  {
    name: '作废',
    value: 2
  },
]
//发票类型
export const InvoiceType = [
  {
    name: '增值税专用发票',
    value: 1
  },
  {
    name: '增值税普通发票',
    value: 2
  },
  {
    name: '普通发票',
    value: 3
  },
  {
    name: '无票收入',
    value: 4
  }
]

//付款方式
export const PaymentModeEnum = [
  {
    name: '银行转账',
    value: 1
  },
  {
    name: '支票',
    value: 2
  },
  {
    name: '现金',
    value: 3
  },
  {
    name: '银行承兑',
    value: 4
  },
  {
    name: '商业承兑',
    value: 5
  },
]

//收款审核状态
export const ApproveStatusEnum = [
  {
    name: '草稿',
    value: 0
  },
  {
    name: '登记待审',
    value: 1
  },
  {
    name: '登记已审',
    value: 2
  },
  {
    name: '登记驳回',
    value: 3
  },
]

//收款销售单关联状态
export const RelationStatusEnum = [
  {
    name: '待分配业务员',
    value: 0
  },
  {
    name: '未关联业务单',
    value: 1
  },
  {
    name: '未关联业务单',//保存
    value: 2
  },
  {
    name: '关联待审',
    value: 3
  },
  {
    name: '关联已审',
    value: 4
  },
  // {
  //   name: '已驳回',
  //   value: 5
  // },
]

//收款款项性质
export const MoneyStateEnum = [
  {
    name: '货款',
    value: 0,
    disabled:false,
  },
  {
    name: '质保金',
    value: 1,
    disabled:true,
  },
  {
    name: '服务费',
    value: 2,
    disabled:false,
  },
  {
    name: ' ',
    value: 99
  },
]

//收款款项类型
export const MoneyTypeEnum = [
  {
    name: '预付款',
    value: 0,
    type:'receipt+pay',
  },
  {
    name: '提货款',
    value: 1,
    type:'receipt+pay',
  },
  {
    name: '保证金',
    value: 2,
    type:'receipt+pay',
  },
  {
    name: '供应商退货款',
    value: 3,
    type:'pay',
  }
]

//作废状态
export const invoiceCancelStatusConfig = [
  {
    name: '未申请',
    value: 0
  },
  {
    name: '申请中',
    value: 1
  },
  {
    name: '申请通过',
    value: 2
  },
  {
    name: '被驳回',
    value: 3
  },
]


//进项发票页面枚举
//单据状态
export  const entryInvoiceTicketStatus=[
  {
    name: '草稿 ',
    value: 0
  },
  {
    name: '待审核',
    value: 1
  },
  {
    name: '已驳回',
    value: 2
  },
  {
    name: '已审核',
    value: 3
  },
]
  
//付款单据状态
export const paymentStatusEnum = [
  {
    name: '草稿',
    value: 0
  },
  {
    name: '提交待审',
    value: 1
  },
  {
    name: '采购审核',
    value: 2
  },
  {
    name: '财务审核',
    value: 3
  },
  {
    name: '总经理审核',
    value: 4
  },
  {
    name: '付款待确认',
    value: 5
  },
  {
    name: '付款已确认',
    value: 6
  },
  {
    name: '已驳回',
    value: 9
  },
  {
    name: '已取消',
    value: 19
  },
]

//成功标识
export const successFlag = [
  {
    name: '成功',
    value: 1
  },
  {
    name: '失败',
    value: 0
  },

]


//异常商品处理单据状态
export const billStatusEnum = [
  {
    name: '草稿',
    value: 0
  },
  {
    name: '待审核',
    value: 1
  },
  {
    name: '已审核',
    value: 2
  },
  {
    name: '已驳回',
    value: 3
  },
  {
    name: '已关闭',
    value: 4
  },
  {
    name: '已完成退货',
    value: 5
  },

]



//异常商品处理  异常商品处理意见
export  const handleOpinionConfig=[
  {
    name: '客户已拒收 ，建议退回供应商 ',
    value: 0
  },
]


//异常商品处理  发票状态
export  const invoiceStatusConfig=[
  {
    name: '未开票',
    value: 0
  },
  {
    name: '已开票',
    value: 1
  },
]

//异常商品处理  付款状态
export  const paymentStatusConfig=[
  {
    name: '未付款',
    value: 0
  },
  {
    name: '已付款',
    value: 1
  },
]