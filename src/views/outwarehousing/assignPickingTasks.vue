<template>
  <div
    class=""
    v-loading="planOutDetailLoading"
  >
    <div>
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
          商品明细
        </div>
        <base-table
          :config="tableConfig"
          :data="productList"
          :showControl="true"
          :select="false"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="selectedRow=scope.row;dialogVisible=true"
            >选择</el-link>
          </template>
        </base-table>
      </el-card>
      <el-card
        shadow="never"
        class="mt20"
      >
        <div slot="header">
          拣货任务明细（点击商品行进行展示或切换）
        </div>
        <base-table
          :config="planTableConfig"
          :data="planTableData"
          :showControl="true"
          :select="false"
        >
        </base-table>
      </el-card>
    </div>
    <choose-dialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="submited()"
    />
  </div>
</template>

<script>
import chooseSpaceCodeTableDialog from './components/chooseSpaceCodeTableDialog'
import { planOutDetail } from '@/api'
const detailItemConfig = [
  { label: '出库计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '计划量', prop: 'planOutQty' },
  { label: '已通知拣货量', prop: 'sortQty' },
  { label: '本次拣货量', prop: 'sum' },
]
const planTableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '本次拣货量', prop: 'num' },
  { label: '本次拣货库位', prop: 'warehouseSpaceCode' },
]
export default {
  components: { 'chooseDialog': chooseSpaceCodeTableDialog },
  data() {
    return {
      dialogVisible: false,
      selectedRow: null,
      id: this.$route.query.id,
      planOutDetailLoading: false,
      tableConfig,
      detailItemConfig,
      planTableConfig,
      detail: {},
      productList: [],
      planTableData: [],
    }
  },
  created() {
    this.initDetail()
  },
  methods: {
    /** 选择结束 */
    submited(tableData) {
      console.log('...', tableData)
      this.selectedRow._child = tableData
    },
    /** 获取详情 */
    initDetail() {
      const query = this.$route.query
      this.detail = query
      this.planOutDetailLoading = true;
      planOutDetail({ planCode: query.planCode }).then(res => {
        this.planOutDetailLoading = false
        if (!res) return []
        let temp = res.data || []
        this.productList = temp.filter(v => ~query.billNos.indexOf(v.billNo)).map(v => {
          v.sum = undefined
          return v
        })
      })
    },
  }
}
</script>