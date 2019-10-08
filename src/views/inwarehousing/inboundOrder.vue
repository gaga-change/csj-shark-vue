<template>
  <div class="InboundOrderComponent">
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
          @click="shouDetail(scope.row)"
        >详情</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
    <el-dialog
      style="z-index:900"
      title="详情"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div v-loading="inOrderSelectDetailListLoading">
        <div class="alertInfo">
          <span>入库计划单 : {{activeOrder.planCode}}</span>
          <span>供应商 : {{activeOrder.providerName}}</span>
          <span>收货时间 : {{ activeOrder.gmtCreate | date('YYYY-MM-DD') }}</span>
        </div>
        <base-table
          :config="detailTableConfig"
          :data="inPushOrderDetailTable"
        >
        </base-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { inOrderList, inOrderSelectDetailList } from '@/api'

const detailTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '入库数量', prop: 'inQty' },
  { label: '库位', prop: 'warehouseSpaceCodes' },
]

const tableConfig = [
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '入库单号', prop: 'orderCode', width: 140 },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '入库日期', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
  { label: '货主', prop: 'ownerName' },
  { label: '供应商', prop: 'providerName' },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '供应商名称', prop: 'providerName' },
  { label: '计划单号', prop: 'planCode' },
  { label: '货主', prop: 'ownerName' },
  { label: '收货单号', prop: 'orderCode' },
  { label: '入库日期', prop: 'createTimeArea', props: ['orderStartDate', 'orderEndDate'], type: 'timeArea' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      detailTableConfig,
      listApi: inOrderList,
      inOrderSelectDetailListLoading: false,
      inPushOrderDetailTable: [],
      dialogVisible: false,
      activeOrder: {}
    }
  },
  methods: {
    shouDetail(row) {
      this.dialogVisible = true;
      this.activeOrder = row;
      this.inOrderSelectDetailListLoading = true
      inOrderSelectDetailList(row.id).then(res => {
        this.inOrderSelectDetailListLoading = false
        if (res) {
          res.data = res.data || []
          this.inPushOrderDetailTable = res.data.map(v => {
            v.putSpaceInfoVOList = v.putSpaceInfoVOList || []
            v.warehouseSpaceCodes = v.putSpaceInfoVOList.map(i => i.warehouseSpaceCode).join(',')
            return v
          })
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.InboundOrderComponent {
  .routerLink {
    color: #3399ea;
    white-space: nowrap;
    margin-right: 10px;
    cursor: pointer;
  }

  .link_dom {
    color: rgb(51, 153, 234);
    cursor: pointer;
  }

  .alertInfo {
    margin-bottom: 12px;
    > span {
      font-size: 14px;
      padding-right: 20px;
    }
  }
}
</style>

