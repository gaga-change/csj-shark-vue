<template>
  <div class="DeliverComponent">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="logisticsRecord(scope.row)"
        >物流跟踪</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="logisticsHandle(scope.row)"
        >物流登记</el-link>
      </template>
      <template slot="btns">

      </template>
    </base-list>

    <el-dialog
      :title="'新增物流登记'"
      :visible.sync="dialogVisible"
    >
      <item-title text="基本信息" />
      <item-card
        :config="baseInfoConfig"
        :loading="false"
        boxStyle="padding-bottom: 0;"
        :cardData="selectData"
      />
      <div style="padding-top:12px;">
        <item-title text="待填信息" />
      </div>
      <el-form
        :model="logisticsForm"
        class="formInput"
        :rules="logisticsRules"
        ref="subForm"
        :height="200"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="物流公司名称"
          label-width="100px"
          :rules="[{ required: true, message: '该项为必选'}]"
          prop="logisticsComCode"
        >
          <el-select
            v-model="logisticsForm.logisticsComCode"
            clearable
            placeholder="请选择物流公司"
            size="mini"
            prefix-icon="el-icon-search"
          >
            <el-option
              v-for="item in deliverCompanyAll"
              :key="item.companyCode"
              :label="item.companyName"
              :value="item.companyCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="物流单号"
          :rules="[ { required: true, message: '该项为必填'}]"
          prop="logisticsOrderCode"
        >
          <el-input
            type="text"
            size="mini"
            placeholder="请输入物流单号"
            v-model="logisticsForm.logisticsOrderCode"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="件数"
          :rules="[{ required: true, message: '该项为必填'}]"
          prop="carrierQty"
        >
          <el-input
            type="number"
            size="mini"
            placeholder="请输入件数"
            v-model.number="logisticsForm.carrierQty"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="运费"
          :rules="[{ required: true, message: '该项为必填'}]"
          prop="freightAmt"
        >
          <el-input
            type="number"
            size="mini"
            placeholder="请输入运费"
            v-model="logisticsForm.freightAmt"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="其它费用"
          prop="otherAmt"
        >
          <el-input
            type="number"
            size="mini"
            placeholder="请输入其它费用"
            v-model="logisticsForm.otherAmt"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="物流总额"
          prop="skuAmt"
        >
          <el-input
            type="number"
            size="mini"
            placeholder="请输入物流总额"
            v-model="logisticsForm.skuAmt"
            disabled
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="运费承担方"
          label-width="100px"
          prop="payType"
          :rules="[{ required: true, message: '该项为必选'}]"
        >
          <el-select
            v-model="logisticsForm.payType"
            size="mini"
          >
            <el-option
              key="我方承担"
              placeholder="请输入运费承担方"
              label="我方承担"
              :value="0"
            >
            </el-option>

            <el-option
              key="客户承担"
              label="客户承担"
              :value="1"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="备注"
          prop="remarkInfo"
        >
          <el-input
            type="text"
            size="mini"
            placeholder="请输入备注"
            v-model="logisticsForm.remarkInfo"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="mini"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitDeliver"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'物流详情'"
      :visible.sync="dialogVisibleDeliver"
    >
      <deliver-detail :detailData="detailData" />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogVisibleDeliver = false"
        >关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addLogisticsRegister, getLogisticsRegisterInfo, getLogisticsRegisterList, getLogisticsSelectList } from '@/api'
import { busiBillTypeEnum, registerStatusEnum, logisticsStatusEnum, payTypeEnum } from '@/utils/enum'
import DeliverDetail from './components/deliverDetailInfo'

