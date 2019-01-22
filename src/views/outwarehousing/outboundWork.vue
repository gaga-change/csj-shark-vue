<template>
    <div>
        <tab-label 
          :tab-config="BusiBillTypeEnum" 
          @tabSwitch="tabSwitch" 
          :tab-default="tabDefault">
        </tab-label>

        <search-warehousing 
          @searchTrigger="submitForm" 
          ref="searchWarhouse" 
          @resetSearch="resetForm" 
          :search-forms="ruleForm">
        </search-warehousing>

        <operation-button 
          :child-data-arr="childDataArr" 
          :planPrintData="planPrintData" 
          :orderType="currentTab" 
          :parent-data-obj="parentDataObj" />

         <div style="margin-bottom:15px" 
           v-show="planPrintData.length>0">
            <span>选中的要打印的计划单</span>
            <el-tag v-for="tag in planPrintData" 
              :key="tag.planCode"
               closable 
               @close="closePlanTags(tag)" 
               style="margin:0 0 10px 10px;">
               {{tag.planCode}}
            </el-tag>
         </div>

        <double-table 
          :loading="loading" 
          :table-data="tableData"
          ref="tableChild" 
          :handle-button-map="handleButtonMap"  
          :highlight-current-row="highlightCurrentRow" 
          :child-data-name="childDataName" 
          :config="parentTableConfig"
          :expands-parent="expandsParent"
          :childTableConfig="childTableConfig" 
          :accordion-expand="accordionExpand" 
          @expandChangePa="expandChange" 
          @currentRadioChange="currentRadioChange" 
          :child-can-select="childCanSelect" 
          :expand-key="expandKey" 
          @childDataSelect="childDataSelect"  
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange" 
          :total="total" 
          :maxTotal="10"
          :pageSize="ruleForm.pageSize"
          :currentPage="ruleForm.pageNum">
        </double-table>
       
    </div>
</template>

