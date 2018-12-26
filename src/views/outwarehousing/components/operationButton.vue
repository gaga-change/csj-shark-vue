<template>
   <div style="margin-bottom:10px">
         <el-button type="primary" size="small" @click="makeOutbound">出库登记</el-button>
        <el-button type="primary" size="small" @click="priviewBoxLabel">打印装箱单</el-button>
        <el-button type="primary" size="small" @click="priviewReserve">打印计划单</el-button>

        <div>
            <el-dialog
                title="出库登记"
                :visible.sync="dialogVisible"
                width="70%"
            >
                <el-row :gutter="20" style="margin-bottom:14px;">
                    <el-col :span="6">出库预约单：{{parentData.planCode}}</el-col>
                    <el-col :span="6">供应商：{{parentData.arrivalName}}</el-col>
                     <el-col :span="6">货主：{{parentData.ownerName}}</el-col>
                    <el-col :span="6">下单时间：{{formateTime(parentDataObj.gmtCreate)}}</el-col>
                     <el-col :span="6">收货人：{{parentData.arrivalLinkName}}</el-col>
                     <el-col :span="6">收货地址：{{parentData.arrivalAddress}}</el-col>
                     <el-col :span="6">联系电话{{parentData.arrivalLinkTel}}</el-col>
                </el-row>
                <edit-table :config="planChildTableEditConfig" :table-data="childData" :default-edit="false"></edit-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                     <el-button type="primary" @click="submitFormIt(1)">加入出库单</el-button>
                    <el-button type="primary" @click="submitFormIt(2)">确认出库</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="打印装箱单"
                :visible.sync="dialogVisibleLabel"
                width="70%"
            >
                <div id="print">
                    <div class="border"><span>客户编码：</span><span class="marginRight5">{{parentData.arrivalCode}}</span>    <span>客户名称：</span><span>{{parentData.arrivalName}}</span><span>{{parentData.arrivalAddress}}</span></div>
                    <edit-table :config="planChildTableLabelConfig" 
                    :default-canedit="defaultCanedit" :table-data="childData" v-loading="loading" :default-edit="false"></edit-table>
                </div>
                
                <span slot="footer" class="dialog-footer" v-loading="loading">
                    <el-button @click="dialogVisibleLabel = false">取 消</el-button>
                     <el-button type="primary" v-if="defaultCanedit" @click="defaultCanedit=false">预览</el-button>
                    <el-button type="primary" v-else @click="printLabel">确 定</el-button>
                </span>
            </el-dialog>
             <el-dialog
                title="打印计划单"
                :visible.sync="dialogVisibleReserve"
                width="70%"
            >
                <edit-table :config="planChildTablePrintConfig" :table-data="printPlan" id="printPlanContainer" :default-edit="false"></edit-table>
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
import { outboundOrderSubmit } from '@/api/warehousing'
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
            parentData:{},
            childData:[],
            planChildTableEditConfig,
            planChildTableLabelConfig,
            planChildTablePrintConfig,
            printPlan:[],//打印计划单
            defaultCanedit:true,
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
        }
    },
    methods:{
        formateTime(val){
            return moment(Number(val)).format('YYYY-MM-DD HH:MM:SS')
        },
        makeOutbound(){
            var usable =  this.checkDataUsable();
            if(usable.objectUsabel&&usable.arrUsabel){
                this.dialogVisible = true;    
            }else{
                this.$message({type:'info',message:'请选择单据和商品'})
            }
            
        },
        priviewBoxLabel(){
            var usable =  this.checkDataUsable();
            if(usable.objectUsabel&&usable.arrUsabel){
                this.dialogVisibleLabel = true
                this.defaultCanedit = true
            }else{
                this.$message({type:'info',message:'请选择单据和商品'})
            }
        },
      
        printLabel(){
            var childData = [...this.childData]
            var canPriview = true
            childData.map(item => {if(!PositiveIntegerReg.test(item.printNum)){
                canPriview = false
            }})
            if(!canPriview){
                this.$message({type:'error',message:'数量为正整数'})
                this.defaultCanedit = true
                return false
            }
            this.childData=[...childData]
            var label = document.getElementById('print').innerHTML
            //样式暂时不可配，需优化
            var style = "<style type='text/css'>.border{border:1px solid #666;width:530px;display:inline-block;padding:10px;} .marginRight5{margin-right:5px;} table {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;} img{max-width:130px;} .card-list{margin-bottom: 6px;width:25%;display:inline-block} .el-dropdown{display:inline-block} </style>"
            MakePrint(label,style)
        },
        checkDataUsable(){
            var a = {...this.parentDataObj}
            var b = this.childDataArr.map(item => {item.editable = true;item.printNum = item.realOutQty;return item})
            this.childData=[...b]
            
            this.parentData = {...a}
            console.log(a,1,this.parentData,2,this.parentDataObj);
            
            var objectUsabel = Object.keys(a).length>0
            var arrUsabel = b.length>0
            return {
                objectUsabel,arrUsabel
            }
        },
        priviewReserve(){
            if(this.planPrintData.length>0){
                this.dialogVisibleReserve = true
                this.printPlan = [...printPlanDataFn([...this.planPrintData])]
            }else{
                this.$message({type:'info',message:'请选择单据'})
            }
          
        },
        printPlanOrder(){
             var printPlanContainer = document.getElementById('printPlanContainer').innerHTML

            MakePrint(printPlanContainer)
        },
        submitFormIt(orderStatus){//提交
            var canSubmit = true
            var items = []
           
            this.childData.map(item =>{
                var a = item.planOutQty || 0
                var b = item.realOutQty || 0
                var c = item.tempOutQty || 0
                var limit = a-b-c;
               if(item.realOutQtyIt>limit){//加减操作 if()
               console.log(1);
               
                    canSubmit = false
                }
                if(!MoneyPositiveReg.test(item.realOutQtyIt)){
                    
                    canSubmit = false
                }
                items.push({batchNo:item.batchNo,busiIndex:item.busiIndex,skuCode:item.skuCode,realOutQty:item.realOutQtyIt,remarkInfo:item.remarkInfo})
            })
            if(!canSubmit){
                this.$message({type:'error',message:'数据错误，最多两位小数，请修改'})
                return false
            }
            
           
            // debugger
            outboundOrderSubmit({...this.parentData,orderStatus:orderStatus,ownerCode:this.parentData.ownerCode ,customerCode:this.parentData.arrivalCode,customerName:this.parentData.arrivalName,warehouseCode:this.$store.getters.chooseWarehouse,orderType:this.orderType,addOutWareHouseOrderVO:[...items]}).then(res => {
                if(res.success){
                    this.dialogVisible = false
                    this.$message({type:'success',message:'出库单提交成功',duration:1500,onClose:()=>{
                        this.$router.push({path:'/outwarehousing/outboundOrder'})
                    }})
                }else{
                     this.$message({type:'info',message:'出库单提交失败'+res.message})
                }
            }).catch(err=>{
                this.$message({type:'info',message:'出库单提交失败'+err.message})
            })
            
        }
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

