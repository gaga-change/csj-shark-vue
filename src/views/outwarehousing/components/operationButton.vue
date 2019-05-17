<template>
  <div style="margin-bottom:10px">
    <!-- <el-button 
           type="primary" 
           size="small" 
           @click="priviewReserve">
            打印计划单
        </el-button> -->

    <el-button
      type="primary"
      size="small"
      @click="PickingOrder"
    >
      分配拣货任务
    </el-button>

    <!-- <el-button 
           type="primary" 
           size="small"
           @click="priviewBoxLabel">
           打印装箱单 
        </el-button> -->

    <div>
      <el-dialog
        title="按单拣货"
        :visible.sync="dialogVisible"
        width="90%"
      >
        <span>拣货人姓名:</span>
        <el-input
          type="text"
          size="small"
          style="width:200px;margin-bottom:12px;"
          placeholder="请输入拣货人姓名"
          v-model="pickOperatorName"
        >
        </el-input>
        <!-- <edit-table
          :config="planChildTableEditAllocationConfig"
          :table-data="PickingOrderData"
          :default-edit="false"
        >
        </edit-table> -->
        <el-table
          :data="PickingOrderData"
          border
          size="mini"
        >
          <el-table-column
            v-for="(item, index ) in planChildTableEditAllocationConfig"
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
                  :disabled="(scope.row.planOutQty - scope.row.sortQty) <= 0"
                >选择</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            @click="surePicking"
            type="primary"
          >确认</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="打印装箱单"
        :visible.sync="dialogVisibleLabel"
        width="841px"
      >
        <div id="print">
          <edit-table
            :config="planChildTableLabelConfig"
            :default-canedit="defaultCanedit"
            :table-data="childData"
            v-loading="loading"
            :default-edit="false"
          >
          </edit-table>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
          v-loading="loading"
        >
          <el-button @click="dialogVisibleLabel = false">取 消</el-button>
          <el-button
            type="primary"
            @click="printLabel"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="打印计划单"
        :visible.sync="dialogVisibleReserve"
        width="841px"
      >
        <edit-table
          :config="planChildTablePrintConfig"
          :table-data="printPlan"
          id="printPlanContainer"
          :default-edit="false"
        >
        </edit-table>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisibleReserve = false">取 消</el-button>
          <el-button
            type="primary"
            @click="printPlanOrder"
          >打印</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import editTable from '@/components/Table/editTable'
import { outboundOrderSubmit, pickOrderAdd } from '@/api/warehousing'
import { getInfoOnPageInventory } from '@/api/inventory'
import { PositiveIntegerReg, MoneyPositiveReg } from '@/utils/validator'
import { MakePrint } from '@/utils'
import { planChildTableEditAllocationConfig, planChildTableLabelConfig, planChildTablePrintConfig } from './config'
import { printPlanDataFn } from './dataHandler'

