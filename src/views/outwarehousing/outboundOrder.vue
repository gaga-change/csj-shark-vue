<template>
  <div>
    <double-list
      ref="doubleList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="80"
      :showControlFixed="false"
      :expand="true"
      :childApi="childApi"
      :childTableConfig="childTableConfig"
      :childSelect="false"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:'/outwarehousing/outboundOrderDetail', query: {id: scope.row.id}})"
        >详情</el-link>
      </template>
      <template slot="btns">
      </template>
    </double-list>
  </div>
</template>

<script>
import { getInfoOutWarehousing, getInfoDetailOutWarehousing } from '@/api'

const childTableConfig = [
  { label: '商品编码', prop: 'skuCode', width: 150 },
  { label: '商品名称', prop: 'skuName', width: 150 },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '商品数量', prop: 'numberOfProducts' },
  { label: '出库数量', prop: 'realOutQty' },
  { label: '出库批次', prop: 'batchNo' },
  { label: '备注', prop: 'remarkInfo' },
]
const tableConfig = [
  { label: '出库时间', prop: 'gmtCreate', type: 'time', width: 140 },
  { label: '出库单号', prop: 'orderCode', width: 140 },
  { label: '计划单号', prop: 'planCode', width: 140 },
  { label: '外部订单号', prop: 'busiBillNo', width: 90 },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '单据状态', prop: 'orderStatus', type: 'enum', enum: 'outboundOrderStatus' },
  { label: '客户/供应商', prop: 'ownerName', },
  { label: '操作人', prop: 'createrName' },
]
const searchConfig = [
  { label: '计划单号', prop: 'planCode' },
  { label: '出库单号', prop: 'orderCode' },
  { label: '客户/供应商', prop: 'ownerName' },
  { label: '单据状态', prop: 'orderStatus', type: 'enum', enum: 'outboundOrderStatus' },
  { label: '出库时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
  { label: '推送状态', prop: 'isPush', type: 'enum', enum: 'isPushStateEnum' },
]

export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      childTableConfig,
      listApi: getInfoOutWarehousing,
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>