<template>
  <div class="TakeStockListCom">
    <div>
      <search-form
        :config="qualityTestitingListSearchConfig"
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
        :config="qualityTestitingListConfig"
        :tableData.sync="tableData"
        :searchParams="searchParams"
        :showControl="true"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:`/takeStock/detail`,query:{id: scope.row.id}}"
            :style="{color:'#3399ea'}"
          >查看</router-link>
          <el-divider direction="vertical"></el-divider>
          <el-button
            class="btn-link"
            @click="handleReloadFile(scope.row)"
          >
            重新上传
          </el-button>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script>
import { checkOrderList, inventoryRemoveOrStop } from '@/api'
import { qualityTestitingListConfig, qualityTestitingListSearchConfig } from './components/config'
export default {
  data() {
    return {
      qualityTestitingListConfig,
      qualityTestitingListSearchConfig,
      checkOrderList,
      tableData: [],
      searchParams: {},
      selectRows: []
    }
  },
  methods: {
    /** 重新上传 */
    handleReloadFile(row, operate) {

    },
    /** 新建质检记录 */
    handleCreate() {
    },
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params }
      if (params.createTimeArea) {
        delete obj.createTimeArea
        obj.startDate = new Date(params.createTimeArea[0]).getTime()
        obj.endtDate = new Date(params.createTimeArea[0]).getTime()
      }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    }
  }
}
</script>
