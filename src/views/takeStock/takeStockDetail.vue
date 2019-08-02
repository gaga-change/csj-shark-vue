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
import DetailItem from '@/components/DetailItem'
import { planInventoryQueryByOrderId } from '@/api'
import { takeStockDetailConfig, takeStockDetailProductTableConfig } from './components/config'
export default {
  components: { DetailItem },
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
