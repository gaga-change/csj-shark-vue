<template>
  <div>
    <search-warehousing
      @searchTrigger="submitForm"
      ref="searchWarhouse"
      @resetSearch="resetForm"
      :search-forms="ruleForm"
    >
    </search-warehousing>

    <operation-button
      @lodash="lodash"
      :child-data-arr="childDataArr"
      :plan-print-data="planPrintData"
      :parent-data-obj="parentDataObj"
    />

    <double-table
      :loading="loading"
      :table-data="tableData"
      ref="tableChild"
      :handle-button-map="handleButtonMap"
      :highlight-current-row="highlightCurrentRow"
      :config="parentTableConfig"
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
import DoubleTable from '@/components/Table/printTable'
import { printplanTableConfig, planChildTableConfig } from './components/config'
import { getInfoWarehousing, getInfoDetailWarehousing } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
import SearchWarehousing from './components/printsearch'
import operationButton from './components/operationButton'

import { busiBillTypeEnum } from "@/utils/enum"
const BusiBillTypeEnumFilter = busiBillTypeEnum.filter(item => item.type.includes('in'))
const ruleForm = {
  pageNum: 1,
  pageSize: 10,
  durationTime: ['', ''],//时间，
  createBeginDate: '',
  createEndDate: '',
  planCode: '',
  providerName: '',
  execStatus: '',
  ownerName: '',
  isPrint: 0,
  busiBillType: 11
}

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
      ruleForm,
      selectData: {//x选中的单据

      },
      // searchForms,
      tableData: [],
      // pageNum:0,
      // pageSize:10,
      //子表数据名称
      childDataName: 'childData',
      //表格配置
      parentTableConfig: printplanTableConfig,
      childTableConfig: planChildTableConfig,
      // currentPage:1,
      // pageSize:10,
      total: 0,
      //主表操作
      handleButtonMap: [
        // {title:'详情',handle:(index,data)=>{
        //     this.dialogVisible = true
        //     this.dialogData = {...data}
        // }}
      ],
      multipleSelection: [],//选中的子表数据
      expandKey: 'planCode',
      //按钮操作所需数据
      parentDataObj: {},
      childDataArr: [],
      //计划单打印的选择数据
      planPrintData: [],
      expandsParent: [],
      activePlanCode: ''
    }
  },
  methods: {
    lodash() {
      this.getInfoDetailWarehousingApi({
        planCode: this.activePlanCode
      })
    },
    getTableData() {
      this.$router.replace({
        path: '/inwarehousing/planIn',
        query: { data: JSON.stringify(this.ruleForm) }
      })
      this.loading = true;
      let data = { ...this.ruleForm }
      getInfoWarehousing(data).then(res => {
        if (res && res.data && res.data.list) {
          var tempList = [...res.data.list]
          this.tableData = uniqueArray([...tempList.map(list => { list.childData = []; return list })], 'planCode')
          this.total = res.data.total
          var a = this.$refs.tableChild.expands//之前打开过 
          if (a && a.length > 0) {
            var info = {
              childData: [],
              planCode: a[0]
            }
            this.currentRadioChange(info)
          }
          this.tableData.map(item => {
            item.printplanReal = (item.inPlanQty ? item.inPlanQty : 0) + '/' + (item.inQty ? item.inQty : 0)
          })
        } else {
          this.tableData = []
        }
        this.loading = false;

      })
    },
    childDataSelect(selectedData) {
      this.multipleSelection = []
      this.childDataArr = []
      this.planPrintData = []
      this.multipleSelection = [...selectedData]
      this.childDataArr = [...selectedData]
      this.planPrintData = [...selectedData]
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
      var createBeginDate = '', createEndDate = '';
      if (ruleForm.durationTime && ruleForm.durationTime[0]) {
        createBeginDate = +ruleForm.durationTime[0]
        createEndDate = +ruleForm.durationTime[1]
      }
      this.ruleForm = { ...ruleForm, pageSize: 10, pageNum: 1, createBeginDate, createEndDate }
      this.getTableData();

    },
    resetForm() {
      ruleForm.busiBillType = ''
      ruleForm.isPrint = ''
      this.ruleForm = { ...ruleForm }
      this.getTableData()
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>