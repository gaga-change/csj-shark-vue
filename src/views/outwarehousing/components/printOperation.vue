<template>
   <div style="margin-bottom:10px">
        <el-button 
           type="primary" 
           size="small" 
           @click="priviewReserve">
            打印计划单
        </el-button>

        <div>
             <el-dialog
                title="打印计划单"
                :visible.sync="dialogVisibleReserve"
                width="841px">
                <edit-table 
                  :config="planChildTablePrintConfig" 
                  :table-data="printPlan" 
                  id="printPlanContainer" 
                  :default-edit="false">
                </edit-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleReserve = false">取 消</el-button>
                    <el-button type="primary" @click="printPlanOrder">打印</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import editTable from '@/components/Table/editTable'
import { outboundOrderSubmit,pickOrderAdd, modifyOutPrint } from '@/api/warehousing'
import { PositiveIntegerReg,MoneyPositiveReg } from '@/utils/validator'
import { MakePrint } from '@/utils'
import { planChildTableEditConfig,planChildTableLabelConfig,planChildTablePrintConfig } from './config'
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
            planChildTableLabelConfig,
            planChildTablePrintConfig,
            printPlan:[],//打印计划单
            defaultCanedit:true,
            PickingOrderData:[],
            pickOperatorName:'',
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

        // //打印装箱单
        // priviewBoxLabel(){
        //   let arr=[]
        //   for(let i in this.selectChiledByPlanCode){
        //     arr=[...arr,...this.selectChiledByPlanCode[i]]
        //   }
        //   this.childData=arr.map(v=>{
        //       v.editable=true;
        //       v.printNum=Number(v.realOutQty).toFixed(0);
        //       return v
        //   })

        //  if(!this.childData.length){
        //     this.$message({type: 'error',message: '未选择子表里商品'});   
        //     return 
        //  }
        //   this.dialogVisibleLabel = true
        //   this.defaultCanedit = true
        // },
      
        printLabel(){
            var childData = [...this.childData]
            this.childData=childData.map(v=>{
                 v.editable=false;
                 return v
            })

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

        printPlanOrder(){
          let data=[]
          this.printPlan.map(item=>{
            data.push(item.id)
          })
          modifyOutPrint({ids:data}).then(res=>{

          }).catch(err=>{
            console.log(err)
          })
          var printPlanContainer = document.getElementById('printPlanContainer').innerHTML
          MakePrint(printPlanContainer)
        },
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

