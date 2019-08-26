<template>
  <div>
    <double-list
      ref="doubleList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
      :showControlFixed="false"
      :expand="true"
      @childSelectionChange="childSelectionChange"
      :childApi="childApi"
      :childTableConfig="childTableConfig"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="printMark(scope.row)"
        >打印装箱唛头</el-link>
      </template>
      <template slot="btns">
        <print-out-plan-detail-button
          :childSelectRows="childSelectRows"
          :mainRow="mainRow"
        />
      </template>
    </double-list>
    <print-mark-dialog
      :visible.sync="printMarkDialogVisible"
      :row="nowRow"
    ></print-mark-dialog>
  </div>
</template>

<script>
import { getInfoOutWarehousing, getInfoDetailOutWarehousing } from '@/api'
import printOutPlanDetailButton from './components/printOutPlanDetailButton'
import printMarkDialog from './components/printMarkDialog'
import { outboundOrderStatus, isPushStateEnum, busiBillTypeEnum } from '@/utils/enum'

const childTableConfig = [
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '商品数量', prop: 'numberOfProducts' },
  { label: '出库数量', prop: 'realOutQty' },
  { label: '出库批次', prop: 'batchNo' },
  { label: '备注', prop: 'remarkInfo' },
]
const tableConfig = [
  { label: '出库时间', prop: 'gmtCreate', type: 'time' },
  { label: '出库单号', prop: 'orderCode' },
  { label: '计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: isPushStateEnum },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: busiBillTypeEnum },
  { label: '单据状态', prop: 'orderStatus', type: 'enum', enum: outboundOrderStatus },
  { label: '客户/供应商', prop: 'ownerName', },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '计划单号', prop: 'planCode', type: 'input' },
  { label: '出库单号', prop: 'orderCode', type: 'input' },
  { label: '客户/供应商', prop: 'ownerName', type: 'input' },
  { label: '单据状态', prop: 'orderStatus', type: 'select', enum: outboundOrderStatus },
  { label: '出库时间', prop: 'createTimeArea', props: ['startDate', 'endtDate'], type: 'timeArea' },
]

export default {
  components: { printOutPlanDetailButton, printMarkDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: getInfoOutWarehousing,
      printMarkDialogVisible: false,
      childSelectRows: [],
      mainRow: {},
      nowRow: {}
    }
  },
  methods: {
    /** 子表内容获取 */
    childApi(row) {
      return getInfoDetailOutWarehousing({ orderCode: row.orderCode }).then(res => {
        if (!res || !res.data || !res.data[0]) return
        return res.data[0].queryOutWarehouseOrderDetailVOSList || []
      })
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['doubleList'].fetchData()
    },
    /** 子表多选 */
    childSelectionChange(selectRows, mainRow) {
      this.childSelectRows = selectRows
      this.mainRow = mainRow
    },
    /** 打印麦头 */
    printMark(row) {
      this.nowRow = row
      this.printMarkDialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>