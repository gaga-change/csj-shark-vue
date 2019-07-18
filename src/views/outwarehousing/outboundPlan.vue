<template>
  <div>
    <!--  <tab-label 
          :tab-config="BusiBillTypeEnum" 
          @tabSwitch="tabSwitch" 
          :tab-default="tabDefault">
        </tab-label> -->

    <search-warehousing
      @searchTrigger="submitForm"
      ref="searchWarhouse"
      @resetSearch="resetForm"
      :search-forms="ruleForm"
    >
    </search-warehousing>

    <operation-button
      :child-data-arr="childDataArr"
      :planPrintData="planPrintData"
      :selectChiledByPlanCode="selectChiledByPlanCode"
      :orderType="currentTab"
    />

    <!-- <div style="margin-bottom:15px" 
           v-show="planPrintData.length>0">
            <span style="font-size:13px">当前选中的计划单</span>
            <el-tag v-for="tag in planPrintData" 
              :key="tag.planCode"
               closable 
               @close="closePlanTags(tag)" 
               style="margin:0 0 10px 10px;">
               {{tag.planCode}}
            </el-tag>
         </div> -->

    <double-table
      :loading="loading"
      :table-data="tableData"
      ref="tableChild"
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

    <!-- <double-table 
          :loading="loading" 
          :table-data="tableData"
          ref="tableChild" 
          :highlight-current-row="highlightCurrentRow" 
          child-data-name="outWarehousePlanDetailRespList" 
          :config="parentTableConfig"
          :expands-parent="expandsParent"
          :childTableConfig="childTableConfig" 
          :accordion-expand="true"        
          :child-can-select="true" 
          expand-key="planCode" 
          @childDataSelect="childDataSelect"  
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange" 
          @currentRadioChange="currentRadioChange" 
          :total="total" 
          :maxTotal="10"
          :pageSize="ruleForm.pageSize"
          :currentPage="ruleForm.pageNum">
        </double-table> -->

  </div>
</template>

<script>
import DoubleTable from '@/components/Table/printTable'
import { planTableConfig, planOrderChildTableConfig } from './components/config'
import { getInfoPlanOutWarehousing, getInfoPlanDetailOutWarehousing } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
import SearchWarehousing from './components/printsearch'
import operationButton from './components/printOperation'
import { BusiBillTypeEnum } from "@/utils/enum"
const BusiBillTypeEnumFilter = BusiBillTypeEnum.filter(item => item.type.includes('out'))

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
      ruleForm: {
        pageNum: 1,
        pageSize: 10,
        planCode: '',
        busiBillType: 21,
        isPrint: 0,
      },
      selectData: {},
      tableData: [],
      parentTableConfig: planTableConfig,
      childTableConfig: planOrderChildTableConfig,
      total: 0,
      multipleSelection: [],
      expandsParent: [],
      childDataArr: [],
      planPrintData: [],
      activeOwnerCode: '',
      selectChiledByPlanCode: {},
    }
  },


  methods: {

    currentRadioChange(row) {
      this.planPrintData.push(row)

    },

    getTableData() {
      this.$router.replace({
        path: '/outwarehousing/outboundPlan',
        query: { data: JSON.stringify({ ...this.ruleForm }) }
      })
      this.loading = true;
      let data = { ...this.ruleForm }

      getInfoPlanOutWarehousing(data).then(res => {
        if (res && res.data && res.data.list) {
          var tempList = [...res.data.list].map(v => {
            v.outWarehousePlanDetailRespList = v.outWarehousePlanDetailRespList.map(item => {
              item.planCode = v.planCode;
              item.ownerCode = v.ownerCode;
              return item
            })
            return v;
          })
          this.tableData = uniqueArray([...tempList], 'planCode')
          this.tableData.map(item => {
            item.printplanReal = item.outPlanQty + '/' + item.outQty
          })
          this.total = res.data.total
          var a = this.$refs.tableChild.expands//之前打开过 
        }
        this.loading = false;
      })
    },


    childDataSelect(selectedData) {
      this.multipleSelection = []
      this.childDataArr = []
      this.planPrintData = []
      if (selectedData.length) {
        this.selectChiledByPlanCode[selectedData[0].planCode] = selectedData
        this.multipleSelection = [...selectedData]
        this.childDataArr = [...selectedData].map(v => {
          return {
            ...v,
            ownerCode: this.activeOwnerCode          }
        })
        this.planPrintData = [...selectedData]
      } else {
        this.multipleSelection = []
        this.childDataArr = []
        this.planPrintData = []
        this.selectChiledByPlanCode = {}
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
      this.ruleForm = { ...ruleForm, pageSize: 10, pageNum: 1 }
      this.getTableData();

    },

    resetForm() {
      for (let i in this.ruleForm) {
        if (Array.isArray(this.ruleForm[i])) {
          this.ruleForm[i] = []
        } else if (i === 'execStatus') {
          this.ruleForm[i] = 0
        } else {
          this.ruleForm[i] = ''
        }
      }
      this.ruleForm = { ...this.ruleForm, pageNum: 1, pageSize: 10 }
      this.getTableData()
    },

    closePlanTags(tag) {
      var planPrintData = [...this.planPrintData]
      var b = [...planPrintData.filter(item => {
        return item.planCode != tag.planCode
      })]
      this.planPrintData = [...b]
    }
  },

  created() {
    this.getTableData()
  }
}
</script>

