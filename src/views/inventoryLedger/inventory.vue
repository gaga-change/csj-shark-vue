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
      :showControl="true"
      :controlWidth="100"
      :loading="loading"
      :config="inventoryTableConfig"
      :total="total"
      :maxTotal="10"
      :pageSize="ruleForm.pageSize"
      :currentPage="ruleForm.pageNum"
      :tableData="tableData"
    >
      <template
        slot="edit"
        slot-scope="scope"
      >
        <span
          class="link_dom"
          :class="{disabled: scope.row.checkResult !== 1}"
          @click="showMoveLibrary(scope.row)"
        >移库</span>
      </template>
    </base-table>
    <el-dialog
      title="移库"
      :visible.sync="moveLibraryDialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div
        class="f14"
        v-if="selectRow"
      >
        <div>
          <span><span class="fw700">商品名称</span>： <span>{{selectRow.skuName}}</span>
          </span>
          <span class="ml25">
            <span class="fw700">商品批次</span>： <span>{{selectRow.batchNo}}</span>
          </span>
        </div>
        <div class="mt25">
          <div>
            <span
              class="fw700"
              style="display:inline-block;width: 100px;"
            >原库位</span>
            <span>{{selectRow.warehouseSpaceCode}}</span>
          </div>
          <div class="mt15">
            <span
              class="fw700"
              style="display:inline-block;width:100px;"
            >移至</span>
            <el-select
              size="small"
              v-model="newWarehouseSpaceCode"
              placeholder="请选择"
              :loading="warehouseSpaceSelectLoading"
            >
              <el-option
                v-for="item in warehouseSpaceCodeConfigComputed"
                :key="item.warehouseSpaceCode"
                :label="item.warehouseSpaceCode"
                :value="item.warehouseSpaceCode"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div>

      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="moveLibraryDialogVisible = false;newWarehouseSpaceCode = null;">取 消</el-button>
        <el-button
          type="primary"
          @click="moveLibrary()"
          :loading="skuStockMoveLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { inventoryTableConfig } from './components/config'
import { getInfoInventory, exportLedger, selectSumSkuQty, warehouseSpaceSelect, skuStockMove } from '@/api'
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
        checkResult: '',
        warehouseSpaceCode: '',
      },
      tableData: [],
      inventoryTableConfig,
      total: 0,
      SumSkuQty: 0,
      moveLibraryDialogVisible: false,
      selectRow: null,
      newWarehouseSpaceCode: null, // 新库位
      warehouseSpaceCodeConfig: [],
      warehouseSpaceSelectLoading: false,
      skuStockMoveLoading: false,
    }
  },
  computed: {
    warehouseSpaceCodeConfigComputed() {
      return this.warehouseSpaceCodeConfig.map(v => {
        if (v.warehouseSpaceCode === this.selectRow.warehouseSpaceCode) {
          v.disabled = true
        }
        return v
      })
    }
  },
  created() {
    this.getTableData()
    this.warehouseSpaceSelectLoading = true
    warehouseSpaceSelect().then(res => {
      this.warehouseSpaceSelectLoading = false
      if (res) {
        this.warehouseSpaceCodeConfig = res.data || [];
      }
    })
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newWarehouseSpaceCode = null
          done()
        })
        .catch(_ => { })
    },
    /** 显示移库操作 */
    showMoveLibrary(row) {
      console.log(row)
      this.selectRow = row
      this.moveLibraryDialogVisible = true
    },
    /** 移库处理 */
    moveLibrary() {
      let code = this.newWarehouseSpaceCode
      let row = this.selectRow
      if (!code) {
        return this.$message('请选择新库位！')
      }
      this.skuStockMoveLoading = true
      skuStockMove({
        stockId: row.id,
        warehouseSpaceCode: code,
        warehouseAreaCode: this.warehouseSpaceCodeConfig.find(v => v.warehouseSpaceCode === code).warehouseAreaCode,
      }).then(res => {
        this.skuStockMoveLoading = false
        if (!res) return
        this.moveLibraryDialogVisible = false
        this.newWarehouseSpaceCode = null
      })
    },
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