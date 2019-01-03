<template>
   <div style="margin-bottom:10px">
        <el-button type="primary" size="small" @click="makeInbound">到货入库</el-button>
        <el-button type="primary" size="small" @click="priviewProductLabel">打印商品标签</el-button>
        <el-button type="primary" size="small" @click="priviewReserve">打印计划单</el-button>

        <div>
            <el-dialog
                title="到货入库"
                :visible.sync="dialogVisible"
                width="70%"
            >
                <el-row :gutter="20" style="margin-bottom:14px;">
                    <el-col :span="8">入库计划单: {{parentDataObj.planCode}}</el-col>
                    <el-col :span="8">客户/供应商: {{parentDataObj.providerName}}</el-col>
                    <el-col :span="8">下单时间: {{formateTime(parentDataObj.gmtCreate)}}</el-col>
                </el-row>
                <edit-table :config="planChildTableEditConfig" :table-data="childData" :default-edit="false"></edit-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm(1)">加入入库单</el-button>
                    <el-button type="primary" @click="submitForm(2)">确认上架</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="打印商品标签"
                :visible.sync="dialogVisibleLabel"
                width="70%"
            >
                 <edit-table :config="planChildTableLabelConfig" :table-data="childData" v-loading="loading" :default-edit="false"></edit-table>
                 <template v-if="!previewIt">
                     <div style="margin:10px;">预览</div> 
                     <div id="print" style="width:80mm;height:40mm;overflow:auto;margin:10px;">
                         <div v-for="item in childData" :key="item.skuCode">
                             <div v-for="i in Number(item.printNum)" :key="i" class="labelContainer">
                                 <div class="labelItem"><span class="labelItemLeft" >商品编码</span><span>{{item.skuCode}}</span></div>
                                 <div class="labelItem"><span class="labelItemLeft">商品名称</span><span>{{item.skuName}}</span></div>
                                 <div class="labelItem"><span class="labelItemLeft">规格型号</span><span>{{item.skuFormat}}</span></div>
                                 <div class="labelItem"><span class="labelItemLeft">货主</span><span>{{item.ownerName}}</span></div>
                                 <div class="labelItem"><span class="labelItemLeft">批次</span><span>{{item.batchNo}}</span></div>
                                 <div>
                                     <!-- <img :src="`/webApi/barcode?msg=${item.skuUnitConvert}&type=code128&width=120&height=80`" alt="条形码" > -->
                                     <bar-code :code="item.batchNo"></bar-code>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </template>
                <span slot="footer" class="dialog-footer" v-loading="loading">
                    <el-button @click="dialogVisibleLabel = false">取 消</el-button>
                    <el-button type="primary" @click="getCode">预览</el-button>
                    <el-button type="primary" v-if="!previewIt" @click="printLabel">打印</el-button>
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
import axios from 'axios'
import editTable from '@/components/Table/editTable'
import { inboundOrderSubmit, getBatchNo } from '@/api/warehousing'
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
        }
    },
    methods:{
        formateTime(val){
            return moment(val).format('YYYY-MM-DD HH:MM:SS')
        },
        makeInbound(){
            var usable =  this.checkDataUsable();
            if(usable.objectUsabel&&usable.arrUsabel){
                this.dialogVisible = true;    
            }else{
                this.$message({type:'info',message:'请选择单据和商品'})
            }
            
        },
        priviewProductLabel(){
            var usable =  this.checkDataUsable();
            if(usable.arrUsabel){
                this.dialogVisibleLabel = true
                this.previewIt = true
            }else{
                this.$message({type:'info',message:'请选择单据和商品'})
            }
        },
        getBatchNoArr(batchNoArr){
            var arr =[],brr = []
            for(var i = 0;i<batchNoArr.length;i++){
                let req = getBatchNo(batchNoArr[i])
                arr.push(req)
                brr.push(i)
            }
            return axios.all(arr).then(axios.spread((...brr)=>{
                return brr 
            }))
        },
        async getCode(){
            // this.loading = true
            // getBarCode().then(res => {
            //     if(res.success){
            //         this.previewIt =false
            //     }

            // }).catch(err=>{
            //     this.loading = false
            // })
            var childData = [...this.childData]
            var batchNoArr = []
            var canPriview = true
            childData.map(item => {if(!PositiveIntegerReg.test(item.printNum)){
                canPriview = false
            }
                batchNoArr.push({skuCode:item.skuCode,ownerCode:this.parentData.ownerCode,providerCode:this.parentData.providerCode})
            })
            if(!canPriview){
                this.$message({type:'error',message:'打印张数为正整数'})
                return false
            }
            // console.log(batchNoArr, 'aaaaa')
            // batchNoArr.map(item=>{
            //     getBatchNo(item).then(res => {
            //         console.log(res,'res');
            //     })
            // })
            var abb = await this.getBatchNoArr(batchNoArr)
            abb.map(item => {
                if(item.success&&item.data&&item.data.batchNo){
                    childData = childData.map(child=>{
                        if(item.data.skuCode==child.skuCode){
                            child.batchNo = item.data.batchNo
                        }
                        return child
                    })
                }else{
                    canPriview = false
                }
            })
            if(!canPriview){
                this.$message({type:'error',message:'批次号查询出错，请重试'})
                return false
            }
            this.childData=[...childData]
            this.previewIt =false

        },
        printLabel(){
            var label = document.getElementById('print').innerHTML
            //样式暂时不可配，需优化
            var style = "<style type='text/css'>.labelContainer{width:80mm; height:40mm;overflow:hidden;border-bottom: 1px dashed #eee;}.labelItem{ height:5mm;line-height: 5mm; font-weight: 600;font-size: 13px;}.labelContainer .labelItemLeft{display:inline-block;width:70px;margin-right:20px;} img{width:40mm;height:15mm}</style>"
            MakePrint(label,style)
        },
        checkDataUsable(){
            var a = {...this.parentDataObj}
            var b = this.childDataArr.map(item => {item.editable = true;item.printNum = item.realInQty;item.ownerName=a.ownerName;item.providerName=a.providerName;return item})
            this.childData=[...b]
            this.parentData = {...a}
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
        submitForm(orderStatus){//提交
            var canSubmit = true
            var items = []
            var isSubmit = orderStatus==1 ? false : true
            this.childData.map(item =>{
                var a = item.planInQty || 0
                var b = item.realInQty || 0
                var c = item.tempInQty || 0
                var limit = a-b-c;
                if(item.realInQtyIt>limit){//加减操作 if()
                    canSubmit = false
                }
                if(!MoneyPositiveReg.test(item.realInQtyIt)){
                    canSubmit = false
                }
                items.push({realInQty:item.realInQtyIt||0,busiIndex:item.busiIndex,remarkInfo:item.remarkInfo,skuCode:item.skuCode})

            })
            if(!canSubmit){
                this.$message({type:'error',message:'数据有误,最多两位小数，请修改'})
                return false
            }
            

            inboundOrderSubmit({planCode:this.parentData.planCode,isSubmit:isSubmit,items:[...items]}).then(res => {
                if(res.success){
                    this.dialogVisible = false
                    this.$message({type:'success',message:'入库单提交成功',duration:1500,onClose:()=>{
                        
                        this.$router.push({path:'/inwarehousing/inboundOrder'})
                    }})
                }else{
                     this.$message({type:'info',message:'入库单提交失败'})
                }
            }).catch(err=>{
                this.$message({type:'info',message:'入库单提交失败'})
            })
        }
    }
}
</script>
<style scoped lang="scss">
 .labelContainer{
     width:80mm;
     height:40mm;
     overflow: hidden;
     border-bottom: 1px dashed #eee;
     .labelItem{
         
         height:5mm;
         line-height: 5mm;
         font-weight: 600;
         font-size: 13px;
     }
    .labelItemLeft{
        display:inline-block;
        width:60px;
        margin:0 10px;
    }
    img{
        width: 40mm;
        height:15mm;
        margin: 0 auto;
    }
 }
</style>

