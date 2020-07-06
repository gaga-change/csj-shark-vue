<template>
  <div>
    <double-list
      ref="doubleList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :childApi="childApi"
      :childTableConfig="childTableConfig"
      :childSelect="false"
      :childShowIndex="true"
      :select="true"
      @selectionChange="selectionChange"
      :selectable="selectable"
      :appendSearchParams="appendSearchParams"
      :labelWidth="100"
    >
      <template slot-scope="scope">
        <el-link
          :disabled="scope.row.receiveStatus !== 1"
          type="primary"
          @click="handleClose(scope.row)"
        >完结</el-link>
      </template>
      <template slot="btns">
        <el-button
          v-if="!isYatai"
          type="primary"
          :disabled="!selectRows.length"
          @click="handleCreateReceiveOrder"
          :loading="createReceiveOrderLoading"
        >
          创建收货单
        </el-button>
        <el-button
          v-if="isYatai"
          type="primary"
          :disabled="!selectRows.length"
          @click="handleCreateReceiveOrderYatai"
          :loading="createReceiveOrderLoading"
        >
          创建收货单
        </el-button>
        <el-button
          type="primary"
          @click="$router.push('/inwarehousing/inPlanAdd')"
        >
          创建计划单
        </el-button>
        <el-button
          type="primary"
          @click="lockDialogVisible=true"
        >
          商品锁定计划
          <el-tag
            v-show="lockParamsStr"
            closable
            @close="handleCloseTag"
            type="success"
          >
            {{lockParamsStr}}
          </el-tag>
        </el-button>
      </template>
    </double-list>
    <lockDialog
      :visible.sync="lockDialogVisible"
      @submited="getTableData"
    />
    <createInrecordYataidialog
      :visible.sync="createInrecordYataidialogVisible"
      :rows="selectRows"
      @submited="getTableData"
    />
  </div>
</template>

<script>
import { getInfoWarehousing, getInfoDetailWarehousing, createReceiveOrder, planInEnd } from '@/api'
import { mapGetters } from 'vuex'
import lockDialog from './components/lockDialog'
import createInrecordYataidialog from './components/createInrecordYataidialog'
const childTableConfig = [
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '货主商品编码', prop: 'ownerSkuCode', width: 150 },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '计划量', prop: 'planInQty' },
  { label: '收货待确认量', prop: 'unconfirmReceiveQty' },
  { label: '已收货量', prop: 'confirmedReceiveQty' },
]
const tableConfig = [
  { label: '入库计划单号 ', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'receiveStatus', type: 'enum', enum: 'receiveStateEnum' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum_in' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '下单时间', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '计划到货日期', prop: 'planInWarehouseTime', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '状态', prop: 'receiveStatus', type: 'enum', enum: 'receiveStateEnum' },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum_in' },
  { label: '下单时间', prop: 'createTimeArea', props: ['createBeginDate', 'createEndDate'], type: 'timeArea' },
]

export default {
  components: { lockDialog, createInrecordYataidialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      lockDialogVisible: false,
      createInrecordYataidialogVisible: false,
      listApi: getInfoWarehousing,
      selectRows: [],
      appendSearchParams: {},
      lockParamsStr: '',
      createReceiveOrderLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'chooseWarehouse',
    ]),
    isYatai() {
      return this.chooseWarehouse === 'D202007010001'
    }
  },
  methods: {
    handleCloseTag() {
      this.lockParamsStr = ''
      this.appendSearchParams = { skuCodeList: undefined, providerCodeOrName: undefined }
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    /** 完结按钮点击事件 */
    handleClose(row) {
      this.$apiConfirm('确认完结该计划单', () => planInEnd({
        planId: row.id
      })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 子表内容获取 */
    childApi(row) {
      return getInfoDetailWarehousing({ planCode: row.planCode }).then(res => {
        if (!res || !res.data) return
        return res.data.inWarehousePlanDetailRespList || []
      })
    },
    /** 可选条件 */
    selectable(row) {
      return row.receiveStatus === 0 || row.receiveStatus === 1
    },
    /** 清除选中 */
    clearSelection() {
      this.$refs['doubleList'].clearSelection()
    },
    /** 刷新列表 */
    getTableData(params) {
      if (params) {
        const { skuCode, providerCode, ownerSkuCode, outProviderCode } = params
        this.lockParamsStr = `货主商品编码：【${ownerSkuCode || ''}】、外部供应商编码：【${outProviderCode || ''}】`
        this.appendSearchParams = { skuCodeList: [skuCode], providerCodeOrName: providerCode }
      }
      this.$nextTick(() => {
        this.$refs['doubleList'].fetchData()
      })
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 创建收货单【亚太仓】 - 弹窗 */
    handleCreateReceiveOrderYatai() {
      if (this.selectRows.length > 1) {
        // 若勾选了多笔计划单，计划单同为货主EP001或同为非EP001时，跳转弹框维护存储地点；混合勾选时，报错文案：自营和非自营单据不能同时被勾选
        const ep001Num = this.selectRows.filter(v => v.ownerCode === 'EP001').length
        if (ep001Num > 0 && ep001Num < this.selectRows.length) {
          return this.$message.error("自营和非自营单据不能同时被勾选")
        }
      }
      this.createInrecordYataidialogVisible = true
    },
    /** 创建收货单 */
    handleCreateReceiveOrder() {
      this.createReceiveOrderLoading = true
      createReceiveOrder(this.selectRows.map(v => ({
        planOrderId: v.id,
        planOrderCode: v.planCode
      }))).then(res => {
        this.createReceiveOrderLoading = false
        if (!res) return
        this.$message.success('收货单创建完成！3秒后将自动跳转收货单列表页。')
        this.clearSelection()
        setTimeout(() => {
          this.$router.push('/inwarehousing/inrecord')
        }, 3000);
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
