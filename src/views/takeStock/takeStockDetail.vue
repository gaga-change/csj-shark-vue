<template>
  <div
    class="TakeStockDetailCom"
    v-loading="planInventoryQueryByOrderIdLoading"
  >
    <el-card shadow="never">
      <div slot="header">
        基本信息
      </div>
      <detail-item
        :config="takeStockDetailConfig"
        :detail="detail"
      />
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        商品列表
      </div>
      <base-table
        :config="takeStockDetailProductTableConfig"
        :tableData="prodList"
      >
      </base-table>
    </el-card>
  </div>
</template>

<script>
import { planInventoryQueryByOrderId } from '@/api'
import { takeStockDetailProductTableConfig } from './components/config'
import { takeStockTypeEnum } from '@/utils/enum'

const takeStockDetailConfig = [
  { label: '盘点单号', prop: 'orderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '盘点人', prop: 'inventoryName' },
  { label: '盘点时间', prop: 'inventoryTime', type: 'time' },
  { label: '盘点类型', prop: 'orderType', type: 'enum', enum: takeStockTypeEnum },
  { label: '备注', prop: 'remarkInfo' },
]
export default {
  data() {
    return {
      planInventoryQueryByOrderIdLoading: false,
      takeStockDetailProductTableConfig,
      takeStockDetailConfig,
      detail: {},
      prodList: []
    }
  },
  created() {
    this.planInventoryQueryByOrderIdLoading = true
    planInventoryQueryByOrderId({
      orderId: this.$route.query.id
    }).then(res => {
      this.planInventoryQueryByOrderIdLoading = false
      if (!res) return
      this.detail = res.data.inventoryOrderDO
      this.prodList = res.data.orderDetailDOS.map(v => {
        if (v.inventoryQty !== null) v.profitLossQty = v.inventoryQty - v.stockQty
        v.areaSpceCode = (v.warehouseAreaCode || '') + '/' + (v.warehouseSpaceCode || '')
        return v
      })
    })
  },
}
</script>

<style lang="scss">
// .TakeStockDetailCom {
// }
</style>
