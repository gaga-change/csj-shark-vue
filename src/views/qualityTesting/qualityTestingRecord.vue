<template>
  <div class="TakeStockListCom">
    <div>
      <search-form
        :config="qualityTestingListSearchConfig"
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
        :api="checkOrderList"
        :config="qualityTestingListConfig"
        :tableData.sync="tableData"
        :searchParams="searchParams"
        :showControl="true"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:`/qualityTesting/detail`,query:{id: scope.row.id}}"
            :style="{color:'#3399ea'}"
          >查看</router-link>
          <el-divider direction="vertical"></el-divider>
          <el-button
            class="btn-link"
            size="mini"
            @click="handleReloadFile(scope.row)"
          >
            质检报告
          </el-button>
        </template>
      </base-table>
    </div>
    <reload-file
      :visible.sync="reloadFileVisible"
      :row.sync="rowNow"
    />
  </div>
</template>

<script>
import { checkOrderList, getCheckReportByOrderCode } from '@/api'
import { qualityTestingListConfig, qualityTestingListSearchConfig } from './components/config'
import reloadFile from './components/reloadFile'
export default {
  components: { reloadFile },
  data() {
    return {
      reloadFileVisible: false,
      qualityTestingListConfig,
      qualityTestingListSearchConfig,
      checkOrderList,
      tableData: [],
      searchParams: {},
      selectRows: [],
      rowNow: {},
    }
  },
  methods: {
    /** 重新上传 */
    handleReloadFile(row, operate) {
      this.rowNow = row
      this.reloadFileVisible = true
    },
    /** 新建质检记录 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    },
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params }
      if (params.createTimeArea) {
        delete obj.createTimeArea
        obj.startDate = new Date(params.createTimeArea[0]).getTime()
        obj.endtDate = new Date(params.createTimeArea[1]).getTime()
      }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    }
  }
}
</script>
