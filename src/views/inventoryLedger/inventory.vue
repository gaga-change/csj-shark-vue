<template>
  <div>
    <search-inventory
      @searchTrigger="submitForm"
      ref="searchWarhouse"
      :search-forms="ruleForm"
    >
    </search-inventory>

    <div
      class="export_box"
      v-if="SumSkuQty"
    >
      <el-button
        @click="getExport"
        type="primary"
        size="small"
      >
        导出
      </el-button>
      <div class="Total">
        <span>库存合计 ：</span> <span>{{SumSkuQty}}</span>
      </div>
    </div>

    <base-table
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :loading="loading"
      :config="inventoryTableConfig"
      :total="total"
      :maxTotal="10"
      :pageSize="ruleForm.pageSize"
      :currentPage="ruleForm.pageNum"
      :tableData="tableData"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { inventoryTableConfig } from './components/config'
import { getInfoInventory, exportLedger, selectSumSkuQty } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
import { exportExcelBlob } from '@/utils/exportexcel'
import SearchInventory from './components/search'

export default {
  components: { BaseTable, SearchInventory },
  data() {
    return {
      loading: false,
      ruleForm: {
        pageNum: 1,
        pageSize: 10,
        skuCode: '',
        skuName: '',
        ownerName: '',
        warehouseSpaceCode: '',

      },
      tableData: [],
      inventoryTableConfig,
      total: 0,
      SumSkuQty: 0
    }
  },
  methods: {
    getTableData() {
      this.$router.replace({
        path: '/inventoryLedger/inventory',
        query: { data: JSON.stringify(this.ruleForm) }
      })
      this.loading = true;
      let data = { ...this.ruleForm }
      selectSumSkuQty(data).then(res => {
        if (res) {
          this.SumSkuQty = res.data;
        }
      })
      getInfoInventory(data).then(res => {
        this.loading = false;
        if (res && res.data && res.data.list) {
          var tempList = [...res.data.list]
          this.tableData = uniqueArray([...tempList.map(list => { list.childData = []; return list })], 'id')
          this.total = res.data.total
        }
      })
    },

    handleSizeChange(val) {
      this.ruleForm = { ...this.ruleForm, pageSize: val, pageNum: 1 }
      this.getTableData()
    },

    handleCurrentChange(val) {
      this.ruleForm = { ...this.ruleForm, pageNum: val }
      this.getTableData()
    },
    submitForm(ruleForm) {
      this.ruleForm = { ...ruleForm, pageSize: 10, pageNum: 1 }
      this.getTableData();
    },

    getExport() {
      this.$prompt('请输入文件名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        exportLedger({ ...this.ruleForm }).then(res => {
          var name = value ? value : '库存台账'
          exportExcelBlob(name, res)
        })
      })
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.export_box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 12px;
  align-items: flex-end;
  .Total {
    padding-right: 20px;
  }
}
</style>