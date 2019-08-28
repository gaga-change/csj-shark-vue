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
        明细列表
      </div>
      <base-table
        :config="qualityTestingDetailTableConfig"
        :data="prodList"
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
            @click="handlePreview(item.reportUrl, item.reportName)"
            class="btn-link"
            href="JavaScript:void(0)"
          >{{item.reportName}}</a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCheckOrderDetail } from '@/api'
import { quailtyTestingDetailConfig, qualityTestingDetailTableConfig } from './components/config'
export default {
  data() {
    return {
      getCheckOrderDetailLoading: false,
      qualityTestingDetailTableConfig,
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
      this.prodList = res.data.detailDOS
    })
  },
  methods: {
    handlePreview(url, name) {
      if (!url) return this.$message.error('链接地址已失效！')
      window.open(url + '?name=' + encodeURIComponent(name))
    },
  },
}
</script>

<style lang="scss">
// .TakeStockDetailCom {
// }
</style>
