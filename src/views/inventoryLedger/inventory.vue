<template>
  <div>

    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :controlWidth="160"
      :select="false"
      @search="handleSearch"
    >
      <template slot="btns">
        <div
          class="export_box"
          v-if="sumSkuQty"
        >
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              content="导出当前查询的所有记录"
              placement="top"
            >
              <el-button
                @click="getExport"
                type="primary"
                size="mini"
              >
                导出
              </el-button>
            </el-tooltip>
          </div>
          <div class="Total">
            <span>库存合计 ：</span> <span>{{sumSkuQty}}</span>
          </div>
        </div>
      </template>
    </base-list>
  </div>
</template>

<script>

import { getInfoInventory, exportLedger, skuStockWriteCheckResult, selectSumSkuQty, warehouseSpaceList, skuStockMove } from '@/api'

const tableConfig = [
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName', width: '200' },
  { label: '货主', prop: 'ownerName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '单价', prop: 'inPrice' },
  { label: '批次', prop: 'batchNo' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '冻结数量', prop: 'blockQty' },
  { label: '库存', prop: 'skuQty' },
  { label: '最近入库时间', prop: 'lastInTime', type: 'time', width: '135' },
  { label: '最近出库时间', prop: 'lastOutTime', type: 'time', width: '135' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '货主名称', prop: 'ownerName' },
  { label: '库位编码', prop: 'warehouseSpaceCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum_v2' },
]

export default {
  data() {
    return {
      listApi: getInfoInventory,
      tableConfig,
      searchConfig,
      searchParams: {},
      sumSkuQty: 0,
    }
  },
  created() {
    this.updateSum()
  },
  methods: {
    /** 点击搜索 */
    handleSearch(params) {
      this.searchParams = params
      this.updateSum(params)
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 获取 库存合计 */
    updateSum(data = {}) {
      selectSumSkuQty(data).then(res => {
        if (res) {
          this.sumSkuQty = res.data;
        }
      })
    },
    /** 导出 */
    getExport() {
      exportLedger(this.searchParams)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.export_box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 12px;
  align-items: flex-end;
  .Total {
    padding-right: 20px;
  }
}
</style>