<script>
    import DoubleTable from '@/components/Table/doubleTable'
    import { planOrderTableConfig, planOrderChildTableConfig } from './components/config'
    import { getInfoPlanOutWarehousing,getInfoPlanDetailOutWarehousing } from '@/api/warehousing'
    import { uniqueArray } from '@/utils/arrayHandler'
    import  SearchWarehousing  from './components/search'
    import operationButton from './components/operationButton'
    import { BusiBillTypeEnum } from "@/utils/enum"
    const BusiBillTypeEnumFilter = BusiBillTypeEnum.filter(item => item.type.includes('out'))
    const ruleForm = {
      pageNum: 1,
      pageSize:10,
      durationTime:['',''],//时间，
        createBeginDate:'',
        createEndDate:'',
        planCode:'',
        providerName:'',
        execStatus:'',
        ownerName:'',
    }
    
    export default {
        components: { DoubleTable, SearchWarehousing, operationButton },
        data(){
            return {
                loading:false,
                dialogVisible:false,
                dialogData:{},
                highlightCurrentRow: true,
                BusiBillTypeEnum:BusiBillTypeEnumFilter,
                tabDefault:BusiBillTypeEnumFilter[0].value+'',
                currentTab:BusiBillTypeEnumFilter[0].value+'',
                ruleForm,
                selectData:{//x选中的单据
                    
                },
                // searchForms,
                tableData:[
                ],
                // pageNum:0,
                // pageSize:10,
                //子表数据名称
                childDataName:'childData',
                //表格配置
                parentTableConfig:planOrderTableConfig,
                childTableConfig:planOrderChildTableConfig,
                // currentPage:1,
                // pageSize:10,
                total:0,
                //主表操作
                handleButtonMap:[
                    // {title:'详情',handle:(index,data)=>{
                    //     this.dialogVisible = true
                    //     this.dialogData = {...data}
                    // }}
                ],
                childCanSelect:true,//子表可选择,false全选，
                accordionExpand:true,//手风琴展开
                multipleSelection:[],//选中的子表数据
                expandKey:'planCode',
                expandsParent:[],
                //按钮操作所需数据
                parentDataObj:{},
                childDataArr:[],
                //计划单打印的选择数据
                 planPrintData:[],
            }
        },
        methods:{
            expandChange(row, expandedRows){
                var arr = []
                arr.push(row[this.expandKey])
                 if(this.expandsParent == row[this.expandKey]){
                    this.expandsParent = []
                }else{
                    this.expandsParent = [...arr]

                }
                // this.expandsParent = [...arr]
                this.currentRadioChange(row)
            },
            getTableData(){

                this.$router.replace({
                    path:'/outwarehousing/outboundWork',
                    query:{data:JSON.stringify({...this.ruleForm,busiBillType:this.currentTab})}
                })
                this.loading=true;
                let data={...this.ruleForm,busiBillType:this.currentTab}
                getInfoPlanOutWarehousing(data).then(res => {
                    
                    if(res.success && res.data &&res.data.list){
                        var tempList = [...res.data.list]
                        
                        this.tableData = uniqueArray([...tempList.map(list => {list.childData=[];return list})],'planCode')
                        this.total = res.data.total
                        var a = this.$refs.tableChild.expands//之前打开过 
                        if(a&&a.length>0){
                            
                            var info = {
                                childData:[],
                                planCode:a[0]
                            }
                            this.currentRadioChange(info)
                        }
                    }else{
                        this.tableData = []
                    }
                    this.loading = false;

                }).catch(err=>{
                    console.log(err);
                    this.tableData = []
                    this.loading = false;                    
                })
            },
            currentRadioChange(data){
                 if(!data.busiBillNo){
                    return
                }
                var templatePlanTag = [...this.planPrintData,data]
                this.planPrintData = uniqueArray([...templatePlanTag],'planCode')
                var chooseList = data
                
                if(data.childData&&data.childData.length>0){
                    // chooseList = data
                    console.log(data)
                }else{
                    this.loading = true
                    console.log(122);
                    
                     getInfoPlanDetailOutWarehousing({planCode:data.planCode}).then(res=>{
                    console.log(123,res.success , res.data , res.data.outWarehousePlanDetailRespList);
                        
                        if(res.success && res.data && res.data.outWarehousePlanDetailRespList && res.data.outWarehousePlanDetailRespList.length>0){
                     console.log(125);
                            var outWarehousePlanDetailRespList = res.data.outWarehousePlanDetailRespList 
                            outWarehousePlanDetailRespList = outWarehousePlanDetailRespList.map(item => {
                                item.planOutQty = (Number(item.planOutQty)||0).toFixed(0)
                                item.realOutQty = (Number(item.realOutQty)||0).toFixed(0)
                                console.log(item,111111);
                                
                                return item
                            })
                    console.log(124,outWarehousePlanDetailRespList);

                            var tempList = [...this.tableData]
                            this.tableData = tempList.map(list => {
                                if(list.planCode == data.planCode){
                                    list.childData = outWarehousePlanDetailRespList;
                                    chooseList = list
                                }
                                return list
                            })
                        }     
                        this.loading = false
                    }).catch(err => {
                        
                        this.loading = false
                    })
                }
                this.parentDataObj = { ...chooseList }
            },
            childDataSelect(selectedData){

               this.multipleSelection = [...selectedData]
               this.childDataArr = [...selectedData]
            },
            handleSizeChange(val) {
                this.ruleForm={...this.ruleForm,pageSize:val,pageNum:1}
                this.getTableData()
            },

            handleCurrentChange(val) {
                this.ruleForm={...this.ruleForm,pageNum:val}
                this.getTableData()
            },
             submitForm(ruleForm) {
                var   createBeginDate='',createEndDate='';
                if(ruleForm.durationTime&&ruleForm.durationTime[0]){
                    createBeginDate = +ruleForm.durationTime[0]
                    createEndDate = +ruleForm.durationTime[1]
                }
                this.ruleForm={...ruleForm,pageSize:10,pageNum:1,createBeginDate,createEndDate,busiBillType:this.currentTab}
                this.getTableData();
                
            },

            resetForm() {
                this.ruleForm={ ...ruleForm,busiBillType:this.currentTab }
                this.getTableData()
            },
            tabSwitch(tab,event){
                if(tab.name==this.currentTab){
                    console.log('当前标签')
                }else{
                    this.currentTab = tab.name
                    this.$refs.searchWarhouse.resetForm()
                    this.planPrintData = []
                    this.tableData = []
                    this.parentDataObj = {}
                    this.childDataArr = []

                }
            },
             closePlanTags(tag){
                var planPrintData = [...this.planPrintData]
                var b = [...planPrintData.filter(item => {console.log('in',item.planCode!=tag.planCode);
                ;return item.planCode!=tag.planCode})]
                this.planPrintData = [...b]
                console.log(b,'b',tag);
                
            }
        },
        created(){
            this.getTableData()
            // this.demo()
            // this.currentRedioChange()
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>