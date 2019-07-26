<template>
  <div class="TakeStockListCom">
    <div>
      <search-form
        :config="takeStockListSearchConfig"
        @search="handleSearch"
      >
      </search-form>
    </div>
    <div>
      <base-table
        ref='baseTable'
        :api="planInventoryList"
        :config="takeStockListConfig"
        :tableData.sync="tableData"
        :searchParams="searchParams"
      >
      </base-table>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/Table/index'
import SearchForm from '@/components/SearchForm/index'
import { planInventoryList } from '@/api'
import { takeStockListConfig, takeStockListSearchConfig } from './components/config'
export default {
  components: { BaseTable, SearchForm },
  data() {
    return {
      takeStockListConfig,
      takeStockListSearchConfig,
      planInventoryList,
      tableData: [],
      searchParams: {},
    }
  },
  methods: {
    handleSearch(params, callback) {
      let obj = { ...params }
      if (params.createTimeArea) {
        delete obj.createTimeArea
        obj.startDate = params.createTimeArea[0]
        obj.endtDate = params.createTimeArea[0]
      }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    }
  }
}
</script>
