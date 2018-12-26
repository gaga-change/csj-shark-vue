<template>
    <div>
        <search-inventory @searchTrigger="submitForm" ref="searchWarhouse" @resetSearch="resetForm" :search-forms="ruleForm"></search-inventory>
        <el-button @click="getExport" style="margin-bottom:15px" type="primary" size="small">导出</el-button>
       <base-table 
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :loading="loading"
        :config="inventoryTableConfig"  
        :total="total" 
        :maxTotal="10"
        :pageSize="ruleForm.pageSize"
        :currentPage="ruleForm.pageNum"
        :tableData="tableData"/>
    </div>
</template>

<script>
    import BaseTable from '@/components/Table'
    import { inventoryTableConfig } from './components/config'
    import { getInfoInventory,exportLedger } from '@/api/inventory'
    import { uniqueArray } from '@/utils/arrayHandler'
    import { exportExcelBlob } from '@/utils/exportexcel'
    import  SearchInventory  from './components/search'
    const ruleForm = {
        pageNum: 1,
        pageSize:10,
        warehouseName:'',//仓库名称
        skuCode:'',//商品编码
        skuName:'',//商品名称
        ownerName:'',//货主名称
    }

    export default {
        components: { BaseTable, SearchInventory },
        data(){
            return {
                loading:false,
                
                ruleForm,
              
                // searchForms,
                tableData:[
                ],
               
                //表格配置
               inventoryTableConfig,
               
                total:0,
             
            }
        },
        methods:{
            getTableData(){

                this.$router.replace({
                    path:'/inventoryLedger/inventory',
                    query:{data:JSON.stringify(this.ruleForm)}
                })
                this.loading=true;
                let data={...this.ruleForm}
                getInfoInventory(data).then(res => {
                    
                    if(res.success && res.data &&res.data.list){
                        var tempList = [...res.data.list]
                        
                        this.tableData = uniqueArray([...tempList.map(list => {list.childData=[];return list})],'id')
                        this.total = res.data.total
                    }
                    this.loading = false;

                }).catch(err=>{
                    console.log(err);
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
                
                this.ruleForm={...ruleForm,pageSize:10,pageNum:1}
                this.getTableData();
                
            },

            resetForm() {
                this.ruleForm={ ...ruleForm }
                this.getTableData()
            },

            getExport(){
                this.$prompt('请输入文件名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    exportLedger({...this.ruleForm}).then(res=>{
                        var name = value ? value : '库存台账'
                        exportExcelBlob(name,res)
                    }).catch(err=>{
                        console.log(err,11111)
                    })
                }).catch(err=>{
                     this.$message({
                        type: 'info',
                        message: '已取消导出!'
                    })
                })
                
            }
        },
        created(){
            this.getTableData()
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">


</style>