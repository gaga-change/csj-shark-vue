<template>
  <div>
    <search-warehousing
      @searchTrigger="submitForm"
      ref="searchWarhouse"
      :outbound="outbound"
      @resetSearch="resetForm"
      :search-forms="ruleForm"
    >
    </search-warehousing>

    <!--          <div style="margin-bottom:12px;font-size:12px">
            <span>操作说明：当你点击某一行的同时，即为选中了当前的单据,在确认出库的下方你可以点击叉号取消选择</span>
         </div>

         <el-button 
           type="primary" 
           size="small"
           @click="quickSubmit" 
           :disabled="buttonDisable" 
           v-loading="buttonDisable" 
           style="margin-bottom:15px">
           确认出库
        </el-button>

       <el-button 
           type="primary" 
           size="small"
           @click="quickSubmit('cancel')" 
           :disabled="buttonDisable" 
           v-loading="buttonDisable" 
           style="margin-bottom:15px">
          取消出库
        </el-button>

        <div style="margin-bottom:15px" 
           v-show="planPrintData.length>0">
            <span style="font-size:13px">当前选中的单据</span>
            <el-tag v-for="tag in planPrintData" 
              :key="tag.planCode"
               closable 
               @close="closePlanTags(tag)" 
               style="margin:0 0 10px 10px;">
               {{tag.planCode}}
            </el-tag>
         </div> -->
    <operation-button
      :child-data-arr="childDataArr"
      :planPrintData="planPrintData"
      :selectChiledByPlanCode="selectChiledByPlanCode"
    />

    <double-table
      :loading="loading"
      :table-data="tableData"
      ref="tableChild"
      :handle-button-map="handleButtonMap"
      :highlight-current-row="highlightCurrentRow"
      child-data-name="queryOutWarehouseOrderDetailVOList"
      :config="tableConfig"
      :childTableConfig="childTableConfig"
      :expands-parent="expandsParent"
      @expandChangePa="expandChange"
      :accordion-expand="accordionExpand"
      @currentRadioChange="currentRadioChange"
      :child-can-select="childCanSelect"
      :expand-key="expandKey"
      @childDataSelect="childDataSelect"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :total="total"
      :maxTotal="10"
      :pageSize="ruleForm.pageSize"
      :currentPage="ruleForm.pageNum"
    >
    </double-table>

  </div>
</template>

