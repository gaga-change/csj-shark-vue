<template>
    <div class="record">
        <el-card class="simpleCard"  shadow="never"   body-style="padding:12px">
            <new-search  
             @submit="submit"
             :searchForm="searchForm"  
             ref="arrivalDom" >
            </new-search>
            <el-col :span="24" style="margin-bottom:12px;">
                <el-button type="primary"  size="small"  @click="select">查询</el-button>
                <el-button type="primary"  size="small" @click="resetForm">重置</el-button>
            </el-col>
        </el-card>

        <div style="margin-bottom:12px">
           <el-button 
            :disabled="!Array.isArray(inOriderSelectData)||inOriderSelectData.length<=0"
            @click="orderAdd"
            type="primary" 
            size="small">
            生成入库单
           </el-button>
        </div> 
        
        <edit-table 
        :loading="false"
        :config="recordListConfig" 
        :useEdit="true"
        :defaultEdit="false"
        :childCanSelect="true"
        editText="修改上架数量"
        @editDataSelect="editDataSelect"
        @dataChange="dataChange"
        :tableData="recordListTableData"/> 
              
    </div>
</template>

<script>
    import newSearch from './components/newSearch'
    import editTable from '@/components/Table/editTable'
    import webPaginationTable from '@/components/Table/webPaginationTable'
    import _  from 'lodash';
    import moment from 'moment';
    import { recordListConfig } from './components/config'
    import { jobList,inOrderAdd } from '@/api/warehousing'
    export default {
        components: { newSearch,webPaginationTable,editTable },
        data(){
            return {
                searchForm:{
                  receiveOrderCode:'',
                  planCode:'',
                  skuName:'',
                  isCreateOrder:0
                },
                recordListConfig,
                recordListTableData:[],
                inOriderSelectData:[]
                
            }
        },

        mounted(){
           this.getCurrentTableData()
        },

        methods:{

            moment,
            dataChange(index,type,changeData){
              console.log({...changeData})
            },

            editDataSelect(val){
              console.log([...val.arr])
              this.inOriderSelectData=val.arr;
            },

            orderAdd(){
              let inWarehouseJobList=[];
              let receiveOrderCodeList=[];
              _.cloneDeep(this.inOriderSelectData).forEach(item => {
                 inWarehouseJobList.push(item.id);
                 receiveOrderCodeList.push(item.receiveOrderCode);
              });
              this.$confirm(`本次要生成的入库单为 ${receiveOrderCodeList.join(' , ')},确定要生成吗?`, '生成入库单', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
              }).then(() => {
                  inOrderAdd({
                    inWarehouseJobList
                  }).then(res=>{
                    if(res.success){
                      this.getCurrentTableData()
                      this.$message({type:'success',message:'操作成功！'})
                    } else{
                      this.$message({type:'error',message:'操作失败！'})   
                    }
                  }).catch(err=>{
                      this.$message({type:'error',message:'操作失败！'})  
                      console.log(err)
                  })
              }).catch(err=>{
                  console.log(err)
              })
            },
            
            submit(value){
              this.searchForm=value;
              this.getCurrentTableData()
            },

             select(){
               this.$refs['arrivalDom'].submit()
             },

             resetForm(){
               this.$refs['arrivalDom'].resetForm() 
             },

             getCurrentTableData(){
               let json={};
               for(let i in this.searchForm){
                   if(this.searchForm[i]!==''){
                       json[i]=this.searchForm[i];
                   }
               }
               jobList(json).then(res=>{
                   if(res.success){
                     this.recordListTableData=res.data||[]
                   }
               }).catch(err=>{
                console.log(err)
               })
             }
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" >
   .record{

   }

</style>