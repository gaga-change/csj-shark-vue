export function quotationwayFilter(val) {
  switch (parseInt(val)) {
    case 0: return '供应商'
    case 1: return '平台'
    case 2: return '个人'
    default: return ''
  }
}
export function receiptstatusFilter(val) {
  switch (parseInt(val)) {
    case 0: return '待回单'
    case 1: return '回单已登记'
    case 2: return '回单完成'
    default: return ''
  }
}
export function statusFilter(val) {
  switch (parseInt(val)) {
    case -1: return '草稿'
    case 0: return '待审核'
    case 1: return '确认通过'
    case -2: return '驳回'
    case 2: return '作废'
    case 3: return '已处理'
    case 4: return '已报价'
    case 5: return '回单已登记'
    case 6: return '回单完成'
    default: return ''
  }
}
export function invoicetypeFilter(val) {
  switch (parseInt(val)) {
    case 1: return '增值税专用发票'
    case 2: return '增值税普通发票'
    case 3: return '普通发票'
    case 4: return '无票收入'
    default: return ''
  }
}
export function fundnatureFilter(val) {
  switch (parseInt(val)) {
    case 1: return '货款'
    case 2: return '服务费'
    case 3: return '投标保证金'
    case 4: return '投标保证金'
    default: return ''
  }
}
export function fundtypeFilter(val) {
  switch (parseInt(val)) {
    case 1: return '预付款'
    case 2: return '预收款'
    case 3: return '提货款'
    case 4: return '质保金'
    default: return ''
  }
}
export function settlementmethodFilter(val) {
  switch (parseInt(val)) {
    case 1: return '现金'
    case 2: return '银行转账'
    case 3: return '银行承兑'
    case 4: return '商业承兑'
    case 5: return '支票'
    default: return ''
  }
}
export function servicelevelFilter(val) {
  switch (parseInt(val)) {
    case 1: return '一级'
    case 2: return '二级'
    default: return ''
  }
}
export function deliverwayFilter(val) {
  switch (parseInt(val)) {
    case 1: return '库发'
    case 2: return '供应商直发'
    case 3: return '自提'
    default: return ''
  }
}
export function recmethodFilter(val) {
  switch (parseInt(val)) {
    case 1: return '货到收款'
    case 2: return '预收款'
    default: return ''
  }
}
export function closedFilter(val) {
  switch (parseInt(val)) {
    case 0: return '未完结'
    case 1: return '完结'
    default: return ''
  }
}
export function paymethodFilter(val) {
  switch (parseInt(val)) {
    case 1: return '货到付款'
    case 2: return '货到票到付款'
    case 3: return '先款后货'
    default: return ''
  }
}
export function distributestatusFilter(val) {
  switch (parseInt(val)) {
    case 0: return '未分配'
    case 1: return '已分配'
    case 2: return '部分分配'
    case 3: return '询价完成'
    case 4: return '已报价'
    default: return ''
  }
}
export function taskstatusFilter(val) {
  switch (parseInt(val)) {
    case 0: return '未报价'
    case 1: return '报价完成'
    case 2: return '部分报价'
    case 3: return '已审核'
    default: return ''
  }
}
export function flagFilter(val) {
  switch (parseInt(val)) {
    case 0: return '不对接'
    case 1: return '对接'
    case 2: return '对接成功'
    case 3: return '对接失败'
    case 4: return '出库对接成功'
    case 5: return '出库对接失败'
    default: return ''
  }
}
export function contracttypeFilter(val) {
  switch (parseInt(val)) {
    case 0: return '采购'
    case 1: return '销售'
    default: return ''
  }
}
export function businesstypeFilter(val) {
  switch (parseInt(val)) {
    case 0: return '钢铁板块'
    case 1: return '汽车板块'
    default: return ''
  }
}
export function tasktypeFilter(val) {
  switch (parseInt(val)) {
    case 0: return '组装'
    case 1: return '拆卸'
    default: return ''
  }
}
export function bidstatusFilter(val) {
  switch (parseInt(val)) {
    case 0: return '待确认'
    case 2: return '中标'
    case 3: return '未中标'
    case 4: return '已投标'
    default: return '待确认'
  }
}
export function enquiryBidstatusFilter(val) {
  switch (parseInt(val)) {
    case 0: return '待报价'
    case 1: return '已报价'
    case 2: return '中标'
    case 3: return '未中标'
    case 4: return '已投标'
    default: return ''
  }
}
