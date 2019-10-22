<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="200"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
        >绑定用户</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
        >仓库用户</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
        >禁用</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新增仓库
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { warehouseSelect } from '@/api'
const tableConfig = [
  { label: '仓库编码', prop: 'warehouseCode', width: 120 },
  { label: '仓库名称', prop: 'warehouseName' },
  { label: '类型', prop: 'type', type: 'enum', enum: 'warehouseTypeEnum' },
  { label: '状态', prop: 'status', type: 'enum', enum: 'warehouseStatusEnum' },
  { label: '联系人', prop: 'linkName' },
  { label: '详细地址', prop: 'warehouseAddress' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '仓库编码', prop: 'warehouseCode' },
  { label: '仓库名称', prop: 'warehouseName' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: warehouseSelect,
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