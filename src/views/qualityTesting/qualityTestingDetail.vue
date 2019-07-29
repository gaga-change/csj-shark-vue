<template>
  <div
    class="TakeStockDetailCom"
    v-loading="getCheckOrderDetailLoading"
  >
    <el-card shadow="never">
      <div slot="header">
        基本信息
      </div>
      <detail-item
        :config="quailtyTestingDetailConfig"
        :detail="detail"
      />
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        收货单列表
      </div>
      <base-table
        :config="arrivalConfig"
        :tableData="prodList"
      >
      </base-table>
    </el-card>
    <el-card
      shadow="never"
      class="mt20"
    >
      <div slot="header">
        质检报告
      </div>
      <div class="f12">
        <p
          v-for="(item, index) in attachments"
          :key="index"
        >
          <a
            class="btn-link"
            :href="item.reportUrl"
            target="_blank"
          >{{item.reportName}}</a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import DetailItem from '@/components/DetailItem'
import { getCheckOrderDetail } from '@/api'
import { quailtyTestingDetailConfig, arrivalConfig } from './components/config'
// window.navigate("dollare.php")
export default {
  components: { DetailItem },
  data() {
    return {
      getCheckOrderDetailLoading: false,
      arrivalConfig,
      quailtyTestingDetailConfig,
      detail: {},
      prodList: [],
      attachments: [],
    }
  },
  created() {
    this.getCheckOrderDetailLoading = true
    getCheckOrderDetail({
      id: this.$route.query.id
    }).then(res => {
      this.getCheckOrderDetailLoading = false
      if (!res) return
      this.detail = res.data.checkOrderDO
      this.attachments = res.data.attachments
      this.prodList = res.data.detailDOS.map(v => {
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
