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
      <div>
        <el-button
          @click="getExport"
          type="primary"
          size="small"
        >
          导出
        </el-button>
        <el-button
          @click="showStateTransition"
          type="primary"
          size="small"
          :disabled="!selectRows.length"
        >
          状态转移
        </el-button>
      </div>
      <div class="Total">
        <span>库存合计 ：</span> <span>{{SumSkuQty}}</span>
      </div>
    </div>

    <base-table
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :selectRows.sync="selectRows"
      :selectable="selectable"
      :select="true"
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
        <button
          class="btn-link"
          type="button"
          :disabled="scope.row.checkResult !== 1"
          @click="showMoveLibrary(scope.row)"
        >
          移库
        </button>
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
    <el-dialog
      title="状态转移"
      :visible.sync="stateTransitionVisible"
      width="80%"
      :before-close="handleClose"
    >

      <base-table
        :config="stateTransitionTableConfig"
        :total="selectRows.length"
        :maxTotal="100"
        :showIndex="true"
        :tableData="selectRows"
      />

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="stateTransitionVisible = false;">取 消</el-button>
        <el-button
          type="primary"
          @click="stateTransition()"
          :loading="skuStockWriteCheckResultLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { inventoryTableConfig, stateTransitionTableConfig } from './components/config'
import { getInfoInventory, exportLedger, skuStockWriteCheckResult, selectSumSkuQty, warehouseSpaceSelect, skuStockMove } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
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
      selectRows: [],
      stateTransitionVisible: false,
      skuStockWriteCheckResultLoading: false,
      stateTransitionTableConfig,
    }
  },
  computed: {
    warehouseSpaceCodeConfigComputed() {
      return this.warehouseSpaceCodeConfig.map(v => {
        if (v.warehouseSpaceCode === this.selectRow.warehouseSpaceCode) {
          v.disabled = true
        } else {
          v.disabled = false
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
    /** 判断是否可选 */
    selectable(row) {
      return row.checkResult === 0
    },
    /** 唤起状态转移 */
    showStateTransition() {
      this.selectRows = this.selectRows.map(v => {
        return {
          ...v,
          goodQty: '',
          badQty: '',
        }
      })
      this.stateTransitionVisible = true
    },
    /** 状态转移 */
    stateTransition() {
      let msg = ''
      let temp = this.selectRows.map(v => {
        let skuQty = Number(v.skuQty)
        let goodQty = parseInt(Number(v.goodQty)) || 0
        let badQty = parseInt(Number(v.badQty)) || 0
        if (goodQty + badQty > skuQty && !msg) {
          msg = `商品【${v.skuName}】的正品数量与残次品数量之和不能超过商品总数！`
        }
        return {
          stockId: v.id,
          goodQty,
          badQty
        }
      })
      if (msg) {
        return this.$message(msg)
      }
      this.skuStockWriteCheckResultLoading = true
      skuStockWriteCheckResult({
        stockCheckResultList: temp
      }).then(res => {
        this.skuStockWriteCheckResultLoading = false
        if (!res) return
        this.stateTransitionVisible = false
        this.selectRows = []
      })
    },
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
        this.getTableData()
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
      exportLedger(this.ruleForm, '库存台账.xls')
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