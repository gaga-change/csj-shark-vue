<template>
  <div style="margin-bottom:10px">
    <el-button
      type="primary"
      size="mini"
      @click="priviewReserve"
    >
      打印计划单
    </el-button>

    <div>
      <el-dialog
        title="打印计划单"
        :visible.sync="dialogVisibleReserve"
        width="841px"
      >
        <edit-table
          :config="planChildTablePrintConfig"
          :table-data="printPlan"
          id="printPlanContainer"
          :default-edit="false"
        >
        </edit-table>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dialogVisibleReserve = false"
          >取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="printPlanOrder"
          >打印</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import editTable from '@/components/Table/editTable'
import { outboundOrderSubmit, pickOrderAdd, modifyOutPrint } from '@/api'
import { PositiveIntegerReg, MoneyPositiveReg } from '@/utils/validator'
import { MakePrint } from '@/utils'
import { planChildTableEditConfig, planChildTableLabelConfig, planChildTablePrintConfig } from './config'
import { printPlanDataFn } from './dataHandler'

export default {
  name: 'operationButton',
  components: {
    editTable
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisibleLabel: false,
      dialogVisibleReserve: false,
      previewIt: true,
      loading: false,
      childData: [],
      planChildTableEditConfig,
      planChildTableLabelConfig,
      planChildTablePrintConfig,
      printPlan: [],//打印计划单
      defaultCanedit: true,
      PickingOrderData: [],
      pickOperatorName: '',
    }
  },
  props: {
    parentDataObj: {
      type: Object,
      default: () => { }
    },
    childDataArr: {
      type: Array,
      default: () => []
    },
    planPrintData: {
      type: Array,
      default: () => []
    },
    orderType: {
      type: String,
      default: ''
    },
    activePlanCode: {
      type: String,
      default: ''
    },
    selectChiledByPlanCode: {
      type: Object,
      default: () => { }
    }
  },


  methods: {
    printLabel() {
      var childData = [...this.childData]
      this.childData = childData.map(v => {
        v.editable = false;
        return v
      })

      setTimeout(() => {
        let label = document.getElementById('print').innerHTML
        //样式暂时不可配，需优化
        let style = "<style type='text/css'>.border{border:1px solid #666;width:530px;display:inline-block;padding:10px;} .marginRight5{margin-right:5px;} table {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;} img{max-width:130px;} .card-list{margin-bottom: 6px;width:25%;display:inline-block} .el-dropdown{display:inline-block} </style>"
        MakePrint(label, style)
      }, 500)
    },

    priviewReserve() {
      this.printPlan = [...printPlanDataFn([...this.planPrintData])]
      if (!this.printPlan.length) {
        this.$message({ type: 'error', message: '未选择单据,可点击任意行选择' });
        return
      }
      this.dialogVisibleReserve = true
    },

    printPlanOrder() {
      let data = []
      this.printPlan.map(item => {
        data.push(item.id)
      })
      modifyOutPrint({ ids: data }).then(res => {

      })
      var printPlanContainer = document.getElementById('printPlanContainer').innerHTML
      MakePrint(printPlanContainer)
    },
  }
}
</script>

<style scoped lang="scss">
.labelContainer {
  width: 180px;
  .labelItemLeft {
    display: inline-block;
    width: 60px;
    margin-right: 10px;
  }
}
</style>

