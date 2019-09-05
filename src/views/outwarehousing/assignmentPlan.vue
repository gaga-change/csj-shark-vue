<template>
  <div>
    <double-list
      ref="doubleList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      @childSelectionChange="childSelectionChange"
      :childApi="childApi"
      :childTableConfig="childTableConfig"
      :selectTables="true"
    >
      <template slot="btns">
        <operation-button
          :childSelectRows="childSelectRows"
          @submited="getTableData"
        />
      </template>
    </double-list>

  </div>
</template>

<script>
import { getInfoPlanOutWarehousing } from '@/api'
import operationButton from './components/operationButton'

const childTableConfig = [
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuModel', minWidth: 120 },
  { label: '单位', prop: 'skuUnitName', minWidth: 120 },
  { label: '商品数量', prop: 'planOutQty', minWidth: 120 },
  { label: '出库数量', prop: 'realOutQty', minWidth: 120 },
  { label: '已通知拣货数量', prop: 'sortQty', minWidth: 120 },
  { label: '已拣货数量', prop: 'realSortQty', minWidth: 120 },
]
const tableConfig = [
  { label: '下单时间', width: 140, prop: 'gmtCreate', type: 'time' },
  { label: '拣货状态', prop: 'sortStatus', type: 'enum', enum: 'sortStatusEnum', width: 90 },
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum', width: 90 },
  { label: '货主', prop: 'ownerName', width: 150 },
  { label: '客户/供应商', prop: 'arrivalName', width: 150 },
  { label: '出库状态', prop: 'execStatus', minWidth: 90, type: 'enum', enum: 'outExecStatusEnum', },
  { label: '收货人', prop: 'arrivalLinkName', minWidth: 90 },
  { label: '收货地址', prop: 'arrivalAddress', width: 120 },
  { label: '联系电话', prop: 'arrivalLinkTel', width: 150 },
]
const searchConfig = [
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '计划单号', prop: 'planCode' },
  { label: '客户/供应商', prop: 'arrivalName' },
  { label: '出库状态', prop: 'execStatus', type: 'enum', enum: 'outExecStatusEnum' },
  { label: '拣货状态', prop: 'sortStatus', type: 'enum', enum: 'sortStatusEnum' },
  { label: '下单时间', prop: 'createTimeArea', props: ['createBeginDate', 'createEndDate'], type: 'timeArea' },
]
export default {
  components: { operationButton },
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: getInfoPlanOutWarehousing,
      childSelectRows: [],
    }
  },
  methods: {
    /** 子表内容获取 */
    childApi(row) {
      return Promise.resolve(row.outWarehousePlanDetailRespList)
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['doubleList'].fetchData()
    },
    /** 子表多选 */
    childSelectionChange(selectRowsAndMainRow) {
      let temp = []
      selectRowsAndMainRow.forEach(({ selectRows, mainRow }) => {
        temp.push(...selectRows.map(v => {
          return {
            planCode: mainRow.planCode,
            ownerCode: mainRow.ownerCode,
            ...v,
          }
        }))
      })
      this.childSelectRows = temp
    }
  }
}
</script>

