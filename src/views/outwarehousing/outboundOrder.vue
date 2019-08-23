<template>
  <div>
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
      :showControlFixed="false"
      :expand="true"
      @expandChange="hanldeExpandChange"
      :parseData="parseData"
    >
      <template slot-scope="scope">
        <!-- <el-link type="primary">修改</el-link> -->
      </template>
      <template
        slot="expand"
        slot-scope="scope"
      >
        <base-table2
          :ref="`childTable-${scope.index}`"
          :config="childTableConfig"
          :data="scope.row.childData"
          :loading="scope.row.childLoading"
          :select="true"
          @selectionChange="rows => childSelectionChange(rows, scope.row, scope.index)"
        >
        </base-table2>
      </template>
      <template slot="btns">
        <operation-button :data="childSelectRows" />
      </template>
    </base-list>
  </div>
</template>

<script>
import { getInfoOutWarehousing, getInfoDetailOutWarehousing } from '@/api'
import operationButton from './components/outButton'
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
  components: { operationButton },
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: getInfoOutWarehousing,
      childSelectRows: [],
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.childData = []
        v.childLoading = false
      })
      return { data, total }
    },
    /** 子表多选 */
    childSelectionChange(selectRows, mainRow, index) {
      let oldIndex = this.childSelectRows.index
      let oldRows = this.childSelectRows
      if (oldIndex !== index && (selectRows.length !== 0 || oldRows.length === 0)) {
        // 更换列
        this.childSelectRows = [...selectRows]
        this.childSelectRows.index = index
        this.childSelectRows.mainRow = mainRow
        if (oldIndex !== undefined) {
          // 准备重置 上一个列
          this.$nextTick(() => {
            this.$refs[`childTable-${oldIndex}`].clearSelection()
          })
        }
      } else if (oldIndex === index) {
        // 更新列
        this.childSelectRows = [...selectRows]
      } else {
        // 被重置
      }
    },
    /** 子列表展开 */
    hanldeExpandChange(row) {
      row.childLoading = true
      getInfoDetailOutWarehousing({ orderCode: row.orderCode }).then(res => {
        row.childLoading = false
        if (!res || !res.data || !res.data[0]) return
        row.childData = res.data[0].queryOutWarehouseOrderDetailVOSList || []
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>