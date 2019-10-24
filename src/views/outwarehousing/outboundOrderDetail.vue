<template>
  <div v-loading="outWarehouseOrderDetailLoading">
    <div class="mb20">
      <!-- 收货中 & 已激活 可见 -->
      <el-button
        type="primary"
        :loading="receiveConfirmLoading"
      >
        收货确认
      </el-button>
    </div>
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
        :showControl="true"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            :disabled="scope.row.planQty == scope.row.receiveQty"
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
        出库明细
      </div>
      <base-table
        :config="detailItemDosConfig"
        :data="detail.detailItemDos"
        :showControl="true"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <!-- 收货中  未上架 -->
          <template>
            <el-link
              type="primary"
              @click="handleDelete(scope.row)"
            >删除</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link
              type="primary"
              @click="handleModify(scope.row)"
            >编辑</el-link>
          </template>
          <!-- 已激活 未上架 -->
          <el-link
            type="primary"
            @click="handleDiscard(scope.row)"
          >作废</el-link>
        </template>
      </base-table>
    </el-card>
  </div>
</template>
<script>
import { outWarehouseOrderDetail } from '@/api'

const detailItemConfig = [
  { label: '收货单号 ', prop: 'orderCode' },
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  // { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  // { label: '收货状态', prop: 'execStatus', type: 'enum', enum: 'receiveState' },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const detailDOsConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '预期收货量', prop: 'planQty' },
  { label: '实际收货量', prop: 'receiveQty' },
]
const detailItemDosConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '实际收货量', prop: 'receiveQty' },
  // { label: '上架状态', prop: 'isPut', type: 'enum', enum: 'execStatuslist' },
]

export default {
  data() {
    return {
      outWarehouseOrderDetailLoading: true,
      receiveConfirmLoading: false,
      detailItemConfig,
      detailDOsConfig,
      detailItemDosConfig,
      detail: {
        receiveOrderDO: {},
        detailDOs: [],
        detailItemDos: []
      },
      nowRow: null,
      modifyRow: null,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /** 获取详情内容 */
    initData() {
      outWarehouseOrderDetail(this.$route.query.id).then(res => {
        this.outWarehouseOrderDetailLoading = false
        if (!res) return
        console.log(res.data)
        res.data.outWarehouseJobVOList = res.data.outWarehouseJobVOList || []
        res.data.outWarehouseOrderDetailVoList = res.data.outWarehouseOrderDetailVoList || []
        this.detail = res.data
      })
    },
    /** 编辑 按钮点击 */
    handleModify(row) {
      this.receivingModifyDialogVisible = true
      this.modifyRow = row
    },
  },
}
</script>