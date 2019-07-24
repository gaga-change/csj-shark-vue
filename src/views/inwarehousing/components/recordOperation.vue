<template>
  <div
    style="margin-bottom:10px"
    class="RecordOperation"
  >
    <el-button
      type="primary"
      size="small"
      @click="makeInbound"
    >收货登记</el-button>
    <el-button
      type="primary"
      size="small"
      @click="priviewProductLabel"
    >打印商品标签</el-button>
    <div>
      <el-dialog
        title="收货登记"
        :visible.sync="dialogVisible"
        width="70%"
      >
        <el-row
          :gutter="20"
          style="margin-bottom:14px;"
        >
          <el-col :span="8">入库计划单: {{parentDataObj.planCode}}</el-col>
          <el-col :span="8">供应商: {{parentDataObj.providerName}}</el-col>
          <el-col :span="8">下单时间: {{formateTime(parentDataObj.gmtCreate)}}</el-col>
        </el-row>
        <base-table
          :config="businessChildTableEditConfig"
          :tableData="childData"
          controlName="批次"
          :showControl="true"
          :controlWidth="240"
          :total="childData.length"
          :maxTotal="9999"
        >
          <template
            slot="edit"
            slot-scope="scope"
          >
            <span style="margin: 5px 10px;">{{scope.row.receiveListText}}</span>
            <span
              class="link_dom"
              @click="upperShelf(scope.row)"
            >添加</span>
          </template>
        </base-table>
        <el-alert
          class="mt15"
          title="注："
          type="info"
        >

          <p>1. 同一商品，不同批次正品数量相加≤总数量-已收数量</p>
          <p>2. 正品 = 不同批次正品数量相加</p>
        </el-alert>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm()"
            :loading="orderAddLoading"
          >收货确认</el-button>
        </span>
        <el-dialog
          custom-class="RecordOperation"
          width="70%"
          title="添加批次"
          :visible.sync="innerVisible"
          append-to-body
        >
          <el-form
            :model="addSearchForm"
            :inline="true"
            label-width="70px"
            label-position="left"
          >
            <el-form-item
              label-width="40px"
              label="批次"
            >
              <el-input
                style="width:200px"
                :maxlength="50"
                v-model="addSearchForm.batchNo"
                size="mini"
              />
            </el-form-item>

            <el-form-item
              label-width="60px"
              label="正品数量"
            >
              <el-input-number
                type="text"
                size="mini"
                style="width:200px"
                :min="0"
                :max="99999999"
                :precision="0"
                v-model="addSearchForm.receiveQty"
                placeholder="请输入正品数量"
              >
              </el-input-number>
            </el-form-item>

            <el-form-item class="addButton">
              <el-button
                type="primary"
                size="small"
                @click="addBatch"
              >添加</el-button>
            </el-form-item>
          </el-form>

          <edit-table
            :loading="false"
            @dataChange="deleteByindex"
            emptyText="请并输入批次、数量添加数据"
            :config="batchNoConfig"
            :deleteNeed="true"
            :useEdit="false"
            :tableData="batchNoListTable"
          />

          <div class="alertBottomArr">
            <el-button
              type="primary"
              size="small"
              @click="sureWarehouse"
            >确认</el-button>
            <el-button
              type="primary"
              size="small"
              @click="cancelWarehouse"
            >取消</el-button>
          </div>
        </el-dialog>
      </el-dialog>

      <el-dialog
        title="打印商品标签"
        :visible.sync="dialogVisibleLabel"
        width="70%"
      >
        <edit-table
          :config="planChildTableLabelConfig"
          :table-data="childData"
          v-loading="loading"
          :default-edit="false"
        ></edit-table>
        <template v-if="!previewIt">
          <div style="margin:10px;">预览</div>
          <div
            id="print"
            style="width:80mm;height:40mm;overflow:auto;margin:10px;"
          >
            <div
              v-for="item in childData"
              :key="item.skuCode"
            >
              <div
                v-for="i in Number(item.printNum)"
                :key="i"
                class="labelContainer"
              >
                <div class="labelItem"><span class="labelItemLeft">商品编码</span><span>{{item.skuCode}}</span></div>
                <div class="labelItem"><span class="labelItemLeft">商品名称</span><span>{{item.skuName}}</span></div>
                <div class="labelItem"><span class="labelItemLeft">规格型号</span><span>{{item.skuFormat}}</span></div>
                <div class="labelItem"><span class="labelItemLeft">货主</span><span>{{item.ownerName}}</span></div>
                <div>
                  <bar-code :code="item.batchNo"></bar-code>
                </div>
              </div>
            </div>
          </div>
        </template>
        <span
          slot="footer"
          class="dialog-footer"
          v-loading="loading"
        >
          <el-button @click="dialogVisibleLabel = false">取 消</el-button>
          <el-button
            type="primary"
            @click="getCode"
          >预览</el-button>
          <el-button
            type="primary"
            v-if="!previewIt"
            @click="printLabel"
          >打印</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import BaseTable from '@/components/Table'
