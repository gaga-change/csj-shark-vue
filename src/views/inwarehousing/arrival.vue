<template>
    <div class="arrival">
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
            type="primary"
            size="small"
            :disabled="!Array.isArray(nowChildDataSelectData)||nowChildDataSelectData.length<=0"
            @click="submitOrider" >上架</el-button>
           <el-button type="danger"
            size="small"
            :disabled="!activeOrder.orderCode"
            @click="deleteOrider"  >
            <span v-if="activeOrder.orderCode">
                删除单据 : <span style="font-weight: 600;">{{activeOrder.orderCode}}</span>
                <i class="el-icon-close" style="pointer:cursor" @click.stop="clearRow"></i>
            </span>
            <span v-else>
                删除
            </span>
            </el-button>
        </div>

        <el-dialog
          style="z-index:900"
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

           <div class="alertBottomArr">
              <el-button type="primary"  size="small" @click="putawayConfirm"  >上架确认</el-button>
              <el-button type="primary"  size="small"  @click="cancelArrivalAlert" >取消</el-button>
           </div>
        </el-dialog>

         <div class="arrivalAlertChider" v-if="arrivalAlertDisplay">
            <div class="arrivalAlertChiderBody">
                <el-form :model="addSearchForm"   label-width="70px" label-position="left">
                        <el-form-item label-width="40px" label="库位" class="postInfo-container-item" >
                            <el-select v-model="addSearchForm.warehouseSpaceCode"
                            filterable clearable placeholder="请选择库位"
                            size="small" prefix-icon="el-icon-search">
                                <el-option
                                v-for="item in warehouseSpaceCodeConfig"
                                :key="item.warehouseSpaceCode"
                                :label="item.warehouseSpaceCode"
                                :value="item.warehouseSpaceCode">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item  label-width="40px"  label="数量" >
                            <el-input-number type="text"
                            size="small"
                            style="width:200px"
                            :min="0"
                            v-model="addSearchForm.putQty"
                            placeholder="请输入上架数量">
                            </el-input-number>
                        </el-form-item>

                        <el-form-item  class="addButton">
                            <el-button type="primary"  size="small"  @click="addWarehouseSpaceCode">添加</el-button>
                        </el-form-item>
                </el-form>

                    <edit-table
                    :loading="false"
                    @dataChange="deleteByindex"
                    emptyText="请选择库位并输入数量添加数据"
                    :config="putQtyConfig"
                    :deleteNeed="true"
                    :useEdit="false"
                    :tableData="warehouseSpaceCodeListTable"/>

                <div class="alertBottomArr">
                    <el-button type="primary"  size="small"  @click="sureWarehouse">确认</el-button>
                    <el-button type="primary"  size="small"  @click="cancelWarehouse">取消</el-button>
                </div>
            </div>
         </div>


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
    import editTable from '@/components/Table/editTable'
    import webPaginationTable from '@/components/Table/webPaginationTable'
    import _  from 'lodash';
    import moment from 'moment';
    import { arrivalTableConfig, arrivalChildTableConfig,arrivalAlertConfig,putQtyConfig } from './components/config'
    import { orderList,orderDetailList,orderUpdateReceiveQty,receiveOrderDelete,warehouseSpaceSelect ,jobAdd} from '@/api/warehousing'
    export default {
        components: { DoubleTable,newSearch,webPaginationTable,editTable },
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
                addSearchForm:{
                  warehouseSpaceCode:'',
                  putQty:1
                },
                putQtyConfig,
                activeOrder:{},
                expandsParent:[],
                arrivalAlertConfig,
                warehouseSpaceCodeListTable:[],
                nowChildDataSelectData:[],
                warehouseSpaceCodeConfig:[],
                dialogVisible:false,
                arrivalAlertDisplay:false,
                skuRow:{}

            }
        },

         created(){

            this.arrivalAlertConfig.forEach(item=>{
                if(item.useLink){
                    item.dom=(row, column, cellValue, index)=>{
                      return <span class="link_dom" onClick={this.upperShelf.bind(this,row)} >输入上架量</span>
                    }
                }
              });

              if(sessionStorage.getItem('warehouse')){
                warehouseSpaceSelect({
                   warehouseCode:sessionStorage.getItem('warehouse'),
                   pageNum:1,
                   pageSize:1000
                }).then(res=>{
                    if(res.success){
                      this.warehouseSpaceCodeConfig=res.data&&res.data.list||[];
                    }
                }).catch(err=>{
                    console.log(err)
                })
              }
         },

        methods:{
            moment,

            putawayConfirm(){
              let json={};
              json['orderCode']=this.activeOrder.orderCode;
              json['putSpaceInfoList']=[];
              _.cloneDeep(this.nowChildDataSelectData).forEach(item=>{
                 let arr=item.warehousingArr||[];
                 arr.forEach(v=>{
                    let vJson={};
                    vJson['warehouseAreaCode']=sessionStorage.getItem('warehouse');
                    vJson['warehouseSpaceCode']=v.warehouseSpaceCode;
                    vJson['putQty']=v.putQty;
                    vJson['orderDetailId']=item.id;
                    json['putSpaceInfoList'].push(vJson)
                 })
              });
              jobAdd(json).then(res=>{
                  if(res.success){
                    this.dialogVisible=false;
                    this.$message({type:'success',message:'操作成功！'})
                    this.warehouseSpaceCodeListTable=[];
                  } else{
                     this.$message({type:'error',message:'操作失败！'})
                  }
              }).catch(err=>{
                  this.$message({type:'error',message:'操作失败！'})
                  console.log(err)
              })
            },

            deleteByindex(index, row){
               let warehouseSpaceCodeListTable= _.cloneDeep(this.warehouseSpaceCodeListTable);
               warehouseSpaceCodeListTable.splice(index,1);
               this.warehouseSpaceCodeListTable=warehouseSpaceCodeListTable;
            },

            sureWarehouse(){
              console.log(this.warehouseSpaceCodeListTable)
              let nowChildDataSelectData= _.cloneDeep(this.nowChildDataSelectData);
              let index=nowChildDataSelectData.findIndex(v=>v.id===this.skuRow.id);
              if(index<0){
                  return
              }
              nowChildDataSelectData[index]['warehousingArr']=this.warehouseSpaceCodeListTable;
              this.nowChildDataSelectData=nowChildDataSelectData;
              this.arrivalAlertDisplay=false;
              this.warehouseSpaceCodeListTable=[];
              this.addSearchForm={};
            },

            cancelWarehouse(){
              this.arrivalAlertDisplay=false;
              this.warehouseSpaceCodeListTable=[];
              this.addSearchForm={};
            },

            addWarehouseSpaceCode(){
              for(let i in this.addSearchForm){
                  if(this.addSearchForm[i]===''){
                     this.$message({type:'error',message:'库位和数量都是必填参数'});
                     return
                  }
              }
              if(this.addSearchForm['putQty']===0){
                 this.$message({type:'error',message:'数量不能为0'});
                 return
              }

              let putQtyAll=this.warehouseSpaceCodeListTable.reduce((a,b)=>{
                  return a+b.putQty
              },0)

              if(putQtyAll+this.addSearchForm['putQty']>this.skuRow.receiveQty){
                 this.$message({type:'error',message:'上架数量不能大于到货量'});
                 return
              }
              let json={id:moment().valueOf(),...this.addSearchForm};
              let index=this.warehouseSpaceCodeListTable.findIndex(v=>v.warehouseSpaceCode===this.addSearchForm.warehouseSpaceCode)
              if(index===-1){
                 this.warehouseSpaceCodeListTable.push(json);
              } else{
                  this.warehouseSpaceCodeListTable[index]['putQty']+=this.addSearchForm['putQty']
              }



            },

            upperShelf(row){
              this.arrivalAlertDisplay=true;
              this.skuRow=row;
              this.warehouseSpaceCodeListTable=row.warehousingArr;
            },

            cancelArrivalAlert(){
              this.dialogVisible=false;
              this.warehouseSpaceCodeListTable=[];
            },

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
             clearRow() {
               this.$refs['tableChild'].setCurrentRow()
               this.activeOrder = {}
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
                  json['warehousingArr']=[];
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

<style rel="stylesheet/scss" lang="scss" >
    .el-popper[x-placement^=bottom]{
        z-index: 3001 !important;
    }
   .arrival{
     .alertInfo{
        margin-bottom: 12px;
        >span{
          font-size: 14px;
          padding-right:20px;
        }
     }
     .link_dom{
       color: rgb(51, 153, 234);
       cursor: pointer;
     }
     .alertBottomArr{
         display: flex;
         justify-content: flex-end;
         padding-top: 12px;
     }

     .arrivalAlertChider{
         position: fixed;
         width: 100%;
         height: 100%;
         left: 0;
         top:0;
         z-index: 3000;
         background: rgba(0,0,0,0.3);
         .arrivalAlertChiderBody{
             padding: 12px;
             position: absolute;
             left: 50%;
             top: 50%;
             transform: translate(-50%,-50%);
             min-width:600px;
             min-height: 200px;
             background: #fff;
         }
     }

     .el-form {
        display: flex;
        .el-form-item{
           margin-right: 12px;
        }
        .addButton{
            >div{
              margin-left: 20px !important;
            }
        }
     }

   }


</style>