const baseInfoConfig = [
  { title: '计划单号', prop: 'planCode', span: 8 },
  { title: '下单时间', prop: 'placeOrderTime', type: 'time', span: 8 },
  { title: '收货人', prop: 'receiver', span: 8 },
  { title: '收货地址', prop: 'receiveAddress', span: 8 },
]
const tableConfig = [
  { label: '下单时间', prop: 'placeOrderTime', width: 140, type: 'time' },
  { label: '计划单号', prop: 'planCode', width: 150 },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: busiBillTypeEnum, minWidth: 90 },
  { label: '供应商', prop: 'ownerName', width: 150 },
  { label: '登记状态', prop: 'register', minWidth: 90, type: 'enum', enum: registerStatusEnum },
  { label: '收货人', prop: 'receiver', width: 120 },
  { label: '收获地址', prop: 'receiveAddress', width: 120 },
  { label: '联系电话', prop: 'linkTel', width: 150 },
  { label: '物流公司', prop: 'logisticsComName', width: 150 },
  { label: '物流单号', prop: 'logisticsOrderCode', width: 150 },
  { label: '件数', prop: 'carrierQty', width: 150 },
  { label: '运费承担方', prop: 'payType', width: 150, type: 'enum', enum: payTypeEnum },
  { label: '运费', prop: 'freightAmt', width: 90, type: 'money' },
  { label: '配送状态', prop: 'logisticsStatus', width: 90, type: 'enum', enum: logisticsStatusEnum },
  { label: '到达时间', prop: 'deliverTime', width: 120, type: 'time' },
]
const searchConfig = [
  { label: '计划单号', prop: 'planCode' },
  { label: '物流公司', prop: 'logisticsComCode', type: 'enum', enum: [] },
  { label: '登记状态', prop: 'register', type: 'enum', enum: registerStatusEnum },
  { label: '货主', prop: 'ownerName' },
  { label: '下单时间', prop: 'createTimeArea', props: ['placeOrderStartDate', 'placeOrderEndDate'], type: 'timeArea' },
]

export default {
  components: { DeliverDetail },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: getLogisticsRegisterList,

      dialogVisible: false,
      dialogData: {},
      dialogTitle: '',
      logisticsRules: {},
      logisticsForm: {},
      detailData: [],
      dialogVisibleDeliver: false,
      deliverCompanyAll: [],
      baseInfoConfig,
      selectData: {}
    }
  },
  computed: {
    skuAmt: function () {
      var a = (this.logisticsForm.freightAmt || 0) - 0 + (this.logisticsForm.otherAmt || 0)
      this.logisticsForm.skuAmt = a
      return a
    }
  },
  watch: {
    logisticsForm: {
      handler(val, oldval) {
        this.logisticsForm.skuAmt = (this.logisticsForm.freightAmt || 0) - 0 + ((this.logisticsForm.otherAmt || 0) - 0)

      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getLogisticsList()
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 新增物流登记 */
    submitDeliver() {
      this.$refs['subForm'].validate((valid) => {
        if (valid) {
          addLogisticsRegister({ ...this.logisticsForm, id: this.selectData.id }).then(res => {
            if (res) {
              this.$message({ type: 'success', message: '新增物流登记成功' })
              this.dialogVisible = false
              this.getTableData()
            }
          })
        } else {
          return false;
        }
      })
    },
    /** 物流跟踪 按钮点击 */
    logisticsRecord(data) {
      this.logisticsForm = { ...data }
      if (data.register) {
        getLogisticsRegisterInfo({
          logisticsComCode: data.logisticsComCode,
          logisticsOrderCode: data.logisticsOrderCode,
          logisticsRegisterId: data.id
        }).then(res => {
          if (res) {
            this.dialogVisibleDeliver = true
            this.detailData = res.data
          }
        })
      } else {
        this.$message({
          type: 'info',
          message: '该单据尚未登记'
        })
      }
    },
    /** 物流登记 按钮点击 */
    logisticsHandle(row) {
      this.selectData = row
      this.logisticsForm = {}
      this.dialogVisible = true
    },
    /** 获取物流列表 */
    getLogisticsList() {
      getLogisticsSelectList().then(res => {
        if (res) {
          let item = this.searchConfig.find(v => v.prop === 'logisticsComCode')
          res.data = res.data || []
          this.$set(item, 'enum', res.data.map(v => ({
            name: v.companyName,
            value: v.companyCode
          })))
          this.deliverCompanyAll = res.data
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.DeliverComponent {
  .formInput {
    input {
      width: 220px;
    }
  }
  .baseInfo {
    display: flex;
    line-height: 24px;
    margin-bottom: 12px;
  }

  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
