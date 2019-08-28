<template>
  <div v-loading="receiveOrderQueryDetailsLoading">
    <el-card shadow="never">
      <div slot="header">
        基本信息
      </div>
      <detail-item
        :config="detailItemConfig"
        :detail="detail.receiveOrderDO"
        :labelWidth="100"
      />
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        商品明细
      </div>
      <base-table
        :config="detailDOsConfig"
        :data="detail.detailDOs"
        :showControl="receivingRegisterShow"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="handleReceivingRegister(scope.row)"
          >收货登记</el-link>
        </template>
      </base-table>
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        收货明细
      </div>
      <base-table
        :config="detailItemDosConfig"
        :data="detail.detailItemDos"
        :showControl="receivingRegisterShow"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <!-- 收货中  未上架 -->

          <!-- <template v-if="detail.receiveOrderDO.execStatus===1 && scope.row.isPut === 0"> -->
          <el-link
            type="primary"
            @click="handleDelete(scope.row)"
          >删除</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link
            type="primary"
            @click="handleModify(scope.row)"
          >编辑</el-link>
          <!-- </template> -->

          <!-- 已激活 未上架 -->
          <el-link
            type="primary"
            @click="handleDiscard(scope.row)"
            v-if="detail.receiveOrderDO.execStatus===3 && scope.row.isPut === 0"
          >作废</el-link>
        </template>
      </base-table>
    </el-card>
    <receiving-register-dialog
      :visible.sync="receivingRegisterDialogVisible"
      :row="nowRow"
      @submited="initData"
    />
  </div>
</template>
<script>
import { receiveOrderQueryDetails, receiveOrderDeleteOrInvalid } from '@/api'
import { busiBillTypeEnum, receiveState, execStatuslist } from '@/utils/enum'
import receivingRegisterDialog from './components/receivingRegisterDialog'

const detailItemConfig = [
  { label: '收货单号 ', prop: 'orderCode' },
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: busiBillTypeEnum },
  { label: '收货状态', prop: 'execStatus', type: 'enum', enum: receiveState },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]

const detailDOsConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '预期收货量', prop: 'planQty' },
  { label: '实际收货量', prop: 'receiveQty' },
]

const detailItemDosConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '实际收货量', prop: 'receiveQty' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: execStatuslist },
]

export default {
  components: { receivingRegisterDialog },
  data() {
    return {
      receiveOrderQueryDetailsLoading: true,
      detailItemConfig,
      detailDOsConfig,
      detailItemDosConfig,
      receivingRegisterDialogVisible: false,
      detail: {
        receiveOrderDO: {},
        detailDOs: [],
        detailItemDos: []
      },
      nowRow: null,
    }
  },
  created() {
    this.initData()
  },
  computed: {
    receivingRegisterShow() {
      return !!~[0, 1, 3].findIndex(v => v == this.detail.receiveOrderDO.execStatus)
    }
  },
  methods: {
    /** 获取详情内容 */
    initData() {
      receiveOrderQueryDetails({ id: this.$route.query.id }).then(res => {
        this.receiveOrderQueryDetailsLoading = false
        if (!res) return
        res.data.detailItemDos = res.data.detailItemDos || []
        res.data.detailDOs = res.data.detailDOs || []
        this.detail = res.data
      })
    },
    /** 收货登记 点击 */
    handleReceivingRegister(row) {
      this.receivingRegisterDialogVisible = true
      this.nowRow = row
    },
    /** 删除 按钮点击 */
    handleDelete(row) {
      this.$apiConfirm('是否确定删除？', () => receiveOrderDeleteOrInvalid({ status: 0, itemId: row.id })).then(() => {
        this.$message.success('操作成功！')
        this.initData()
      }).catch(() => { })
    },
    /** 编辑 按钮点击 */
    handleModify(row) {

    },
    /** 废弃 按钮点击 */
    handleDiscard(row) {
      this.$apiConfirm('是否确定作废？', () => receiveOrderDeleteOrInvalid({ status: 1, itemId: row.id })).then(() => {
        this.$message.success('操作成功！')
        this.initData()
      }).catch(() => { })
    },

  },
}
</script>