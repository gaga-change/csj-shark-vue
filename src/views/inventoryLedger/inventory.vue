<template>
  <div>

    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :controlWidth="160"
      :select="false"
      @selectionChange="selectionChange"
      :selectable="selectable"
      @search="handleSearch"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          :disabled="(scope.row.skuQty - scope.row.blockQty) <= 0"
          @click="showMoveLibrary(scope.row)"
        >移库</el-link>
      </template>
      <template slot="btns">
        <div
          class="export_box"
          v-if="sumSkuQty"
        >
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              content="导出当前查询的所有记录"
              placement="top"
            >
              <el-button
                @click="getExport"
                type="primary"
                size="mini"
              >
                导出
              </el-button>
            </el-tooltip>
          </div>
          <div class="Total">
            <span>库存合计 ：</span> <span>{{sumSkuQty}}</span>
          </div>
        </div>
      </template>
    </base-list>

    <el-dialog
      title="移库"
      :visible.sync="moveLibraryDialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div
        class="f14"
        v-if="selectRow"
      >
        <div>
          <span class="nowrap mr25">
            <span class="fw700 ">商品名称</span>：<span>{{selectRow.skuName}}</span>
          </span>
          <span class="mr25 nowrap">
            <span class="fw700">商品批次</span>：<span>{{selectRow.batchNo}}</span>
          </span>
          <span class="mr25 nowrap">
            <span class="fw700">数量</span>：<span>{{Number(selectRow.skuQty - selectRow.blockQty).toFixed()}}</span>
          </span>
        </div>
        <div class="mt25">
          <div>
            <span
              class="fw700"
              style="display:inline-block;width:100px;"
            >数量</span>
            <el-input-number
              v-model="newSkuQty"
              controls-position="right"
              :min="1"
              :precision="0"
              :max="selectRow.skuQty - selectRow.blockQty"
            ></el-input-number>
          </div>
          <div class="mt15">
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
              size="mini"
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
        <el-button
          size="mini"
          @click="moveLibraryDialogVisible = false;newWarehouseSpaceCode = null;"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
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
        :showIndex="true"
        :data="selectRows"
      />

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="stateTransitionVisible = false;"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="stateTransition()"
          size="mini"
          :loading="skuStockWriteCheckResultLoading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getInfoInventory, exportLedger, skuStockWriteCheckResult, selectSumSkuQty, warehouseSpaceList, skuStockMove } from '@/api'

const stateTransitionTableConfig = [// 库存列表
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName', width: '200' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '批次', prop: 'batchNo' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '收货数量', prop: 'skuQty' },
  { label: '正品数量', prop: 'goodQty', fixed: 'right', edit: true, inputType: 'number', max: 99999999, min: 0, width: '160' },
  { label: '残次品数量', prop: 'badQty', fixed: 'right', edit: true, inputType: 'number', max: 99999999, min: 0, width: '160' },
]

const tableConfig = [
  { label: '库位', prop: 'warehouseSpaceCode' },
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName', width: '200' },
  { label: '货主', prop: 'ownerName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '单价', prop: 'inPrice' },
  { label: '批次', prop: 'batchNo' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum' },
  { label: '冻结数量', prop: 'blockQty' },
  { label: '库存', prop: 'skuQty' },
  { label: '最近入库时间', prop: 'lastInTime', type: 'time', width: '135' },
  { label: '最近出库时间', prop: 'lastOutTime', type: 'time', width: '135' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '货主名称', prop: 'ownerName' },
  { label: '库位编码', prop: 'warehouseSpaceCode' },
  { label: '商品状态', prop: 'checkResult', type: 'enum', enum: 'checkResultEnum_v2' },
]

export default {
  data() {
    return {
      listApi: getInfoInventory,
      tableConfig,
      searchConfig,
      stateTransitionTableConfig,
      moveLibraryDialogVisible: false,
      stateTransitionVisible: false,
      skuStockMoveLoading: false,
      warehouseSpaceSelectLoading: false,
      skuStockWriteCheckResultLoading: false,
      selectRows: [],
      selectRow: {},
      searchParams: {},
      sumSkuQty: 0,
      newWarehouseSpaceCode: undefined, // 新库位
      newSkuQty: undefined, // 新库存
      warehouseSpaceCodeConfig: [],
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
    this.updateSum()
    this.warehouseSpaceSelectLoading = true
    warehouseSpaceList().then(res => {
      this.warehouseSpaceSelectLoading = false
      if (res) {
        this.warehouseSpaceCodeConfig = res.data || [];
      }
    })
  },
  methods: {
    /** 点击搜索 */
    handleSearch(params) {
      this.searchParams = params
      this.updateSum(params)
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 获取 库存合计 */
    updateSum(data = {}) {
      selectSumSkuQty(data).then(res => {
        if (res) {
          this.sumSkuQty = res.data;
        }
      })
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
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
      this.$confirm('请再次确认是否提交本次操作').then(() => {
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
          return this.$message.error(msg)
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
      }).catch(() => { })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newWarehouseSpaceCode = undefined
          this.newSkuQty = undefined
          done()
        })
        .catch(_ => { })
    },
    /** 显示移库操作 */
    showMoveLibrary(row) {
      this.selectRow = row
      this.newSkuQty = row.skuQty
      this.moveLibraryDialogVisible = true
    },
    /** 移库处理 */
    moveLibrary() {
      let code = this.newWarehouseSpaceCode
      let newSkuQty = this.newSkuQty
      let row = this.selectRow
      if (!code) {
        return this.$message.error('请选择新库位！')
      }
      this.skuStockMoveLoading = true
      skuStockMove({
        stockId: row.id,
        warehouseSpaceCode: code,
        moveQty: newSkuQty,
        warehouseAreaCode: this.warehouseSpaceCodeConfig.find(v => v.warehouseSpaceCode === code).warehouseAreaCode,
      }).then(res => {
        this.skuStockMoveLoading = false
        if (!res) return
        this.moveLibraryDialogVisible = false
        this.newWarehouseSpaceCode = null
        this.getTableData()
      })
    },
    /** 导出 */
    getExport() {
      exportLedger(this.searchParams)
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