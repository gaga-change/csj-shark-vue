<template>
    <div>
        <tab-label :tab-config="BusiBillTypeEnum" @tabSwitch="tabSwitch" :tab-default="tabDefault"></tab-label>
       
        <search-warehousing @searchTrigger="submitForm" ref="searchWarhouse" :inbound="inbound" @resetSearch="resetForm" :search-forms="ruleForm"></search-warehousing>
         <el-button type="primary" size="small" @click="quickSubmit" :disabled="buttonDisable" v-loading="buttonDisable" style="margin-bottom:15px">确认入库</el-button>
        <double-table :loading="loading" :table-data="tableData" 
        ref="tableChild" :handle-button-map="handleButtonMap"  :highlight-current-row="highlightCurrentRow" :child-data-name="childDataName" :config="parentTableConfig"
        :childTableConfig="childTableConfig" :accordion-expand="accordionExpand" 
        :expands-parent="expandsParent"
        @expandChangePa="expandChange" @currentRadioChange="currentRadioChange" :child-can-select="childCanSelect" :expand-key="expandKey" @childDataSelect="childDataSelect"  @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange" 
        :total="total" 
        :maxTotal="10"
        :pageSize="ruleForm.pageSize"
        :currentPage="ruleForm.pageNum"></double-table>
    </div>
</template>

<script>
    import DoubleTable from '@/components/Table/doubleTable'
    import { inTableConfig, inChildTableConfig } from './components/config'
    import { getInfoInWarehousing,getInfoDetailInWarehousing, inboundOrderSubmitQuick } from '@/api/warehousing'
    import { uniqueArray } from '@/utils/arrayHandler'
    import  SearchWarehousing  from './components/search'
    import { BusiBillTypeEnum } from "@/utils/enum"
    const BusiBillTypeEnumFilter = BusiBillTypeEnum.filter(item => item.type.includes('in'))
    const ruleForm = {
      pageNum: 1,
      pageSize:10,
      durationTime:['',''],//时间，
        startTime:'',
        endTime:'',
        planCode:'',
        orderCode:'',
        providerName:'',
        execStatus:'',
        ownerName:'',
        orderStatus:''
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
                parentTableConfig:inTableConfig,
                childTableConfig:inChildTableConfig,
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
                expandKey:'id',
                expandsParent:[],
                quickSubmitData:{},
                buttonDisable:false,
                inbound:true,
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
                    path:'/inwarehousing/inboundOrder',
                    query:{data:JSON.stringify({...this.ruleForm,busiBillType:this.currentTab})}
                })
                this.loading=true;
                let data={...this.ruleForm,busiBillType:this.currentTab}
                getInfoInWarehousing(data).then(res => {
                    
                    if(res.success && res.data &&res.data.list){
                        var tempList = [...res.data.list]
                        // [...list.items]
                        this.tableData = uniqueArray([...tempList.map(list => {list.childData=[];return list})],'id')
                        this.total = res.data.total
                        var a = this.$refs.tableChild.expands//之前打开过 
                        if(a&&a.length>0){
                            
                            var info = {
                                childData:[],
                                id:a[0]
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
            quickSubmit(){
                if(!this.quickSubmitData.id){
                    this.$message({type:'info',message:'请选择单据'})
                    return false
                }
                if(this.quickSubmitData.orderStatus==2){
                     this.$message({type:'info',message:'请选择待上架单据'})
                    return false
                }
                this.buttonDisable = true
                inboundOrderSubmitQuick({id:this.quickSubmitData.id}).then(res=>{
                    if(res.success){
                        this.$message({type:'success',message:'入库成功'})
                        this.getTableData()
                    }else{
                        this.$message({type:'error',message:'入库失败'})
                    }
                    this.buttonDisable = false
                }).catch(err=>{
                     this.$message({type:'error',message:'入库失败'})
                    this.buttonDisable=false
                })
            },
            currentRadioChange(data){
                
                var chooseList = data
                this.quickSubmitData = data
                if(data.childData&&data.childData.length>0){
                    // chooseList = data
                    console.log(data)
                }else{
                    this.loading = true
                    getInfoDetailInWarehousing({id:data.id}).then(res=>{
                        if(res.success && res.data &&  res.data.length>0){
                            var tempList = [...this.tableData]
                            this.tableData = tempList.map(list => {
                                if(list.planCode == data.planCode){
                                    list.childData = res.data;
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
                
                var startTime='',endTime='';
                if(ruleForm.durationTime&&ruleForm.durationTime[0]){
                    startTime = +ruleForm.durationTime[0]
                    endTime = +ruleForm.durationTime[1]
                }
                this.ruleForm={...ruleForm,pageSize:10,pageNum:1,startTime,endTime,busiBillType:this.currentTab}
                
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
                   
                    // console.log('q1');
                    
                    // this.getTableData()

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