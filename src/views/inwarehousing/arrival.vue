<template>
  <div class="arrival Arrival">
    <el-card
      class="simpleCard"
      shadow="never"
      body-style="padding:12px"
    >
      <new-search
        @submit="submit"
        :searchForm="searchForm"
        ref="arrivalDom"
      >
      </new-search>
      <el-col
        :span="24"
        style="margin-bottom:12px;"
      >
        <el-button
          type="primary"
          size="small"
          @click="select"
        >查询</el-button>
        <el-button
          type="primary"
          size="small"
          @click="resetForm"
        >重置</el-button>
      </el-col>
    </el-card>

    <div style="margin-bottom:12px">
      <el-button
        type="primary"
        size="small"
        :disabled="!Array.isArray(nowChildDataSelectData)||nowChildDataSelectData.length<=0"
        @click="submitOrider"
      >上架</el-button>
      <el-button
        type="primary"
        size="small"
        :disabled="!selectMainTableRows.length"
        @click="submitOrider"
      >打印单据</el-button>
      <el-button
        type="danger"
        size="small"
        :disabled="!activeOrder.orderCode"
        @click="deleteOrider"
      >
        <span v-if="activeOrder.orderCode">
          删除单据 : <span style="font-weight: 600;">{{activeOrder.orderCode}}</span>
          <i
            class="el-icon-close"
            style="pointer:cursor"
            @click.stop="clearRow"
          ></i>
        </span>
        <span v-else>
          删除
        </span>
      </el-button>
    </div>

    <el-dialog
      style="z-index:900"
      title="收货登记"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div class="alertInfo">
        <span>入库计划单 : {{activeOrder.planCode}}</span>
        <span>收货单号 : {{activeOrder.orderCode}}</span>
        <span>供应商 : {{activeOrder.providerName}}</span>
        <span>收货时间 : {{ moment(activeOrder.gmtCreate).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>

      <web-pagination-table
        :loading="false"
        :config="arrivalAlertConfig"
        :allTableData="nowChildDataSelectData"
      />

      <div class="alertBottomArr">
        <el-button
          type="primary"
          size="small"
          @click="putawayConfirm"
        >上架</el-button>
        <el-button
          type="primary"
          size="small"
          @click="cancelArrivalAlert"
        >取消</el-button>
      </div>
    </el-dialog>

    <div
      class="arrivalAlertChider"
      v-if="arrivalAlertDisplay"
    >
      <div class="arrivalAlertChiderBody">
        <div style="font-size:12px;margin:15px 0">
          <span style="font-size:12px; font-weight: bold;">批次：</span> <span>{{addSearchForm.batchNo}}</span>
        </div>
        <el-form
          :model="addSearchForm"
          label-width="70px"
          label-position="left"
        >
          <el-form-item
            label-width="40px"
            label="库位"
            class="postInfo-container-item"
          >
            <el-select
              v-model="addSearchForm.warehouseSpaceCode"
              filterable
              clearable
              placeholder="请选择库位"
              size="small"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in warehouseSpaceCodeConfig"
                :key="item.warehouseSpaceCode"
                :label="item.warehouseSpaceCode"
                :value="item.warehouseSpaceCode"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label-width="40px"
            label="数量"
          >
            <el-input-number
              type="text"
              size="small"
              style="width:200px"
              :min="0"
              v-model="addSearchForm.putQty"
              placeholder="请输入上架数量"
            >
            </el-input-number>
          </el-form-item>

          <el-form-item class="addButton">
            <el-button
              type="primary"
              size="small"
              @click="addWarehouseSpaceCode"
            >添加</el-button>
          </el-form-item>
        </el-form>

        <edit-table
          :loading="false"
          @dataChange="deleteByindex"
          emptyText="请选择库位并输入数量添加数据"
          :config="putQtyConfig"
          :deleteNeed="true"
          :useEdit="false"
          :tableData="warehouseSpaceCodeListTable"
        />

        <div class="alertBottomArr">
          <el-button
            type="primary"
            size="small"
            @click="sureWarehouse"
          >确认</el-button>
          <el-button
            type="primary"
            size="small"
            @click="cancelWarehouse"
          >取消</el-button>
        </div>
      </div>
    </div>

    <double-table
      ref="tableChild"
      :canSelect="true"
      @dataSelect="handleDataSelect"
      :loading="loading"
      :config="arrivalConfig"
      :table-data="tableData"
      child-data-name="childData"
      :childTableConfig="arrivalChildTableConfig"
      :highlight-current-row="true"
      :child-can-select="true"
      :highlightCurrentRow="true"
      expand-key="id"
      :can-edit="true"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNum"
      editText="修改到货数量"
      :expands-parent="expandsParent"
      @expandChangePa="expandChange"
      @childDataSelect="childDataSelect"
      @sizeChange="handleSizeChange"
      @currentRadioChange="currentRadioChange"
      @currentChange="handleCurrentChange"
      @dataChange="dataChange"
    >
      <template
        slot="edit"
        slot-scope="scope"
      >
        <el-button
          size="mini"
          style="margin-top: 10px"
          @click="printBatchTag(scope.row)"
        >打印批次标签</el-button>
      </template>
    </double-table>
    <el-dialog
      title="打印批次标签"
      :visible.sync="dialogVisibleLabel"
      width="70%"
    >
      <edit-table
        :config="planChildTableLabelConfig"
        :table-data="childData"
        v-loading="loading"
        :default-edit="false"
      ></edit-table>
      <template v-if="!previewIt">
        <div style="margin:10px;">
          <span style="font-weight:bold">预览</span>
          <span style="color: #888;">（最多100条，若需更多，请打印时增加份数！）</span>
        </div>
        <div
          id="print"
          style="width:80mm;height:40mm;overflow:auto;margin:10px;"
        >
          <div
            v-for="item in childData"
            :key="item.skuCode"
          >
            <div
              v-for="i in Math.min(Number(item.printNum), 100)"
              :key="i"
              class="labelContainer"
            >
              <div class="labelItem"><span class="labelItemLeft">商品编码</span><span>{{item.skuCode}}</span></div>
              <div class="labelItem"><span class="labelItemLeft">商品名称</span><span>{{item.skuName}}</span></div>
              <div class="labelItem"><span class="labelItemLeft">规格型号</span><span>{{item.skuFormat}}</span></div>
              <div class="labelItem"><span class="labelItemLeft">货主</span><span>{{item.ownerName}}</span></div>
              <div class="labelItem"><span class="labelItemLeft">供应商</span><span>{{item.providerName}}</span></div>
              <div class="labelItem"><span class="labelItemLeft">批次</span><span>{{item.batchNo}}</span></div>
              <div class="labelItem"><span class="labelItemLeft">收货单号</span><span>{{item.orderCode}}</span></div>
              <div>
                <bar-code :code="item.batchNo"></bar-code>
              </div>
            </div>
          </div>
        </div>
      </template>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisibleLabel = false">取 消</el-button>
        <el-button
          type="primary"
          @click="getCode"
        >预览</el-button>
        <el-button
          type="primary"
          v-if="!previewIt"
          @click="printLabel"
        >打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import DoubleTable from '@/components/Table/doubleTable'
import newSearch from './components/newSearch'
import editTable from '@/components/Table/editTable'
import webPaginationTable from '@/components/Table/webPaginationTable'
import _ from 'lodash';
import moment from 'moment';
import { MakePrint } from '@/utils'
import { PositiveIntegerReg } from '@/utils/validator'
import { arrivalConfig, arrivalChildTableConfig, arrivalAlertConfig, putQtyConfig, planChildTableLabelConfig } from './components/config'
import { orderList, orderDetailList, orderUpdateReceiveQty, receiveOrderDelete, warehouseSpaceSelect, jobAdd, getBatchNo } from '@/api'
export default {
  components: { DoubleTable, newSearch, webPaginationTable, editTable },
  data() {
    return {
      loading: false,
      arrivalConfig,
      tableData: [],
      arrivalChildTableConfig,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      searchForm: {
        orderType: '',
        providerName: '',
        planCode: '',
        ownerName: '',
        execStatus: '',
        execState: '',
        orderCode: ''
      },
      addSearchForm: {
        warehouseSpaceCode: '',
        putQty: 1,
        batchNo: ''
      },
      putQtyConfig,
      activeOrder: {},
      expandsParent: [],
      arrivalAlertConfig,
      warehouseSpaceCodeListTable: [],
      nowChildDataSelectData: [],
      warehouseSpaceCodeConfig: [],
      dialogVisible: false,
      arrivalAlertDisplay: false,
      dialogVisibleLabel: false,
      childData: [],
      skuRow: {},
      previewIt: true,
      selectMainTableRows: [],
      planChildTableLabelConfig
    }
  },

  created() {

    this.arrivalAlertConfig.forEach(item => {
      if (item.useLink) {
        item.dom = (row, column, cellValue, index) => {
          return <span class="link_dom" onClick={this.upperShelf.bind(this, row)} >输入上架量</span>
        }
      }
    });

    if (sessionStorage.getItem('warehouse')) {
      warehouseSpaceSelect().then(res => {
        if (res) {
          this.warehouseSpaceCodeConfig = res.data || [];
        }
      })
    }
  },

  methods: {
    moment,
    handleDataSelect(val) {
      console.log(val)
      this.selectMainTableRows = val
    },
    getBatchNoArr(batchNoArr) {
      var arr = [], brr = []
      for (var i = 0; i < batchNoArr.length; i++) {
        let req = getBatchNo(batchNoArr[i])
        arr.push(req)
        brr.push(i)
      }
      return axios.all(arr).then(axios.spread((...brr) => {
        return brr
      }))
    },
    /** 预览 */
    async  getCode() {
      let id = this.expandsParent[0]
      let parent = this.tableData.find(item => item.id === id)
      var childData = [...this.childData]
      var batchNoArr = []
      var canPriview = true
      childData.map(item => {
        if (!PositiveIntegerReg.test(item.printNum)) {
          canPriview = false
        }
        batchNoArr.push({ skuCode: item.skuCode, ownerCode: parent.ownerCode, providerCode: parent.providerCode })
      })
      if (!canPriview) {
        this.$message({ type: 'error', message: '打印张数为正整数' })
        return false
      }
      var abb = await this.getBatchNoArr(batchNoArr)
      abb.map(item => {
        if (item.success && item.data && item.data.batchNo) {
          childData = childData.map(child => {
            if (item.data.skuCode == child.skuCode) {
              child.batchNo = item.data.batchNo
            }
            return child
          })
        } else {
          canPriview = false
        }
      })
      if (!canPriview) {
        this.$message({ type: 'error', message: '批次号查询出错，请重试' })
        return false
      }
      this.childData = [...childData]
      this.previewIt = false
    },
    /** 打印批次标签 按钮点击，展示弹窗 */
    printBatchTag(row) {
      this.dialogVisibleLabel = true
      let obj = { ...row }
      let id = this.expandsParent[0]
      let parent = this.tableData.find(item => item.id === id)
      this.childData = [obj].map((item, index) => {
        item.editable = true
        item.printNum = item.realInQty
        item.ownerName = parent.ownerName;
        item.providerName = parent.providerName;
        item.orderCode = parent.orderCode;
        return item
      })
    },
    /** 打印 */
    printLabel() {
      let label = document.getElementById('print').innerHTML
      //样式暂时不可配，需优化
      let style = "<style type='text/css'>.labelContainer{width:80mm;overflow:hidden;border-bottom: 1px dashed #eee;}.labelItem{ line-height: 5mm; font-weight: 600;font-size: 13px;}.labelContainer .labelItemLeft{display:inline-block;width:70px;margin-right:20px;} img{width:40mm;height:15mm}</style>"
      MakePrint(label, style)
    },
    putawayConfirm() {
      let json = {};
      json['orderCode'] = this.activeOrder.orderCode;
      json['putSpaceInfoList'] = [];
      _.cloneDeep(this.nowChildDataSelectData).forEach(item => {
        let arr = item.warehousingArr || [];
        arr.forEach(v => {
          let vJson = {};
          vJson['warehouseAreaCode'] = this.warehouseSpaceCodeConfig.find(item => item.warehouseSpaceCode === v.warehouseSpaceCode).warehouseAreaCode
          vJson['warehouseSpaceCode'] = v.warehouseSpaceCode;
          vJson['putQty'] = v.putQty;
          vJson['orderDetailId'] = item.id;
          json['putSpaceInfoList'].push(vJson)
        })
      });
      if (json['putSpaceInfoList'].length <= 0) {
        this.$message({ type: 'error', message: '请先输入上架量！' })
        return
      }
      jobAdd(json).then(res => {
        if (!res) return
        this.dialogVisible = false;
        this.$message({ type: 'success', message: '操作成功！' })
        this.warehouseSpaceCodeListTable = [];
      })
    },
    deleteByindex(index, row) {
      let warehouseSpaceCodeListTable = _.cloneDeep(this.warehouseSpaceCodeListTable);
      warehouseSpaceCodeListTable.splice(index, 1);
      this.warehouseSpaceCodeListTable = warehouseSpaceCodeListTable;
    },
    /** 确认 */
    sureWarehouse() {
      let nowChildDataSelectData = _.cloneDeep(this.nowChildDataSelectData);
      let index = nowChildDataSelectData.findIndex(v => v.id === this.skuRow.id);
      if (index < 0) {
        return
      }
      nowChildDataSelectData[index]['warehousingArr'] = this.warehouseSpaceCodeListTable;
      this.nowChildDataSelectData = nowChildDataSelectData;
      this.arrivalAlertDisplay = false;
      this.warehouseSpaceCodeListTable = [];
      this.addSearchForm = {};
    },

    cancelWarehouse() {
      this.arrivalAlertDisplay = false;
      this.warehouseSpaceCodeListTable = [];
      this.addSearchForm = {};
    },

    addWarehouseSpaceCode() {
      for (let i in this.addSearchForm) {
        if (this.addSearchForm[i] === '') {
          this.$message({ type: 'error', message: '库位和数量都是必填参数' });
          return
        }
      }
      if (this.addSearchForm['putQty'] === 0) {
        this.$message({ type: 'error', message: '数量不能为0' });
        return
      }

      let putQtyAll = this.warehouseSpaceCodeListTable.reduce((a, b) => {
        return a + b.putQty
      }, 0)

      if (putQtyAll + this.addSearchForm['putQty'] > this.skuRow.receiveQty) {
        this.$message({ type: 'error', message: '上架数量不能大于收货量' });
        return
      }
      let json = { id: moment().valueOf(), ...this.addSearchForm };
      let index = this.warehouseSpaceCodeListTable.findIndex(v => v.warehouseSpaceCode === this.addSearchForm.warehouseSpaceCode)
      if (index === -1) {
        this.warehouseSpaceCodeListTable.push(json);
      } else {
        this.warehouseSpaceCodeListTable[index]['putQty'] += this.addSearchForm['putQty']
      }
    },

    upperShelf(row) {
      this.arrivalAlertDisplay = true;
      this.skuRow = row;
      this.warehouseSpaceCodeListTable = row.warehousingArr;
      this.addSearchForm.batchNo = row.batchNo
    },

    cancelArrivalAlert() {
      this.dialogVisible = false;
      this.warehouseSpaceCodeListTable = [];
    },

    submitOrider() {
      this.dialogVisible = true;
    },

    submit(value) {
      this.searchForm = value;
      this.getCurrentTableData()
    },

    select() {
      this.searchForm.execStatus = this.searchForm.execState
      this.$refs['arrivalDom'].submit()
    },

    resetForm() {
      this.searchForm.execStatus = ''
      this.searchForm.execState = ''
      this.$refs['arrivalDom'].resetForm()
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getCurrentTableData()
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCurrentTableData()
    },
    clearRow() {
      this.$refs['tableChild'].setCurrentRow()
      this.activeOrder = {}
    },
    currentRadioChange(currentRow) {
      this.activeOrder = currentRow;
    },

    deleteOrider() {
      let json = this.activeOrder;
      if (json.execStatus !== 0) {
        this.$message({ type: 'error', message: '已有上架记录不能删除！' });
        return
      }
      this.$confirm(`  确定要删除收货单号为 ${json.orderCode} 计划单号为 ${json.planCode} 的单据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        receiveOrderDelete(json.id).then(res => {
          if (res) {
            this.$message({ type: 'success', message: '操作成功！' });
            this.activeOrder = {};
            this.getCurrentTableData()
          }
        })
      }).catch(() => { })
    },

    dataChange(index, type, changeData) {
      orderUpdateReceiveQty({
        receiveDetailId: changeData.id,
        receiveQty: changeData.receiveQty
      }).then(res => {
        if (res) {
          this.$message({ type: 'success', message: '操作成功！' });
          this.expandChange(this.activeOrder, {}, false)
        }
      })
    },

    expandChange(json, expandedRows, reserver = true) {

      this.activeOrder = json;
      if (reserver && this.expandsParent.includes(json['id'])) {
        this.expandsParent = []
      } else {
        this.expandsParent = [json['id']]
      }

      let tableData = _.cloneDeep(this.tableData);
      let index = tableData.findIndex(v => v.id === json.id);
      if (reserver && tableData[index]['childData'] && Array.isArray(tableData[index]['childData'])) {
        return
      }

      orderDetailList(json.id).then(res => {
        if (res) {
          tableData[index]['childData'] = res.data.map(item => {
            let itemJson = item;
            itemJson.rowId = json.id;
            return itemJson;
          });
          this.tableData = tableData;
        }
      })
    },

    childDataSelect(val) {
      this.nowChildDataSelectData = _.cloneDeep(val.arr).map(v => {
        let json = v;
        json['warehousingArr'] = [];
        return json;
      });
    },

    getCurrentTableData() {
      this.loading = true;
      orderList({
        ...this.searchForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false;
        if (res) {
          this.tableData = res.data && res.data.list || [];
          this.total = res.data && res.data.total;
        }
      })
    }
  },

  mounted() {
    this.getCurrentTableData()
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" >
.Arrival {
  .alertInfo {
    span {
      display: inline-block;
      white-space: nowrap;
      margin: 0 15px 5px;
    }
  }
}
.labelContainer {
  width: 80mm;
  overflow: hidden;
  border-bottom: 1px dashed #eee;
  .labelItem {
    line-height: 5mm;
    font-weight: 600;
    font-size: 13px;
  }
  .labelItemLeft {
    display: inline-block;
    width: 60px;
    margin: 0 10px;
  }
  img {
    width: 40mm !important;
    height: 15mm;
    margin: 0 auto;
  }
}
.el-popper[x-placement^="bottom"] {
  z-index: 3001 !important;
}
.arrival {
  .alertInfo {
    margin-bottom: 12px;
    > span {
      font-size: 14px;
      padding-right: 20px;
    }
  }
  .alertBottomArr {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
  }

  .arrivalAlertChider {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 3000;
    background: rgba(0, 0, 0, 0.3);
    .arrivalAlertChiderBody {
      padding: 12px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      min-width: 600px;
      min-height: 200px;
      background: #fff;
    }
  }

  .el-form {
    display: flex;
    .el-form-item {
      margin-right: 12px;
    }
    .addButton {
      > div {
        margin-left: 20px !important;
      }
    }
  }
}
</style>
