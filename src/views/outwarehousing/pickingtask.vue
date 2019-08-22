<template>
  <div class="pickingtask">

    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="360"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleDetail(scope.row)"
        >详情</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handePrint(scope.row, 'Printing')"
        >打印拣货单</el-link>
        <el-divider
          v-if="[0, 1].includes(scope.row.orderStatus)"
          direction="vertical"
        ></el-divider>
        <el-link
          v-if="[0, 1].includes(scope.row.orderStatus)"
          type="primary"
          @click="handleDetail(scope.row)"
        >拣货</el-link>
        <el-divider
          v-if="[0, 1].includes(scope.row.orderStatus)"
          direction="vertical"
        ></el-divider>
        <el-link
          v-if="[0, 1].includes(scope.row.orderStatus)"
          type="primary"
          @click="handlePickStop(scope.row)"
        >终止拣货</el-link>
        <el-divider
          v-if="[0].includes(scope.row.orderStatus)"
          direction="vertical"
        ></el-divider>
        <el-link
          v-if="[0].includes(scope.row.orderStatus)"
          type="primary"
          @click="handleDelete(scope.row)"
        >删除拣货</el-link>
      </template>
      <template slot="btns">
      </template>
    </base-list>
    <el-dialog
      :title="`拣货单详情 ( 拣货单号:${activeRow.orderCode} ) `"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        class="select-table"
        v-loading="detailLoding"
        :data="pickingtaskdetailTableData"
        border
        ref="multipleTable"
        @selection-change="selectionChange"
        size="mini"
      >
        <el-table-column
          type="selection"
          width="50"
          :selectable="selectable"
        >
        </el-table-column>
        <el-table-column
          v-for="(item, index ) in pickingtaskdetailConfig"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="click"
              @hide="handlePopoverHide(scope.$index, scope.row)"
            >
              <el-table
                size="mini"
                :data="gridData"
                v-loading="sonTableLoading"
              >
                <el-table-column
                  property="index"
                  width="50"
                  label="序号"
                ></el-table-column>
                <el-table-column
                  property="warehouseSpaceCode"
                  label="库位"
                  width="100"
                ></el-table-column>
                <el-table-column
                  property="qty"
                  width="80"
                  label="可用库存"
                ></el-table-column>
                <el-table-column
                  property="num"
                  label="通知拣货量"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      size="mini"
                      v-model="scope.row.num"
                      :precision="0"
                      :min="0"
                      :max="scope.row.qty"
                    ></el-input-number>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                slot="reference"
                size="mini"
                @click="handleSelectSon(scope.$index, scope.row)"
                :disabled="scope.row.jobStatus > 3"
              >变更库位</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <span
        slot="footer"
        class="dialog-footer"
        v-if="[0,1].includes(activeRow.orderStatus)"
      >
        <el-button
          size="mini"
          @click="dialogVisible = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="suerPicking"
        >确认拣货</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="打印拣货单"
      :visible.sync="printingAlert"
      width="60%"
      :before-close="handleClose"
    >
      <div id="pickingOrder">
        <div style="display: flex;">
          <div style="margin-right: 50px;line-height: 26px;">
            <span>拣货单号:</span> <span>{{activeRow.orderCode}}</span><br>
            <span>拣货人:</span> <span>{{activeRow.pickOperatorName}}</span><br>
            <span>仓库:</span> <span>{{warehouseName}}</span>
          </div>
          <div style="width:200px;padding-top:5px">
            <BarCode :code="activeRow.orderCode" />
          </div>
        </div>

        <div style=" display: flex;justify-content: flex-end;margin-bottom:12px">
          <span style="padding-right:12px">打印时间 :</span>
          <span>{{this.moment().format("YYYY-MM-DD HH:mm:ss")}}</span>
        </div>

        <web-pagination-table
          :loading="detailLoding"
          :config="printinConfig"
          :allTableData="pickingtaskdetailTableData"
        />
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="printingAlert = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="planPrintOrder"
        >打印</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex'
