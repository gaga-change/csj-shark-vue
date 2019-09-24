<template>
  <div class="">
    <div v-loading="pickOrderDetailLoading">
      <el-card shadow="never">
        <div slot="header">
          基本信息
        </div>
        <detail-item
          :config="detailItemConfig"
          :detail="detail"
          :labelWidth="100"
        />
      </el-card>
      <el-card
        shadow="never"
        class="mt20"
      >
        <div slot="header">
          拣货明细任务
        </div>
        <base-table
          :config="tableConfig"
          :data="tableData"
          :showControl="true"
          controlName="操作"
          :controlWidth="160"
          inrecordDetail
          :select="false"
        >
          <template slot-scope="scope">
            <!-- 单据（未执行、执行中） 明细（未执行） -->
            <el-link
              v-if=" (detail.orderStatus == 0 || detail.orderStatus == 1) && scope.row.jobStatus < 4"
              type="primary"
              @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
            >拣货</el-link>
            <!-- <el-divider
              direction="vertical"
            ></el-divider> -->
            <!-- 单据（未执行、执行中） 明细（未执行）
            单据（执行中） 明细（已完成）
             -->
            <el-link
              v-if=" ((detail.orderStatus == 0 || detail.orderStatus == 1) && scope.row.jobStatus < 4)
              || ( (detail.orderStatus == 1) && scope.row.jobStatus == 4)
              "
              type="primary"
              @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
            >终止拣货</el-link>
          </template>
        </base-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { pickOrderDetail, orderPickConfirm } from '@/api'
const detailItemConfig = [
  { label: '拣货单号', prop: 'orderCode' },
  { label: '出库计划单号', prop: 'outOrderCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '拣货状态', prop: 'orderStatus', type: 'enum', enum: 'orderStatusEnum', width: 90 },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '批次', prop: 'batchNo' },
  { label: '通知拣货数', prop: 'jobQty', width: 90 },
  { label: '已拣货数', prop: 'realSortQty' },
  { label: '执行状态', prop: 'jobStatus', type: 'enum', enum: 'jobStatusList' },
  { label: '容器', prop: 'trayCode' },
  { label: '货位', prop: 'sum' },
]
export default {
  data() {
    return {
      id: this.$route.query.id,
      tableConfig,
      detailItemConfig,
      pickOrderDetailLoading: false,
      tableData: [],
      loading: false,
      selectRows: [],
      detail: {}
    }
  },
  created() {
    this.initDetail()
  },
  methods: {
    /** 获取详情 */
    initDetail() {
      this.pickOrderDetailLoading = true;
      const id = this.$route.query.id
      pickOrderDetail(id).then(res => {
        this.pickOrderDetailLoading = false
        if (!res) return
        res.data.forEach(item => {
          item.sum = item.warehouseSpaceCode + ':' + item.jobQty
          item.realSortQty = item.realSortQty || 0
          item.number = item.jobQty || 0
        })
        this.tableData = res.data || [];
      })
    },
    /** 确定 */
    confirm() {
      if (this.selectRows.length === 0) {
        return this.$message.error('请先选择商品！')
      }
      if (this.selectRows.find(v => !v.number)) {
        return this.$message.error('数量不能为0！')
      }
      let json = {};
      json.pickConfirmItemReqList = this.selectRows
      json.planCode = this.selectRows[0].planCode;
      json.pickOrderId = this.id;
      this.selectRows.forEach(v => {
        v.realSortStocks = {}
        v.realSortStocks[v.stockId] = v.number
      })
      this.loading = true
      orderPickConfirm(json).then(res => {
        this.loading = false
        if (!res) return
        this.$message({ type: 'success', message: '操作成功，可以去出库暂存页面查看' })
      })
    },
  }
}
</script>