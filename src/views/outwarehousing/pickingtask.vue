<template>
  <div class="PickingTaskComponent">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="360"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/outwarehousing/pickingTaskDetail`,query:{id: scope.row.id}})"
        >详情</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handePrint(scope.row, 'Printing')"
        >打印拣货单</el-link>
        <el-divider
          v-if="[0, 1].includes(scope.row.orderStatus)"
          direction="vertical"
        ></el-divider>
        <el-link
          v-if="[0, 1].includes(scope.row.orderStatus)"
          type="primary"
          @click="handleDetail(scope.row)"
        >拣货</el-link>
        <el-divider
          v-if="[0, 1].includes(scope.row.orderStatus)"
          direction="vertical"
        ></el-divider>
        <el-link
          v-if="[0, 1].includes(scope.row.orderStatus)"
          type="primary"
          @click="handlePickStop(scope.row)"
        >终止拣货</el-link>
        <el-divider
          v-if="[0].includes(scope.row.orderStatus)"
          direction="vertical"
        ></el-divider>
        <el-link
          v-if="[0].includes(scope.row.orderStatus)"
          type="primary"
          @click="handleDelete(scope.row)"
        >删除拣货</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
    <!-- 拣货 & 详情 -->
    <pick-detail-dialog
      :visible.sync="pickDetailDialogVisible"
      :row="detailSelectedRow"
      @submited="getTableData()"
    />
    <!-- 打印 -->
    <pick-print-dialog
      :visible.sync="pickPrintDialogVisible"
      :row="printSelectedRow"
    />
  </div>
</template>

<script>
import moment from 'moment';
import { pickOrderList, orderDelete, orderPickStop } from '@/api'
import pickDetailDialog from './components/pickDetailDialog'
import pickPrintDialog from './components/pickPrintDialog'

const tableConfig = [
  { label: '拣货单号', prop: 'orderCode' },
  { label: '应拣货总量', prop: 'pickQty' },
  { label: '已拣货总数', prop: 'realPickQty' },
  { label: '状态', prop: 'orderStatus', type: 'enum', enum: 'orderStatusEnum' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const searchConfig = [
  { label: '拣货单号', prop: 'orderCode' },
  { label: '计划单号', prop: 'outOrderCode' },
  { label: '拣货状态', prop: 'orderStatus', type: 'enum', enum: 'orderStatusEnum' },
]

export default {
  components: { pickDetailDialog, pickPrintDialog },
  data() {
    return {
      pickPrintDialogVisible: false,
      pickDetailDialogVisible: false,
      tableConfig,
      searchConfig,
      listApi: pickOrderList,
      detailSelectedRow: {},
      printSelectedRow: {},
    }
  },
  methods: {
    moment,
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 详情 按钮点击 */
    handleDetail(row) {
      this.detailSelectedRow = row;
      this.pickDetailDialogVisible = true
    },
    /** 打印拣货单 按钮点击 */
    handePrint(row) {
      this.printSelectedRow = row;
      this.pickPrintDialogVisible = true
    },
    /** 终止拣货 点击 */
    handlePickStop(row) {
      this.$apiConfirm('确定要终止操作码？', () => orderPickStop(row.id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    /** 删除拣货 点击 */
    handleDelete(row) {
      this.$apiConfirm('确定要删除吗？', () => orderDelete(row.id)).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
  },
}
</script>