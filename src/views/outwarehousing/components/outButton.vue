<template>
   <div style="margin-bottom:10px">
        <!-- <el-button 
           type="primary" 
           size="small" 
           @click="priviewReserve">
            打印计划单
        </el-button> -->

        <!-- <el-button 
          type="primary" 
          size="small" 
          @click="PickingOrder">
            分配拣货任务  
        </el-button> -->

        <el-button 
           type="primary" 
           size="small"
           @click="priviewBoxLabel">
           打印装箱单 
        </el-button>

        <div>
            <el-dialog
                title="打印装箱单"
                :visible.sync="dialogVisibleLabel"
                width="841px">
                <div id="print">
                  <el-form :model="planform" ref="ruleForm" label-width="120px" class="printform">
                    <el-row  gutter="20" style="margin-bottom:14px;">
                      <el-col :span="8">
                        <div style="position:relative;padding-left:75px;">
                          <i style="font-style:normal;position:absolute;top:0;left:0;width:75px;">客户编码:</i>
                          <span>{{childData.length>0?childData[0].customerCode:''}}</span>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div style="position:relative;padding-left:75px;">
                          <i style="font-style:normal;position:absolute;top:0;left:0;width:75px;">客户名称:</i>
                          <span>{{childData.length>0?childData[0].customerName:''}}</span>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div style="position:relative;padding-left:45px;">
                          <i style="font-style:normal;position:absolute;top:0;left:0;width:45px;">地址:</i>
                          <span>{{childData.length>0?childData[0].arrivalAddress:''}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                    <edit-table 
                      :config="outChildTableLabelConfig" 
                      :default-canedit="defaultCanedit" 
                      :table-data="childData" 
                      v-loading="loading" 
                      :default-edit="false">
                    </edit-table>
                </div>
                <span slot="footer" class="dialog-footer" v-loading="loading">
                    <el-button @click="dialogVisibleLabel = false">取 消</el-button>
                    <el-button type="primary" @click="printLabel">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import editTable from '@/components/Table/editTable'
import { outboundOrderSubmit,pickOrderAdd } from '@/api/warehousing'
import { PositiveIntegerReg,MoneyPositiveReg } from '@/utils/validator'
import { MakePrint } from '@/utils'
import { planChildTableEditConfig,outChildTableLabelConfig,planChildTablePrintConfig } from './config'
import { printPlanDataFn } from './dataHandler'

export default {
    name:'operationButton',
    components:{
        editTable
    },
    data(){
        return {
            dialogVisible:false,
            dialogVisibleLabel:false,
            dialogVisibleReserve:false,
            previewIt:true,
            loading:false,
            childData:[],
            planChildTableEditConfig,
            outChildTableLabelConfig,
            planChildTablePrintConfig,
            printPlan:[],//打印计划单
            defaultCanedit:true,
            PickingOrderData:[],
            pickOperatorName:'',
            planform:{}
        }
    },
    props:{
        parentDataObj:{
            type:Object,
            default:()=>{}
        },
        childDataArr:{
            type:Array,
            default:()=>[]
        },
        planPrintData:{
            type:Array,
            default:()=>[]
        },
        orderType:{
            type:String,
            default:''
        },
        activePlanCode:{
           type:String,
           default:'' 
        },
        selectChiledByPlanCode:{
            type:Object,
            default:()=>{}
        }
    },


    methods:{
        // surePicking(){
        //   let json={};
        //   json.pickOrderDetailAddReqList=this.PickingOrderData;
        //   if(json.pickOrderDetailAddReqList.some(v=>{
        //     if(v.sortQty<0||v.sortQty>v.planOutQty-v.save_sortQty){
        //         this.$message({type:'error',message:`计划单 ${v.planCode} 的本次出库数量应该在 0-${v.planOutQty-v.save_sortQty} 之间`})
        //         return true
        //     }
        //   })){
        //     return 
        //   }
        //   json.pickOperatorId='666';
        //   json.pickType=0;
        //   json.pickOperatorName=this.pickOperatorName;
        //   if(json.pickOperatorName===''){
        //     this.$message({type: 'error',message: '拣货人姓名必填'});   
        //     return    
        //   }
        //   pickOrderAdd(json).then(res=>{
        //     if(res.success){
        //        this.$message({type: 'success',message: '操作成功!'});
        //        this.dialogVisible=false;
        //     }
        //   }).catch(err=>{
        //       console.log(err)
        //   })
        // },

        //打印装箱单
        priviewBoxLabel(){
          let arr=[]
          for(let i in this.selectChiledByPlanCode){
            arr=[...arr,...this.selectChiledByPlanCode[i]]
          }
          // console.log(this.selectChiledByPlanCode)
          this.childData=arr.map(v=>{
              v.printNum=v.realOutQty
              return v
          })

         if(!this.childData.length){
            this.$message({type: 'error',message: '未选择子表里商品'});   
            return 
         }
          this.dialogVisibleLabel = true
          this.defaultCanedit = true
        },
      
        printLabel(){
            var childData = [...this.childData]
            // this.childData=childData.map(v=>{
            //      v.editable=false;
            //      return v
            // })

            setTimeout(()=>{
               let label = document.getElementById('print').innerHTML
               //样式暂时不可配，需优化
               let style = "<style type='text/css'>.border{border:1px solid #666;width:530px;display:inline-block;padding:10px;} .marginRight5{margin-right:5px;} table {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;} img{max-width:130px;} .card-list{margin-bottom: 6px;width:25%;display:inline-block} .el-dropdown{display:inline-block} </style>"
               MakePrint(label,style)
            },500)
        },

      //  PickingOrder(){
      //     let arr=[]
      //     for(let i in this.selectChiledByPlanCode){
      //       arr=[...arr,...this.selectChiledByPlanCode[i]]
      //     }
      //     this.PickingOrderData=arr.map(v=>{
      //         v.editable=true;
      //         v.tempOutQty=v.sortQty-v.realSortQty;
      //         v.save_sortQty=v.sortQty;
      //         v.sortQty=v.planOutQty-v.sortQty;
      //         return v
      //     })

      //   if(!this.PickingOrderData.length){
      //       this.$message({type: 'error',message: '未选择子表里商品'});   
      //       return 
      //   }
      //   this.dialogVisible=true;

      // },

        priviewReserve(){
            this.printPlan = [...printPlanDataFn([...this.planPrintData])]
            if(!this.printPlan.length){
                this.$message({type: 'error',message: '未选择单据,可点击任意行选择'});   
                return 
            }
             this.dialogVisibleReserve = true
        },

        // printPlanOrder(){
        //     var printPlanContainer = document.getElementById('printPlanContainer').innerHTML
        //     MakePrint(printPlanContainer)
        // },
    }
}
</script>

<style scoped lang="scss">
 .labelContainer{
     width:180px;
    .labelItemLeft{
        display:inline-block;
        width:60px;
        margin-right:10px;
    }
 }
</style>

