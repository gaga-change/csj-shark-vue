<template>
  <div class="SelectProductCom">
    <el-dialog
      title="选择收货单"
      :visible="visible"
      width="80%"
      :before-close="handleClose"
      @close="close"
    >
      <div class="arrival Arrival">
        <div class="mt10">
          <search-form
            :config="selectGoodsSearchConfig"
            @search="submit"
          >
          </search-form>
        </div>
        <double-table
          ref="tableChild"
          :loading="loading"
          :config="arrivalConfig"
          :table-data="tableData"
          child-data-name="childData"
          :childTableConfig="arrivalChildTableConfig"
          :highlight-current-row="true"
          :child-can-select="true"
          :highlightCurrentRow="true"
          expand-key="id"
          :total="total"
          :pageSize="pageSize"
          :pageSizes="[5, 10, 15]"
          :currentPage="pageNum"
          editText="修改到货数量"
          :expands-parent="expandsParent"
          @expandChangePa="expandChange"
          @childDataSelect="childDataSelect"
          @sizeChange="handleSizeChange"
          @currentRadioChange="currentRadioChange"
          @currentChange="handleCurrentChange"
        >
        </double-table>
      </div>
      <el-alert
        class="mt15"
        title="注：点击表格中的行即可选中！"
        type="info"
        :closable="false"
      >
      </el-alert>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="close"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="confrim"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import DoubleTable from '@/components/Table/doubleTable'
import editTable from '@/components/Table/editTable'
import webPaginationTable from '@/components/Table/webPaginationTable'
import _ from 'lodash';
import { selectGoodsSearchConfig, arrivalConfig, arrivalChildTableConfig } from './config'
import { queryReceiverOrder, orderDetailList } from '@/api'
export default {
  components: { DoubleTable, webPaginationTable, editTable },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      arrivalConfig,
      selectGoodsSearchConfig,
      arrivalChildTableConfig,
      selectRows: [],
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 5,
      pageNum: 1,
      searchForm: {
      },
      activeOrder: {},
      expandsParent: [],
      warehouseSpaceCodeListTable: [],
      childData: [],
    }
  },
  created() {
    this.getCurrentTableData()
  },
  methods: {
    /** 确认 */
    confrim() {
      this.$emit('update:selectData', [...this.selectRows])
      // this.selectRows = []
      this.close()
    },
    /** 关闭 */
    close() {
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
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
    submit(params, callback) {
      let obj = { ...params }
      if (params.createTimeArea) {
        delete obj.createTimeArea
        obj.startDate = new Date(params.createTimeArea[0]).getTime()
        obj.endtDate = new Date(params.createTimeArea[1]).getTime()
      }
      this.searchForm = obj
      this.$nextTick(() => {
        this.getCurrentTableData().then(callback)
      })
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
    expandChange(json, expandedRows, reserver = true) {
      this.activeOrder = json;
      if (reserver && this.expandsParent.includes(json['id'])) {
        this.expandsParent = []
      } else {
        this.expandsParent = [json['id']]
      }

      let tableData = this.tableData
      let index = tableData.findIndex(v => v.id === json.id);
      if (reserver && tableData[index]['childData'].length) {
        return
      }
      orderDetailList(json.id).then(res => {
        if (res) {
          this.tableData[index].childData = res.data.map(item => {
            item.orderCode = json.orderCode
            item.checkResult = 2
            item.rowId = json.id
            return item
          })
        }
      })
    },

    childDataSelect(val) {
      this.selectRows = JSON.parse(JSON.stringify(val))
    },

    getCurrentTableData() {
      this.loading = true;
      return queryReceiverOrder({
        ...this.searchForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false;
        if (res) {
          this.tableData = res.data.list.map(v => {
            return {
              ...v,
              childData: [],
            }
          })
          this.total = res.data && res.data.total;
        }
      })
    }
  }
}
</script>
<style lang="scss">
.SelectProductCom {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