import editTable from '@/components/Table/editTable'
import { orderAdd, getBatchNo } from '@/api'
import { PositiveIntegerReg, MoneyPositiveReg } from '@/utils/validator'
import { MakePrint } from '@/utils'
import { batchNoConfig, businessChildTableEditConfig, planChildTableLabelConfig, planChildTablePrintConfig } from './config'
import { printPlanDataFn } from './dataHandler'

export default {
  name: 'RecordOperation',
  components: {
    BaseTable,
    editTable
  },
  data() {
    return {
      orderAddLoading: false,
      innerVisible: false,
      dialogVisible: false,
      dialogVisibleLabel: false,
      dialogVisibleReserve: false,
      previewIt: true,
      loading: false,
      parentData: {},
      childData: [],
      batchNoConfig,
      businessChildTableEditConfig,
      planChildTableLabelConfig,
      planChildTablePrintConfig,
      batchNoListTable: [],
      selectRow: null,
      printPlan: [],//打印计划单
      addSearchForm: {
        batchNo: '',
        receiveQty: 0,
      }
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
    }
  },
  methods: {
    /** 确认 */
    sureWarehouse() {
      this.selectRow.receiveList = [...this.batchNoListTable]
      this.$set(this.selectRow, 'receiveListText', this.batchNoListTable.map(v => v.batchNo).join(','))
      this.$set(this.selectRow, 'receiveQty', this.batchNoListTable.reduce((num, v) => v.receiveQty + num, 0))
      this.cancelWarehouse()
    },
    /** 取消 */
    cancelWarehouse() {
      this.innerVisible = false
      this.batchNoListTable = []
      this.addSearchForm = {
        batchNo: '',
        receiveQty: 0,
      }
    },
    /** 批次删除 */
    deleteByindex(index) {
      let temp = [...this.batchNoListTable]
      temp.splice(index, 1)
      this.batchNoListTable = temp
    },
    /** 添加批次 */
    addBatch() {
      for (let key in this.addSearchForm) {
        if (this.addSearchForm[key] === '') {
          this.$message({ type: 'error', message: '库位和数量都是必填参数' });
          return
        }
      }
      if (this.addSearchForm.receiveQty === 0) {
        this.$message({ type: 'error', message: '数量不能为0' });
        return
      }
      let json = { id: moment().valueOf(), ...this.addSearchForm };
      this.batchNoListTable.push(json)
      this.addSearchForm = {
        batchNo: '',
        receiveQty: 0,
      }
    },
    upperShelf(row) {
      this.selectRow = row
      this.innerVisible = true
      this.batchNoListTable = row.receiveList || [];
    },
    formateTime(val) {
      return moment(val).format('YYYY-MM-DD HH:MM:SS')
    },
    makeInbound() {
      var usable = this.checkDataUsable();
      if (usable.objectUsabel && usable.arrUsabel) {
        this.dialogVisible = true;
      } else {
        this.$message({ type: 'info', message: '请选择单据和商品' })
      }

    },
    priviewProductLabel() {
      var usable = this.checkDataUsable();
      if (usable.arrUsabel) {
        this.dialogVisibleLabel = true
        this.previewIt = true
      } else {
        this.$message({ type: 'info', message: '请选择单据和商品' })
      }
    },
    getBatchNoArr(batchNoArr) {
      var arr = [], brr = []
      for (var i = 0; i < batchNoArr.length; i++) {
        let req = getBatchNo(batchNoArr[i])
        arr.push(req)
        brr.push(i)
      }
      return axios.all(arr).then(axios.spread((...brr) => {
        return brr
      }))
    },
    async getCode() {
      var childData = [...this.childData]
      var batchNoArr = []
      var canPriview = true
      childData.map(item => {
        if (!PositiveIntegerReg.test(item.printNum)) {
          canPriview = false
        }
        batchNoArr.push({ skuCode: item.skuCode, ownerCode: this.parentData.ownerCode, providerCode: this.parentData.providerCode })
      })
      if (!canPriview) {
        this.$message({ type: 'error', message: '打印张数为正整数' })
        return false
      }
      var abb = await this.getBatchNoArr(batchNoArr)
      abb.map(item => {
        if (item && item.data && item.data.batchNo) {
          childData = childData.map(child => {
            if (item.data.skuCode == child.skuCode) {
              child.batchNo = item.data.batchNo
            }
            return child
          })
        } else {
          canPriview = false
        }
      })
      if (!canPriview) {
        this.$message({ type: 'error', message: '批次号查询出错，请重试' })
        return false
      }
      this.childData = [...childData]
      this.previewIt = false

    },
    printLabel() {
      var label = document.getElementById('print').innerHTML
      //样式暂时不可配，需优化
      var style = "<style type='text/css'>.labelContainer{width:80mm; height:40mm;overflow:hidden;border-bottom: 1px dashed #eee;}.labelItem{ height:5mm;line-height: 5mm; font-weight: 600;font-size: 13px;}.labelContainer .labelItemLeft{display:inline-block;width:70px;margin-right:20px;} img{width:40mm;height:15mm}</style>"
      MakePrint(label, style)
    },
    checkDataUsable() {
      var a = { ...this.parentDataObj }
      var b = this.childDataArr.map((item, index) => {
        item.editable = true;
        item.printNum = item.realInQty;
        item.ownerName = a.ownerName; item.providerName = a.providerName;
        return item
      })
      this.childData = [...b]
      this.parentData = { ...a }
      var objectUsabel = Object.keys(a).length > 0
      var arrUsabel = b.length > 0
      return {
        objectUsabel, arrUsabel
      }
    },
    priviewReserve() {
      if (this.planPrintData.length > 0) {
        this.dialogVisibleReserve = true
        this.printPlan = [...printPlanDataFn([...this.planPrintData])]
      } else {
        this.$message({ type: 'info', message: '请选择单据' })
      }
    },
    printPlanOrder() {
      var printPlanContainer = document.getElementById('printPlanContainer').innerHTML
      MakePrint(printPlanContainer)
    },

    submitForm(type) {//提交
      if (this.childData.some(v => v.planInQty - v.hasReceiveQty < v.receiveQty)) {
        return this.$message({ type: 'error', message: '同一商品，不同批次正品数量相加≤总数量-已收数量' });
      }
      if (this.childData.some(v => v.receiveQty === 0)) {
        return this.$message({ type: 'error', message: '请添加批次！' });
      }
      let isConfirm = true
      this.childData.map(item => {
        if (item.badReceiveQty) {
          if (Number(item.badReceiveQty) <= 0) {
            this.$message({ type: 'error', message: '残次品数量要大于等于0' })
            isConfirm = false
            return
          }
        }
      })
      if (!isConfirm) {
        return
      }
      let data = [...this.childData].map(v => {
        return v
      })
      let Api = orderAdd;
      this.orderAddLoading = true
      Api({
        planCode: this.parentDataObj.planCode,
        receiveOrderDetailReqList: data
      }).then(res => {
        this.orderAddLoading = false
        if (res) {
          this.dialogVisible = false;
          this.$message({ type: 'success', message: '操作成功！' })
          this.$emit('lodash')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.labelContainer {
  width: 80mm;
  height: 40mm;
  overflow: hidden;
  border-bottom: 1px dashed #eee;
  .labelItem {
    height: 5mm;
    line-height: 5mm;
    font-weight: 600;
    font-size: 13px;
  }
  .labelItemLeft {
    display: inline-block;
    width: 60px;
    margin: 0 10px;
  }
  img {
    width: 40mm;
    height: 15mm;
    margin: 0 auto;
  }
}
.RecordOperation {
  .alertBottomArr {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
  }
}
</style>

