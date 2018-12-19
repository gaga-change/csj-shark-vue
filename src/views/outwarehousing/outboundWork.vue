<template>
    <div>
        <tab-label :tab-config="BusiBillTypeEnum" @tabSwitch="tabSwitch" :tab-default="tabDefault"></tab-label>
        <search-warehousing @searchTrigger="submitForm" ref="searchWarhouse" @resetSearch="resetForm" :search-forms="ruleForm"></search-warehousing>
        <double-table 
        :loading="loading" 
        :table-data="tableData" :handle-button-map="handleButtonMap"  :highlight-current-row="highlightCurrentRow" :child-data-name="childDataName" :config="tableConfig" :childTableConfig="childTableConfig" :accordion-expand="accordionExpand" @currentRadioChange="currentRadioChange" :child-can-select="childCanSelect" :expand-key="expandKey" @childDataSelect="childDataSelect"  @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange" 
        :total="total" 
        :maxTotal="10"
        :pageSize="ruleForm.pageSize"
        :currentPage="ruleForm.pageNum"></double-table>
    </div>
</template>

<script>
    import DoubleTable from '@/components/Table/doubleTable'
    import { orderTableConfig, orderChildTableConfig } from './components/config'
    import { getInfoOutWarehousing,getInfoDetailOutWarehousing } from '@/api/warehousing'
    import { uniqueArray } from '@/utils/arrayHandler'
    import  SearchWarehousing  from './components/search'
    import { BusiBillTypeEnum } from "@/utils/enum"
    console.log(SearchWarehousing)
    const ruleForm = {
      pageNum: 1,
      pageSize:10,
      durationTime:['',''],//时间，
        createBeginDate:'',
        createEndDate:'',
        busiBillNo:'',
        providerName:'',
        execStatus:'',
        ownerName:'',
    }
    // const searchForms = {
    //     durationTime:['',''],//时间，
    //     createBeginDate:'',
    //     createEndDate:'',
    //     busiBillNo:'',
    //     providerName:'',
    //     execStatus:'',
    //     ownerName:'',
    // }
    export default {
        components: { DoubleTable, SearchWarehousing },
        data(){
            return {
                loading:false,
                dialogVisible:false,
                dialogData:{},
                highlightCurrentRow: true,
                BusiBillTypeEnum,
                tabDefault:BusiBillTypeEnum[0].value+'',
                currentTab:BusiBillTypeEnum[0].value+'',
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
                tableConfig:orderTableConfig,
                childTableConfig:orderChildTableConfig,
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
                childCanSelect:false,//子表可选择,false全选，
                accordionExpand:true,//手风琴展开
                multipleSelection:[],//选中的子表数据
                expandKey:'planCode'
            }
        },
        methods:{
            getTableData(){

                this.$router.replace({
                    path:'/outwarehousing/outboundOrder',
                    query:{data:JSON.stringify(this.ruleForm)}
                })
                this.loading=true;
                let data={...this.ruleForm}
                getInfoOutWarehousing(data).then(res => {
                    
                    if(res.success && res.data &&res.data.list){
                        var tempList = [...res.data.list]
                        
                        this.tableData = uniqueArray([...tempList.map(list => {list.childData=[];return list})],'orderCode')
                        this.total = res.data.total
                    }
                    this.loading = false;

                }).catch(err=>{
                    console.log(err);
                    this.loading = false;                    
                })
            },
            currentRadioChange(data){
                var chooseList = data
                if(data.childData&&data.childData.length>0){
                    // chooseList = data
                    console.log(data)
                }else{
                    this.loading = true
                    getInfoDetailOutWarehousing({planCode:data.planCode}).then(res=>{
                        if(res.success && res.data && res.data.queryOutWarehouseOrderDetailVOSList && res.data.queryOutWarehouseOrderDetailVOSList.length>0){
                            var tempList = [...this.tableData]
                            this.tableData = tempList.map(list => {
                                if(list.orderCode == data.orderCode){
                                    list.childData = res.data.queryOutWarehouseOrderDetailVOSList;
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
               
                console.log(chooseList,'pa');  
            },
            childDataSelect(selectedData){

               this.multipleSelection = [...selectedData]
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
                this.ruleForm={...ruleForm,pageSize:10,pageNum:1,createBeginDate,createEndDate}
                this.getTableData();
                
            },

            resetForm() {
                this.ruleForm={ ...ruleForm }
                this.getTableData()
            },
            tabSwitch(tab,event){
                if(tab.name==this.currentTab){
                    console.log('当前标签')
                }else{
                    this.currentTab = tab.name
                    this.$refs.searchWarhouse.resetForm()
                    this.ruleForm = {...ruleForm,busiBillType:tab.name}
                    this.getTableData()

                }
            },
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