

export const businessChildTableEditConfig = [// 计划单操作列表
  { label: '业务行号', prop: 'busiIndex', minWidth: 80 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 120 },
  { label: '入库数量', prop: 'realInQty' },
  { label: '商品数量', prop: 'planInQty' },
  { label: '收货数量', prop: 'hasReceiveQty' },
  { label: '正品数量(自动计算)', prop: 'receiveQty', width: 180 }
]

export const planChildTableLabelConfig = [// 计划单商品条码打印列表
  { label: '业务行号', prop: 'busiIndex', minWidth: 80 },
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '入库数量', prop: 'realInQty', minWidth: 120 },
  { label: '打印条数', prop: 'printNum', width: 200, editable: true, editType: 'inputNumber', fixed: 'right', max: 100 },//unconfirm 
]

export const planChildTablePrintConfig = [// 计划单打印列表
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 100 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '应入/已入', prop: 'planReal', width: 100 },
  { label: '条形码', prop: 'planCode', width: 150, userIf: 'images' },
]

export const inTableConfig = [// 入库列表
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '入库单号', prop: 'orderCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', useLocalEnum: true, type: 'busiBillTypeEnum', width: 90 },
  { label: '入库时间', width: 120, prop: 'gmtModify', type: 'time' },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '供应商', prop: 'providerName', width: 150 },
  { label: '单据状态', prop: 'orderStatus', useLocalEnum: true, type: 'OrderStatusEnum', width: 90 },
  { label: '操作人', prop: 'modifierName', minWidth: 90 },
]

export const inChildTableConfig = [// 入库子列表
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuFormat', minWidth: 120 },
  { label: '入库数量', prop: 'realInQty', minWidth: 120 },
  { label: '批次', prop: 'batchNo', minWidth: 120 },

]

export const batchNoConfig = [
  { label: '序号', type: 'index', width: 50 },
  { label: '批次', prop: 'batchNo' },
  { label: '正品数量', prop: 'receiveQty', width: 200 },
]

function formatWareHousing() {
  return (row, column, cellValue, index) => {
    let str = '';
    row['warehousingArr'].forEach(item => {
      str += item.putQty + '/' + item.warehouseSpaceCode + ' , '
    })
    return str.slice(0, -1)
  }
}