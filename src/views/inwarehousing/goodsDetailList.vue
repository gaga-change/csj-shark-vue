<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :appendSearchParams="appendSearchParams"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleUp(scope.row)"
        >
          上架
        </el-link>
      </template>
    </base-list>
    <putaway-dialog
      :visible.sync="putawayDialogVisible"
      :row="nowRow"
      @submited="getTableData"
    />
  </div>
</template>

<script>
import { selectReceiveDetailItem } from '@/api'
import { execStatuslist } from '@/utils/enum'
import putawayDialog from './components/putawayDialog'

const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName', width: '200' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '实际收货量', prop: 'receiveQty' },
  { label: '已上架数量', prop: 'realInQty' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: execStatuslist },
  { label: '收货时间', prop: 'gmtCreate', type: 'time' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '容器', prop: 'trayCode' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: execStatuslist },
]

export default {
  components: { putawayDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: selectReceiveDetailItem,
      putawayDialogVisible: false,
      nowRow: {},
      appendSearchParams: { receiveExecStatus: 2 },
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 上架按钮点击 */
    handleUp(row) {
      this.putawayDialogVisible = true
      this.nowRow = row
    }
  }
}
</script>