import { pickingtaskdetailConfig, printinConfig } from './components/config'
import { pickOrderList, pickOrderDetail, orderPickConfirm, orderDelete, orderPickStop, querySkuStockByOutJobId } from '@/api'
import webPaginationTable from '@/components/Table/webPaginationTable'
import { MakePrint } from '@/utils'
import { orderStatus, jobStatusList } from '@/utils/enum'

const tableConfig = [
  { label: '拣货单号', prop: 'orderCode' },
  { label: '应拣货总量', prop: 'pickQty' },
  { label: '已拣货总数', prop: 'realPickQty' },
  { label: '状态', prop: 'orderStatus', type: 'enum', enum: orderStatus },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const searchConfig = [
  { label: '拣货单号', prop: 'orderCode', type: 'input' },
  { label: '计划单号', prop: 'outOrderCode', type: 'input' },
  { label: '拣货状态', prop: 'orderStatus', type: 'select', enum: orderStatus },
]

export default {
  components: { webPaginationTable },
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: pickOrderList,
      dialogVisible: false,
      pickingtaskdetailConfig,
      pickingtaskdetailTableData: [],
      detailLoding: false,
      activeRow: '',
      selectionData: [],
      printingAlert: false,
      printinConfig,
      warehouseName: '',
      gridData: [],
      cache: {}, // 缓存
      cacheApi: {}, // 缓存api
      skuStock: {}, // 库存统计
      sonTableLoading: false,
    }
  },

  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },

  created() {
    if (sessionStorage.getItem('warehouse') && this.userInfo.warehouses && Array.isArray(this.userInfo.warehouses)) {
      let warehousesConfig = this.userInfo.warehouses.find(v => v.warehouseNo === sessionStorage.getItem('warehouse'))
      this.warehouseName = warehousesConfig.warehouseName;
    }
  },
  methods: {
    moment,
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    selectable(row, index) {
      return !(row.jobStatus > 3)
    },
    /** dialog 隐藏 */
    dialogClose() {
      this.cache = {}
      this.cacheApi = {}
      this.gridData = []
      this.skuStock = {}
      this.pickingtaskdetailTableData.forEach(v => v.sum = '')
    },
    /** popover 隐藏事件 */
    handlePopoverHide(indexHide, itemHide) {
      if (!this.dialogVisible) return
      // 切换选择时， hide 是后发生的
      if (itemHide && this.gridData.item !== itemHide) {
        return
      }
      if (this.gridData.length) {
        let item = this.gridData.item
        let sum = ''
        let map = {}
        let total = 0
        this.gridData.forEach(v => {
          if (!v.num) return
          if (sum.length) {
            sum += ','
          }
          map[v.id] = v.num
          sum += (v.warehouseSpaceCode + ':' + v.num)
          total += v.num
        })
        item.realSortStocks = map
        if (sum) {
          item.sum = sum
        }
        item.total = total
        // this.pickingtaskdetailTableData = [...this.pickingtaskdetailTableData]
        this.cache[item.outJobId] = JSON.parse(JSON.stringify(this.gridData))
        this.gridData = []
      }
    },
    /** 选择 通知拣货数量 */
    handleSelectSon(index, item, type) {
      if (this.gridData.length) {
        this.handlePopoverHide()
      }
      const _ = (data) => {
        this.gridData = data.map((item, index) => {
          item.index = index + 1
          item.qty = item.skuQty - item.blockQty
          item.num = 0
          return item
        })
        this.gridData.item = item
      }
      if (this.cache[item.outJobId]) {
        this.gridData = this.cache[item.outJobId]
        this.gridData.item = item
      } else {
        let key = item.outJobId
        if (this.cacheApi[key]) {
          _(this.cacheApi[key])
        } else {
          this.sonTableLoading = true
          querySkuStockByOutJobId({
            outJobId: item.outJobId,
          }).then(res => {
            if (res) {
              this.cacheApi[key] = JSON.parse(JSON.stringify(res.data))
              res.data.forEach(v => {
                this.skuStock[v.id] = { code: v.warehouseSpaceCode, qty: v.skuQty - v.blockQty }
              })
              _(res.data)
            }
            this.sonTableLoading = false;
          })
        }
      }

    },
    planPrintOrder() {
      let printPlanContainer = document.getElementById('pickingOrder').innerHTML
      MakePrint(printPlanContainer)
    },
    pickOrderDetailaPI(id) {
      this.detailLoding = true;
      pickOrderDetail(id).then(res => {
        this.detailLoding = false;
        if (res) {
          res.data.forEach(item => {
            item.sum = item.warehouseSpaceCode + ':' + item.jobQty
            item.realSortQty = item.realSortQty || 0
            item.status = jobStatusList.find(v => v.value === item.jobStatus).name
          })
          this.pickingtaskdetailTableData = res.data || [];
        }
      })
    },
    selectionChange(val) {
      this.selectionData = val
      if (val.length > 1) {
        val.forEach((v, index) => {
          if (index === (val.length - 1)) return
          this.$refs.multipleTable.toggleRowSelection(v)
        })
      }
    },
    suerPicking() {
      if (this.selectionData.length === 0) {
        this.$message({ type: 'info', message: '请先选择商品' });
        return;
      }
      let json = {};
      json.pickConfirmItemReqList = this.selectionData
      json.planCode = this.selectionData[0].planCode;
      json.pickOrderId = this.activeRow.id;
      let skuStock = JSON.parse(JSON.stringify(this.skuStock))
      let message = ''
      this.selectionData.forEach(v => {
        v.realSortStocks && Object.keys(v.realSortStocks).forEach(id => {
          skuStock[id].num = skuStock[id].num || 0
          skuStock[id].num += v.realSortStocks[id]
        })
        if (v.total > v.jobQty) {
          message = `计划单 ${v.planCode} 的本次拣货数量应该在 0-${v.jobQty} 之间`
        }
      })
      if (message) {
        return this.$message({ type: 'error', message })
      }
      for (let key in skuStock) {
        let item = skuStock[key]
        if (item.num !== undefined && item.num > item.qty) {
          return this.$message({ type: 'error', message: `库位【${item.code}】的可用库存为${item.qty}，当前已使用${item.num}` })
        }
      }
      this.selectionData.forEach(v => {
        if (!v.realSortStocks || !Object.keys(v.realSortStocks).length) {
          v.realSortStocks = {}
          v.realSortStocks[v.stockId] = v.jobQty
        }
      })
      orderPickConfirm(json).then(res => {
        if (res) {
          this.$message({ type: 'success', message: '操作成功，可以去出库暂存页面查看' });
          this.dialogVisible = false;
        }
      })

    },
    handleClose() {
      this.dialogVisible = false;
      this.printingAlert = false;
    },
    /** 详情 按钮点击 */
    handleDetail(row) {
      this.selectionData = [];
      this.dialogVisible = true;
      this.activeRow = row;
      this.pickOrderDetailaPI(row.id);
    },
    /** 打印拣货单 按钮点击 */
    handePrint(row) {
      this.printingAlert = true;
      this.activeRow = row;
      this.pickOrderDetailaPI(row.id);
    },
    /** 终止拣货 点击 */
    handlePickStop(row) {
      this.$apiConfirm('确定要终止操作码？', () => orderPickStop(row.id)).then((action) => {
        console.log(action)
        this.$message.success('操作成功！')
        this.getTableData()
      }).catch(() => { })
    },
    /** 删除拣货 点击 */
    handleDelete(row) {
      this.$apiConfirm('确定要删除吗？', () => orderDelete(row.id)).then(() => {
        this.$message.success('操作成功！')
        this.getTableData()
      }).catch(() => { })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.pickingtask {
  .tableBtnBox {
    font-size: 12px;
    span {
      margin-right: 12px;
      color: #3399ea;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .select-table {
    .el-table__header {
      .el-checkbox {
        visibility: hidden;
      }
    }
  }
}

.el-dialog__body {
  padding-top: 0;
}
</style>