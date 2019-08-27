<template>
  <div class="ComponentNameClass">
    <div>
      <search-form
        :config="searchConfig"
        @search="handleSearch"
      >
      </search-form>
    </div>
    <div>
      <el-button
        type="primary"
        size="mini"
        @click="handleCreate"
      >
        新建质检记录
      </el-button>
    </div>
    <div class="mt15">
      <base-table
        ref='baseTable'
        :api="listApi"
        :config="tableConfig"
        :tableData.sync="tableData"
        :searchParams="searchParams"
        :showControl="true"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="$router.push({path:`/qualityTesting/detail`,query:{id: scope.row.id}})"
          >详情</el-link>
          <el-divider direction="vertical"></el-divider>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script>
import { checkOrderList } from '@/api'
const tableConfig = [
  { label: '质检单号 ', prop: 'orderCode' },
  { label: '收货单号 ', prop: 'receiveOrderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const searchConfig = [
  { label: '质检单号', prop: 'orderCode', type: 'input' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endtDate'], type: 'timeArea' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: checkOrderList,
      tableData: [],
      searchParams: {},
      selectRows: [],
      rowNow: {},
    }
  },
  methods: {
    /** 新建质检记录 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    },
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    }
  }
}
</script>