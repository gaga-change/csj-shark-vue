<template>
    <div>
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
           <el-button type="primary" size="small" @click="submitOrider" >上架</el-button>
           <el-button type="danger" 
            size="small"  
            :disabled="!activeOrder.orderCode" 
            @click="deleteOrider"  >
            <span v-if="activeOrder.orderCode">
                删除单据 : <span style="font-weight: 600;">{{activeOrder.orderCode}}</span>
            </span>
            <span v-else>
                删除
            </span>
            </el-button>
        </div>
    
        <el-dialog
          title="到货登记"
          :visible.sync="dialogVisible"
          width="70%">
          <div class="alertInfo">
            <span>入库计划单 : {{activeOrder.planCode}}</span>    
            <span>供应商 : {{activeOrder.providerName}}</span>    
            <span>到货时间 : {{ moment(activeOrder.gmtCreate).format('YYYY-MM-DD') }}</span>    
          </div>
          <web-pagination-table 
           :loading="false"
           :config="arrivalAlertConfig" 
           :allTableData="nowChildDataSelectData"/> 
        </el-dialog>

        <double-table 
          ref="tableChild" 
          :loading="loading" 
          :config="arrivalTableConfig"
          :table-data="tableData"
          child-data-name="childData" 
          :childTableConfig="arrivalChildTableConfig"  
          :highlight-current-row="true" 
          :child-can-select="true"
          :highlightCurrentRow="true"
          expand-key="id" 
          :can-edit="true"
          :total="total" 
          :pageSize="pageSize"
          :currentPage="pageNum"
          editText="修改到货数量"
          :expands-parent="expandsParent"
          @expandChangePa="expandChange"
          @childDataSelect="childDataSelect"  
          @sizeChange="handleSizeChange"
          @currentRadioChange="currentRadioChange"
          @currentChange="handleCurrentChange" 
          @dataChange="dataChange">
        </double-table>
    </div>
</template>

<script>
    import DoubleTable from '@/components/Table/doubleTable'
    import newSearch from './components/newSearch'
    import webPaginationTable from '@/components/Table/webPaginationTable'
    import _  from 'lodash';
    import moment from 'moment';
    import { arrivalTableConfig, arrivalChildTableConfig,arrivalAlertConfig } from './components/config'
    import { orderList,orderDetailList,orderUpdateReceiveQty,receiveOrderDelete } from '@/api/warehousing'
    export default {
        components: { DoubleTable,newSearch,webPaginationTable },
        data(){
            return {
                loading:false,
                arrivalTableConfig,
                tableData:[],
                arrivalChildTableConfig,
                total:0,
                pageSize:10,
                pageNum:1,
                searchForm:{
                  orderType:'',
                  providerName:'',
                  planCode:'',
                  ownerName:'',
                },
                activeOrder:{},
                expandsParent:[],
                arrivalAlertConfig,
                nowChildDataSelectData:[],
                dialogVisible:false
            }
        },

         created(){
            this.arrivalAlertConfig.forEach(item=>{
                if(item.useLink){
                    item.dom=(row, column, cellValue, index)=>{
                    return <span>输入上架量</span> 
                    }
                }
              }) 
         },

        methods:{
            moment,
            submitOrider(){
              this.dialogVisible=true;
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

             handleSizeChange(val){
               this.pageSize=val;
               this.pageNum=1;
               this.getCurrentTableData()
             },

             handleCurrentChange(val){
               this.pageNum=val;
               this.getCurrentTableData()
             },

             currentRadioChange(currentRow){
               this.activeOrder=currentRow;
             },

             deleteOrider(){
                let json=this.activeOrder;
                this.$confirm(`  确定要删除到货单号为 ${json.orderCode} 计划单号为 ${json.planCode} 的单据吗？`, '提示', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消'
                }).then(()=>{
                    receiveOrderDelete(json.id).then(res=>{
                      if(res.success){
                          this.$message({type:'success',message:'操作成功！'});
                          this.activeOrder={};
                          this.getCurrentTableData()
                      } else{
                          this.$message({type:'error',message:'操作失败'})
                      }
                    }).catch(err=>{
                      console.log(err)
                      this.$message({type:'error',message:'操作失败'})
                    }) 
               }).catch(err=>{
                  console.log(err)
               })
             },

             dataChange(index,type,changeData){
               orderUpdateReceiveQty({
                 receiveDetailId:changeData.id,
                 receiveQty:changeData.receiveQty
               }).then(res=>{
                  if(res.success){
                    this.$message({type:'success',message:'操作成功！'});
                    this.expandChange({ id:changeData.rowId },{},false)
                  } else{
                    this.$message({type:'error',message:'操作失败'})
                  }
               }).catch(err=>{
                   console.log(err)
                   this.$message({type:'error',message:'操作失败'})
               })
             },

             expandChange(json,expandedRows,reserver=true){
               
                this.activeOrder=json;
                if(reserver&&this.expandsParent.includes(json['id'])){
                    this.expandsParent = []
                }else{
                    this.expandsParent = [json['id']]
                }
                
               let tableData= _.cloneDeep(this.tableData);
               let index=tableData.findIndex(v=>v.id===json.id);
               if(reserver&&tableData[index]['childData']&&Array.isArray(tableData[index]['childData'])){
                  return  
               }

               orderDetailList(json.id).then(res=>{
                   if(res.success){
                      tableData[index]['childData']=res.data.map(item=>{
                          let itemJson=item;
                          itemJson.rowId=json.id;
                          return itemJson;
                      });
                      this.tableData=tableData;
                   }
               }).catch(err=>{
                   console.log(err)
               })
             },

             childDataSelect(val){
                this.nowChildDataSelectData=_.cloneDeep(val.arr).map(v=>{
                  let json=v;
                  json['warehousingArr']=[
                      {putQty:1,warehouseSpaceCode:'1-2-3'},
                      {putQty:1,warehouseSpaceCode:'1-2-3'},
                      {putQty:1,warehouseSpaceCode:'1-2-3'},
                  ];
                  return json;
                });
             },

             getCurrentTableData(){
                 this.loading=true;
                 orderList({
                   ...this.searchForm,
                   pageNum:this.pageNum,
                   pageSize:this.pageSize
                }).then(res=>{
                    this.loading=false;
                    if(res.success){
                       this.tableData=res.data&&res.data.list||[];
                       this.total=res.data&&res.data.tatal;
                    }
                }).catch(err=>{
                    this.loading=false;
                    console.log(err)
                })
             }
        },

        mounted(){
           this.getCurrentTableData()   
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
     .alertInfo{
        margin-bottom: 12px;
        >span{
          font-size: 14px;
          padding-right:20px;
        }   
    }
 
</style>