<script>
import DoubleTable from '@/components/Table/doubleTable'
import { orderTableConfig, orderChildTableConfig } from './components/config'
import { getInfoOutWarehousing, getInfoDetailOutWarehousing, confirmOutOfTheLibrary, cancelOutOfTheLibrary } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
import SearchWarehousing from './components/search'
import operationButton from './components/outButton'
import { busiBillTypeEnum } from "@/utils/enum"
const BusiBillTypeEnumFilter = busiBillTypeEnum.filter(item => item.type.includes('out'))
export default {
  components: { DoubleTable, SearchWarehousing, operationButton },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogData: {},
      highlightCurrentRow: true,
      busiBillTypeEnum: BusiBillTypeEnumFilter,
      tabDefault: BusiBillTypeEnumFilter[0].value + '',
      currentTab: BusiBillTypeEnumFilter[0].value + '',
      ruleForm: {
        pageNum: 1,
        pageSize: 10,
        planCode: '',
        orderCode: '',
        providerName: '',
        ownerName: '',
        orderStatus: '',
        durationTime: [],
        text: '出库时间'
      },
      selectData: {},
      tableData: [],
      tableConfig: orderTableConfig,
      childTableConfig: orderChildTableConfig,
      total: 0,
      //主表操作
      handleButtonMap: [],
      childCanSelect: true,
      accordionExpand: true,
      multipleSelection: [],
      expandsParent: [],
      expandKey: 'orderCode',
      quickSubmitData: {},
      buttonDisable: false,
      outbound: true,
      planPrintData: [],
      childDataArr: [],
      selectChiledByPlanCode: {}
    }
  },
  methods: {

    expandChange(row, expandedRows) {
      var arr = []
      arr.push(row[this.expandKey])
      if (this.expandsParent == row[this.expandKey]) {
        this.expandsParent = []
      } else {
        this.expandsParent = [...arr]
      }
      this.currentRadioChange(row)
    },

    getTableData() {
      this.$router.replace({
        path: '/outwarehousing/outboundOrder',
        query: { data: JSON.stringify({ ...this.ruleForm, busiBillType: this.currentTab }) }
      })
      this.loading = true;
      let data = { ...this.ruleForm, busiBillType: this.currentTab }
      getInfoOutWarehousing(data).then(res => {
        if (res && res.data && res.data.list) {
          var tempList = [...res.data.list]
          this.tableData = uniqueArray(tempList, 'orderCode')
          this.total = res.data.total
          this.tableData.map(item => {
            if (item.queryOutWarehouseOrderDetailVOList && item.queryOutWarehouseOrderDetailVOList.length > 0) {
              item.queryOutWarehouseOrderDetailVOList.map(childitem => {
                childitem.printNum = 0
                childitem.planCode = item.planCode
                childitem.customerCode = item.customerCode
                childitem.customerName = item.customerName
                childitem.arrivalAddress = item.arrivalAddress
              })
            }
          })
          var a = this.$refs.tableChild.expands//之前打开过 
          if (a && a.length > 0) {
            var info = {
              childData: [],
              orderCode: a[0]
            }
            this.currentRadioChange(info)
          }
        }
        this.loading = false;
      })
    },
    currentRadioChange(data) {
      var chooseList = data
      if (!data.childData || data.childData.length <= 0) {
        this.loading = true
        getInfoDetailOutWarehousing({ orderCode: data.orderCode }).then(res => {
          if (res && res.data[0] && res.data[0].queryOutWarehouseOrderDetailVOSList && res.data[0].queryOutWarehouseOrderDetailVOSList.length > 0) {
            var queryOutWarehouseOrderDetailVOSList = res.data[0].queryOutWarehouseOrderDetailVOSList
            let owndata = res.data[0]
            queryOutWarehouseOrderDetailVOSList.map(item => {
              item.printNum = 0
              item.planCode = owndata.planCode
            })
            var tempList = [...this.tableData]
            this.tableData = tempList.map(list => {

              if (list.orderCode == data.orderCode) {
                list.childData = queryOutWarehouseOrderDetailVOSList;
                chooseList = list
              }
              return list
            })
          }
          this.loading = false
        })
      }
      this.quickSubmitData = { ...chooseList }
    },

    closePlanTags(tag) {
      let index = this.planPrintData.findIndex(v => v.id === tag.id);
      this.planPrintData.splice(index, 1)
    },

    quickSubmit(type) {
      if (!this.planPrintData.length) {
        this.$message({ type: 'error', message: '请至少选择一条数据,或当前数据都已确认出库过' });
        return
      }

      let Api = confirmOutOfTheLibrary;
      if (type === 'cancel') {
        Api = cancelOutOfTheLibrary
      }
      Api({
        ids: this.planPrintData.map(v => v.id)
      }).then(res => {
        if (res) {
          this.getTableData()
          this.$message({ type: 'success', message: '操作成功' });
        }
      })
    },

    childDataSelect(selectedData) {
      this.multipleSelection = []
      this.childDataArr = []
      if (selectedData.length) {
        this.selectChiledByPlanCode[selectedData[0].planCode] = selectedData
        this.multipleSelection = [...selectedData]
        this.childDataArr = [...selectedData].map(v => {
          return {
            ...v
          }
        })
        this.planPrintData = [...selectedData]
      } else {
        this.selectChiledByPlanCode = {}
        this.multipleSelection = []
        this.childDataArr = []
      }
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
      let startDate = '', endDate = '';
      if (Array.isArray(ruleForm.durationTime) && ruleForm.durationTime.length) {
        startDate = +ruleForm.durationTime[0]
        endDate = +ruleForm.durationTime[1]
      }
      this.ruleForm = { ...ruleForm, startDate, endDate, pageSize: 10, pageNum: 1 }
      this.getTableData();
    },

    resetForm() {
      for (let i in this.ruleForm) {
        if (Array.isArray(this.ruleForm[i])) {
          this.ruleForm[i] = []
        } else {
          this.ruleForm[i] = ''
        }
      }
      this.ruleForm = { ...this.ruleForm, text: '出库时间', pageNum: 1, pageSize: 10, }
      this.getTableData()
    },
  },
  created() {
    this.getTableData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>