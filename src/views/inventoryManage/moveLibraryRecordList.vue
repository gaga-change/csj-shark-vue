<template>
  <div class="MoveLibraryRecordListComponent">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
    >
    </base-list>
  </div>
</template>

<script>
import { queryStockMoveList } from '@/api'
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum_v2' },
  { label: '移出库位', prop: 'sWarehouseSpaceCode' },
  { label: '移入库位', prop: 'tWarehouseSpaceCode' },
  { label: '移库数量', prop: 'moveQty' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '移出库位', prop: 'sWarehouseSpaceCode' },
  { label: '移入库位', prop: 'tWarehouseSpaceCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum_v2' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: queryStockMoveList,
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
  }
}
</script>