export default {
  name: 'operationButton',
  components: {
    editTable
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisibleLabel: false,
      dialogVisibleReserve: false,
      previewIt: true,
      loading: false,
      childData: [],
      planChildTableEditAllocationConfig,
      planChildTableLabelConfig,
      planChildTablePrintConfig,
      printPlan: [],//打印计划单
      defaultCanedit: true,
      PickingOrderData: [],
      pickOperatorName: '',
      sonTableLoading: false,
      gridData: [],
      cache: {}, // 缓存
      cacheApi: {}, // 缓存api
      skuStock: {}, // 库存统计
    }
  },
  props: {
    parentDataObj: {
      type: Object,
      default: () => { }
    },
    childDataArr: {
      type: Array,
      default: () => []
    },
    planPrintData: {
      type: Array,
      default: () => []
    },
    orderType: {
      type: String,
      default: ''
    },
    activePlanCode: {
      type: String,
      default: ''
    },
    selectChiledByPlanCode: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.dialogClose()
      }
    }
  },
  created() {
    this.cache = {}
  },
  methods: {
    /** dialog 隐藏 */
    dialogClose() {
      this.cache = {}
      this.cacheApi = {}
      this.gridData = []
      this.skuStock = {}
      this.PickingOrderData.forEach(v => v.sum = '')
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
        item.sortList = map
        item.sum = sum
        item.total = total
        this.PickingOrderData = [...this.PickingOrderData]
        this.cache[item.skuCode + item.planCode] = JSON.parse(JSON.stringify(this.gridData))
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
      if (this.cache[item.skuCode + item.planCode]) {
        this.gridData = this.cache[item.skuCode + item.planCode]
        this.gridData.item = item
      } else {
        let key = item.ownerCode + item.skuCode
        if (this.cacheApi[key]) {
          _(this.cacheApi[key])
        } else {
          this.sonTableLoading = true
          getInfoOnPageInventory({
            ownerCode: item.ownerCode,
            skuCode: item.skuCode
          }).then(res => {
            if (res.success && res.data) {
              this.cacheApi[key] = JSON.parse(JSON.stringify(res.data))
              res.data.forEach(v => {
                this.skuStock[v.id] = { code: v.warehouseSpaceCode, qty: v.skuQty - v.blockQty }
              })
              _(res.data)
            }
            this.sonTableLoading = false;
          }).catch(err => {
            this.sonTableLoading = false;
          })
        }
      }

    },
    surePicking() {
      if (this.gridData.length) {
        this.handlePopoverHide()
      }
      let json = {}
      let skuStock = JSON.parse(JSON.stringify(this.skuStock))
      json.pickOrderDetailAddReqList = JSON.parse(JSON.stringify(this.PickingOrderData))
      let sortListSum = 0
      if (json.pickOrderDetailAddReqList.some(v => {
        let total = v.total || 0
        delete v.total
        delete v.sum
        sortListSum += total
        v.sortList && Object.keys(v.sortList).forEach(id => {
          skuStock[id].num = skuStock[id].num || 0
          skuStock[id].num += v.sortList[id]
        })
        if (total > v.planOutQty - v.sortQty) {
          this.$message({ type: 'error', message: `计划单 ${v.planCode} 的本次出库数量应该在 0-${v.planOutQty - v.sortQty} 之间` })
          return true
        }
      })) {
        return
      }
      if (!sortListSum) {
        return this.$message({ type: 'error', message: '请选择拣货数量' })
      }
      for (let key in skuStock) {
        let item = skuStock[key]
        if (item.num !== undefined && item.num > item.qty) {
          return this.$message({ type: 'error', message: `库位【${item.code}】的可用库存为${item.qty}，当前已使用${item.num}` })
        }
      }
      // this.skuStock
      json.pickOperatorId = '666'
      json.pickType = 0;
      json.pickOperatorName = this.pickOperatorName;
      if (json.pickOperatorName === '') {
        this.$message({ type: 'error', message: '拣货人姓名必填' });
        return
      }
      pickOrderAdd(json).then(res => {
        if (res.success) {
          this.$message({ type: 'success', message: '操作成功!' });
          this.dialogVisible = false;
        }
      }).catch(err => {
      })
    },

    //打印装箱单
    priviewBoxLabel() {
      let arr = []
      for (let i in this.selectChiledByPlanCode) {
        arr = [...arr, ...this.selectChiledByPlanCode[i]]
      }
      this.childData = arr.map(v => {
        v.editable = true;
        v.printNum = Number(v.realOutQty).toFixed(0);
        return v
      })

      if (!this.childData.length) {
        this.$message({ type: 'error', message: '未选择子表里商品' });
        return
      }
      this.dialogVisibleLabel = true
      this.defaultCanedit = true
    },

    printLabel() {
      var childData = [...this.childData]
      this.childData = childData.map(v => {
        v.editable = false;
        return v
      })

      setTimeout(() => {
        let label = document.getElementById('print').innerHTML
        //样式暂时不可配，需优化
        let style = "<style type='text/css'>.border{border:1px solid #666;width:530px;display:inline-block;padding:10px;} .marginRight5{margin-right:5px;} table {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;} img{max-width:130px;} .card-list{margin-bottom: 6px;width:25%;display:inline-block} .el-dropdown{display:inline-block} </style>"
        MakePrint(label, style)
      }, 500)
    },

    PickingOrder() {
      let arr = []
      for (let i in this.selectChiledByPlanCode) {
        arr = [...arr, ...this.selectChiledByPlanCode[i]]
      }
      this.PickingOrderData = arr.map(v => {
        return v
      })
      if (!this.PickingOrderData.length) {
        this.$message({ type: 'error', message: '未选择子表里商品' });
        return
      }
      this.dialogVisible = true;
    },

    priviewReserve() {
      this.printPlan = [...printPlanDataFn([...this.planPrintData])]
      if (!this.printPlan.length) {
        this.$message({ type: 'error', message: '未选择单据,可点击任意行选择' });
        return
      }
      this.dialogVisibleReserve = true
    },

    printPlanOrder() {
      var printPlanContainer = document.getElementById('printPlanContainer').innerHTML
      MakePrint(printPlanContainer)
    },
  }
}
</script>

<style scoped lang="scss">
.labelContainer {
  width: 180px;
  .labelItemLeft {
    display: inline-block;
    width: 60px;
    margin-right: 10px;
  }
}
</style>

