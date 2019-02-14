<template>
    <div class="pickingtask">
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

        <base-table 
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :loading="loading"
        :config="pickingtaskConfig"  
        :total="total" 
        :maxTotal="10"
        :pageSize="searchForm.pageSize"
        :currentPage="searchForm.pageNum"
        :tableData="tableData"/>


        <el-dialog
        :title="`拣货单详情 ( 拣货单号:${activeRow.orderCode} ) `"
        :visible.sync="dialogVisible"
         width="60%"
        :before-close="handleClose">
            <web-pagination-table 
            :loading="detailLoding"
            @SelectionChange="SelectionChange"
            :config="pickingtaskdetailConfig" 
            :allTableData="pickingtaskdetailTableData"/> 
             <span slot="footer" class="dialog-footer"  v-if="[0,1].includes(activeRow.orderStatus)">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="suerPicking">确认拣货</el-button>
             </span>
        </el-dialog>


      <el-dialog
        title="打印拣货单"
        :visible.sync="printingAlert"
         width="60%"
        :before-close="handleClose">
            <div id="pickingOrder">
              <div style="margin-bottom:12px;">
                 <span>拣货单号:</span> <span>{{activeRow.orderCode}}</span>
              </div>

              <div style="margin-bottom:12px;display:flex">
                   <BarCode :code="activeRow.orderCode" imgStyle="height:100px;width:200px"/>
              </div>

               
              <web-pagination-table 
              :loading="detailLoding"
              :config="printinConfig" 
              :allTableData="pickingtaskdetailTableData"/> 
            </div>
           
             <span slot="footer" class="dialog-footer">
                <el-button @click="printingAlert = false">取 消</el-button>
                <el-button type="primary" @click="planPrintOrder">打印</el-button>
             </span>
        </el-dialog>

    </div>
</template>

<script>
    import _  from 'lodash';
    import moment from 'moment';
    import newSearch from './components/newSearch'
    import BaseTable from '@/components/Table/index'
    import { pickingtaskConfig,pickingtaskdetailConfig,printinConfig } from './components/config'
    import { pickOrderList,pickOrderDetail,orderPickConfirm,orderDelete,orderPickStop } from '@/api/warehousing'
    import webPaginationTable from '@/components/Table/webPaginationTable'
    import { MakePrint } from '@/utils'
    export default {
        components: { newSearch,BaseTable,webPaginationTable },
        data(){
            return {
                searchForm:{
                  outOrderCode:'',
                  orderCode:'',
                  pageSize:10,
                  pageNum:1
                },
                loading:false,
                total:0,
                pickingtaskConfig,
                tableData:[],
                dialogVisible:false,
                pickingtaskdetailConfig,
                pickingtaskdetailTableData:[],
                detailLoding:false,
                activeRow:'',
                SelectionData:[],
                printingAlert:false,
                printinConfig
            }
        },

        created(){

            this.pickingtaskConfig.forEach(element => {
                if(element.useDom){
                  element.dom=(row, column, cellValue, index)=>{   
                  return  <span class="tableBtnBox">
                            {
                              <span  onClick={this.pickingDetail.bind(this,row,false)}>详情</span>
                            } 

                            {
                              <span onClick={this.pickingDetail.bind(this,row,'Printing')}>打印拣货单</span>
                            }  

                            {
                              [0,1].includes(row.orderStatus)&&
                              <span  onClick={this.pickingDetail.bind(this,row,false)}>确认拣货</span>
                            }
                            { 
                              [0,1].includes(row.orderStatus)&&
                              <span  onClick={this.pickingDetail.bind(this,row,'确定要终止操作码?',orderPickStop)}>终止拣货</span>
                            }
                            {
                              [0].includes(row.orderStatus)&&
                              <span  onClick={this.pickingDetail.bind(this,row,'确定要删除吗?',orderDelete)}>删除拣货</span>
                            }

                          </span>
                  }
                }
            }); 
        },

        mounted(){
           this.getCurrentTableData();
        },

        methods:{

            moment,
            MakePrint,
            planPrintOrder(){
              let printPlanContainer = document.getElementById('pickingOrder').innerHTML
              MakePrint(printPlanContainer)
            },

            handleSizeChange(val) {
              this.searchForm={...this.searchForm,pageSize:val,pageNum:1}
              this.getCurrentTableData()
            },

            handleCurrentChange(val) {
              this.searchForm={...this.searchForm,pageNum:val}
              this.getCurrentTableData()
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

             pickOrderDetailaPI(id){
                this.detailLoding=true;
                pickOrderDetail(id).then(res=>{
                    this.detailLoding=false;
                    if(res.success){
                      this.pickingtaskdetailTableData=res.data||[];
                    }
                }).catch(err=>{
                    this.detailLoding=false;
                })
             },


            pickingDetail(row,tips,Api){
                if(!tips){
                  this.SelectionData=[];
                  this.dialogVisible=true;
                  this.activeRow=row;
                  this.pickOrderDetailaPI(row.id) ;
                } else if(tips==='Printing'){
                  this.printingAlert=true;
                  this.activeRow=row;
                  this.pickOrderDetailaPI(row.id) ;
                } else {
                   this.$confirm(tips, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                   }).then(() => {
                     Api(row.id).then(res=>{
                         if(res.success){
                           this.$message({type: 'success',message: '操作成功!'});
                           this.getCurrentTableData();
                         }else{
                           this.$message({type: 'info',message: '操作失败'});    
                         }
                     }).catch(err=>{
                        console.log(err)
                        this.$message({type: 'info',message: '操作失败'});  
                     })
                     
                   }).catch(() => {
                      this.$message({type: 'info',message: '操作失败'});    
                   });
                } 
                
             },

            SelectionChange(val){
               this.SelectionData=val
            },

            suerPicking(){
              if(this.SelectionData.length===0){
                  this.$message({type:'info',message:'请先选择商品'});
                  return;
              }
              let json={};
              json.pickConfirmItemReqList=this.SelectionData
              json.planCode=this.SelectionData[0].planCode;
              json.pickOrderId=this.activeRow.id;
              orderPickConfirm(json).then(res=>{
                  if(res.success){
                    this.$message({type:'success',message:'操作成功，可以去出库暂存页面查看'});  
                    this.dialogVisible=false;
                  } else{
                    this.$message({type:'err',message:'操作失败'});  
                  }
              }).catch(err=>{
                  console.log(err)
                  this.$message({type:'err',message:'操作失败'});
              })
              
            },

             handleClose(){
               this.dialogVisible=false;
               this.printingAlert=false;
             },

             getCurrentTableData(){
               this.SelectionData=[];
               let json={};
               for(let i in this.searchForm){
                   if(this.searchForm[i]!==''){
                       json[i]=this.searchForm[i];
                   }
               }

               pickOrderList(json).then(res=>{
                   if(res.success){
                     this.total=res.data&&res.data.total;
                     this.tableData=res.data&&res.data.list||[]
                   }
               }).catch(err=>{
                   console.log(err)
               })
             }
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" >
   .pickingtask{
     .tableBtnBox{
       font-size: 12px;
       span{
         margin-right: 12px;
         color: #3399ea;
         cursor: pointer;
         &:last-child{
             margin-right: 0; 
         }
       }
     }
   }

   .el-dialog__body{
       padding-top: 0;
   }

</style>