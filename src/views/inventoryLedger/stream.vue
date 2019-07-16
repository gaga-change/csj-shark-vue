<template>
    <div>
        
        <search-inventory 
          @searchTrigger="submitForm" 
          ref="searchWarhouse" 
          :search-forms="ruleForm" 
          :pageName="'stream'">
        </search-inventory>

       <base-table 
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :loading="loading"
        :config="streamTableConfig"  
        :total="total" 
        :maxTotal="10"
        :pageSize="ruleForm.pageSize"
        :currentPage="ruleForm.pageNum"
        :tableData="tableData"/>

    </div>
</template>

<script>
    import BaseTable from '@/components/Table'
    import { streamTableConfig } from './components/config'
    import { querySkuStockRecord } from '@/api/inventory'
    import { uniqueArray } from '@/utils/arrayHandler'
    import  SearchInventory  from './components/search'

    export default {
        components: { BaseTable, SearchInventory },
        data(){
            return {
                loading:false,
                ruleForm:{
                    pageNum: 1,
                    pageSize:10,
                    skuCode:'',
                    skuName:'',
                    ownerName:'',
                    warehouseSpaceCode:'',
                    durationTime: [],
                },
                tableData:[],
                streamTableConfig,
                total:0,
            }
        },
        methods:{
            getTableData(){
                this.$router.replace({
                    path:'/inventoryLedger/stream',
                    query:{data:JSON.stringify(this.ruleForm)}
                })
                this.loading=true;
                let data={...this.ruleForm}
                querySkuStockRecord(data).then(res => {
                    if(res.success && res.data &&res.data.list){
                        var tempList = [...res.data.list]
                        this.tableData = tempList.map(list => {list.childData=[];return list})
                        this.total = res.data.total
                    }
                    this.loading = false;
                }).catch(err=>{
                    this.loading = false;                    
                })
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
                 var   createBeginDate='',createEndDate='';//unforim
                if(ruleForm.durationTime&&ruleForm.durationTime[0]){
                    createBeginDate = +ruleForm.durationTime[0]
                    createEndDate = +ruleForm.durationTime[1]
                }
                this.ruleForm={...ruleForm,pageSize:10,pageNum:1,createBeginDate,createEndDate}
                this.getTableData();
                
            },
        },
        created(){
            this.getTableData()
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>