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
      :expands-parent="expandsParent"
      :highlight-current-row="highlightCurrentRow"
      :child-data-name="childDataName"
      :config="parentTableConfig"
      :childTableConfig="childTableConfig"
      :accordion-expand="accordionExpand"
      @currentRadioChange="currentRadioChange"
      @expandChangePa="expandChange"
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
import { planTableConfig, planChildTableConfig } from './components/config'
import { getInfoWarehousing, getInfoDetailWarehousing } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
import SearchWarehousing from './components/search'
import operationButton from './components/recordOperation'
import { BusiBillTypeEnum } from "@/utils/enum"
const BusiBillTypeEnumFilter = BusiBillTypeEnum.filter(item => item.type.includes('in'))
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
  receiveStatus: 9,
  receiveStates: '',
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
      BusiBillTypeEnum: BusiBillTypeEnumFilter,
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
      parentTableConfig: planTableConfig,
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
      childCanSelect: true,//子表可选择,false全选，
      accordionExpand: true,//手风琴展开
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

    lodash() {
      this.getInfoDetailWarehousingApi({
        planCode: this.activePlanCode
      })
    },

    getTableData() {
      this.$router.replace({
        path: '/inwarehousing/inrecord',
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
        } else {
          this.tableData = []
        }
        this.loading = false;

      })
    },

    currentRadioChange(data) {
      var templatePlanTag = [...this.planPrintData, data]
      this.planPrintData = uniqueArray([...templatePlanTag], 'planCode')
      if (!data.childData || data.childData.length <= 0) {
        this.activePlanCode = data.planCode;
        this.getInfoDetailWarehousingApi({
          planCode: data.planCode
        })
      }
      this.parentDataObj = { ...data }
    },

    getInfoDetailWarehousingApi(data) {
      this.loading = true
      getInfoDetailWarehousing(data).then(res => {
        if (res && res.data && res.data.inWarehousePlanDetailRespList && res.data.inWarehousePlanDetailRespList.length > 0) {
          var tempList = [...this.tableData]
          this.tableData = tempList.map(list => {
            if (list.planCode == data.planCode) {
              list.childData = res.data.inWarehousePlanDetailRespList.map(v => {
                v.hasReceiveQty = v.receiveQty || 0;
                v.receiveQty = v.planInQty - v.receiveQty || 0
                v.editable = true
                v.printNum = 0
                return v
              });
            }
            return list
          })
        }
        this.loading = false
      })
    },


    childDataSelect(selectedData) {
      this.multipleSelection = [...selectedData]
      this.childDataArr = [...selectedData]
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
      this.ruleForm.receiveStatus = ruleForm.receiveStates
      this.getTableData();

    },

    resetForm() {
      ruleForm.busiBillType = ''
      ruleForm.receiveStatus = ''
      this.ruleForm = { ...ruleForm }
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