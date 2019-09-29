<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
        >审核</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
        >拣货任务</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新建质检记录
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { inOutStopList } from '@/api'
const tableConfig = [
  { label: '任务ID ', prop: 'taskCode' },
  { label: '审核类型 ', prop: 'inOutType', type: 'enum', enum: 'inOutTypeEnum' },
  { label: '计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据类型', prop: 'busiBillType', type: 'enum', enum: 'busiBillTypeEnum' },
  { label: '审核状态', prop: 'opStatus', type: 'enum', enum: 'opStatusEnum' },
  { label: '审核备注', prop: 'remark' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const searchConfig = [
  { label: '审核类型 ', prop: 'inOutType', type: 'enum', enum: 'inOutTypeEnum' },
  { label: '计划单号', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '审核状态', prop: 'opStatus', type: 'enum', enum: 'opStatusEnum' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endDate'], type: 'timeArea' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: inOutStopList,
      // 可选 附加查询条件
      appendSearchParams: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.updateLockStatusOutLoading = false
        v.updateLockStatusInLoading = false
      })
      return { data, total }
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    }
  }
}
</script>