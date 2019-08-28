<template>
  <div style="margin-bottom:10px">
    <el-button
      size="mini"
      type="primary"
      @click="priviewBoxLabel()"
    >
      打印出库明细
    </el-button>
    <print-table-dialog
      :visible.sync="printTableDialogVisible"
      title="打印出库明细"
      :topConfig="printTopConfig"
      :tableConfig="printTableConfig"
      :detail="detail"
      :tableData="childData"
    ></print-table-dialog>
  </div>
</template>
<script>
import moment from 'moment'

const printTopConfig = [
  { label: '客户编码', prop: 'customerCode' },
  { label: '客户名称', prop: 'customerName' },
  { label: '客户地址', prop: 'arrivalAddress' },
]

const printTableConfig = [// 计划单打印列表
  { label: '计划单号', prop: 'planCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuModel' },
  { label: '数量', prop: 'realOutQty' },
  { label: '单位', prop: 'skuUnitCode' },
]

export default {
  data() {
    return {
      printTableConfig,
      printTopConfig,
      printTableDialogVisible: false,
    }
  },
  props: {
    childSelectRows: {
      type: Array,
      default: () => []
    },
    mainRow: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    childData() {
      let temp = this.childSelectRows || []
      let mainRow = this.mainRow || {}
      return temp.map(v => ({ ...mainRow, ...v }))
    },
    detail() {
      return this.mainRow || {}
    }
  },
  methods: {
    //打印出库明细
    priviewBoxLabel() {
      if (!this.childData.length) {
        this.$message({ type: 'error', message: '未选择子表里商品' });
        return
      }
      this.printTableDialogVisible = true
    },
  }
}
</script>
