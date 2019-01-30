<template>
    <div>
        <search-deliver 
          @searchTrigger="submitForm" 
          ref="searchWarhouse" 
          :deliver-company="deliverCompanyAll" 
          @resetSearch="resetForm" 
          :search-forms="ruleForm">
        </search-deliver>

        <el-button 
          type="primary" 
          st 
          size="small" 
          @click="logisticsHandle" 
          style="margin-bottom:15px">
          物流登记
        </el-button>

        <double-table 
         :loading="loading" 
         :table-data="tableData" 
         :handle-button-map="handleButtonMap" 
         :config="tableConfig"   
         @sizeChange="handleSizeChange"
         @currentChange="handleCurrentChange" 
         @currentRadioChange="currentRadioChange"
         :highlight-current-row="highlightCurrentRow" 
         :total="total" 
         :maxTotal="10"
         :expand-key="expandKey"
         :pageSize="ruleForm.pageSize"
         :currentPage="ruleForm.pageNum">
         </double-table>

         <el-dialog
           :title="'新增物流登记'"
           :visible.sync="dialogVisible">

            <el-row :gutter="10">
                <el-col :span="12" style="margin-bottom:12px">
                    <span>计划单号：</span>{{selectData.planCode}}
                </el-col>
                <el-col :span="12" style="margin-bottom:12px">
                    <span>下单时间：</span>{{formatTime(selectData.placeOrderTime)}}
                </el-col>
                <el-col :span="12" style="margin-bottom:12px">
                    <span>收货人：</span>{{selectData.receiver}}
                </el-col>
                <el-col :span="12" style="margin-bottom:12px">
                    <span>收货地址：</span>{{selectData.receiveAddress}}
                </el-col>
            </el-row>

            <el-form 
               :model="logisticsForm" 
               class="formInput" 
               :rules="logisticsRules"     
               ref="subForm" 
               :height="200" 
               label-width="80px" 
               label-position="left">
                <el-form-item 
                  label="物流公司名称" 
                  label-width="100px" 
                  prop="logisticsComCode" >
                    <el-select 
                      v-model="logisticsForm.logisticsComCode" 
                      :rules="[{ required: true, message: '该项为必选'}]" 
                      clearable 
                      placeholder="请选择物流公司" 
                      size="small" 
                      prefix-icon="el-icon-search">
                        <el-option
                          v-for="item in deliverCompanyAll"
                          :key="item.companyCode"
                          :label="item.companyName"
                          :value="item.companyCode">
                        </el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="物流单号"
                    prop="logisticsOrderCode" >
                    <el-input 
                      type="text" 
                      size="small"
                      placeholder="请输入物流单号" 
                      :rules="[ { required: true, message: '该项为必填'}]" 
                      v-model="logisticsForm.logisticsOrderCode" >
                    </el-input>
                </el-form-item>

                 <el-form-item 
                   label="件数" 
                   prop="carrierQty" >
                    <el-input 
                       type="number" 
                       size="small" 
                       placeholder="请输入件数" 
                       :rules="[{ required: true, message: '该项为必填'}]"  
                       v-model="logisticsForm.carrierQty" >
                    </el-input>
                </el-form-item>

                <el-form-item 
                  label="运费"   
                  :rules="[{ required: true, message: '该项为必填'}]" 
                  prop="freightAmt">
                    <el-input type="number"
                      size="small" 
                      placeholder="请输入运费" 
                      v-model="logisticsForm.freightAmt" >
                    </el-input>
                </el-form-item>

                <el-form-item 
                   label="其它费用"  
                   prop="otherAmt" >
                    <el-input type="number" 
                      size="small"  
                      placeholder="请输入其它费用" 
                      v-model="logisticsForm.otherAmt" >
                    </el-input>
                </el-form-item>

                <el-form-item 
                  label="物流总额"  
                  prop="skuAmt" >
                    <el-input type="number" 
                       size="small" 
                       placeholder="请输入物流总额"
                       v-model="logisticsForm.skuAmt" 
                       disabled>
                    </el-input>
                </el-form-item>

                 <el-form-item 
                   label="运费承担方" 
                   label-width="100px"  
                   prop="payType" 
                   :rules="[{ required: true, message: '该项为必选'}]" >
                     <el-select v-model="logisticsForm.payType" 
                     size="small">
                        <el-option
                           key="我方承担"
                            placeholder="请输入运费承担方"
                           label="我方承担"
                           :value="0">
                        </el-option>

                        <el-option
                          key="客户承担"
                          label="客户承担"
                          :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>
               
                 <el-form-item 
                   label="备注"  
                   prop="remarkInfo" >
                    <el-input type="text" 
                       size="small"
                       placeholder="请输入备注"
                       v-model="logisticsForm.remarkInfo" >
                    </el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeliver">确 定</el-button>
            </span>

        </el-dialog>

         <el-dialog
           :title="'物流详情'"
           :visible.sync="dialogVisibleDeliver">
            <deliver-detail :detailData="detailData"/>
              <span slot="footer" class="dialog-footer">
                <el-button  @click="dialogVisibleDeliver = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import DoubleTable from '@/components/Table/doubleTable'
    import moment from 'moment'
    import { tableConfig } from './components/config'
    import { addLogisticsRegister, getLogisticsRegisterInfo,getLogisticsRegisterList,getLogisticsSelectList } from '@/api/logistics'
    import { uniqueArray } from '@/utils/arrayHandler'
    import  SearchDeliver  from './components/search'
    import  DeliverDetail  from './components/deliverDetailinfo'
    const ruleForm = {
        pageNum: 1,
        pageSize:10,
        logisticsComCode:'',
        register:'',
        planCode:'',
        placeOrderStartDate:'',
        placeOrderEndDate:'',
        logisticsComCode:'',
        ownerName:'',
        durationTime:[],
    }
    
    export default {
        components: { DoubleTable, SearchDeliver, DeliverDetail },
        data(){
            return {
                imgs:'',
                loading:false,
                dialogVisible:false,
                dialogData:{},
                dialogTitle:'',
                ruleForm,
                logisticsRules:{},
                selectData:{//x选中的单据
                    
                },
                // searchForms,
                tableData:[
                ],
                // pageNum:0,
                // pageSize:10,
                //子表数据名称 为空时不显示不可展开
                childDataName:'',
                //表格配置
                tableConfig:tableConfig,
                // currentPage:1,
                // pageSize:10,
                total:0,
                //主表操作
                handleButtonMap:[
                    {title:'物流跟踪',handle:(index,data)=>{
                        
                        this.logisticsRecord(data)
                        this.logisticsForm = {...data}

                    }},
                ],
                childCanSelect:false,//子表可选择,false不可选，
                // accordionExpand:true,//手风琴展开
                multipleSelection:[],//选中的子表数据
                expandKey:'id',
                logisticsForm:{},
                detailData:[],
                dialogVisibleDeliver:false,
                deliverCompanyAll:[],
                highlightCurrentRow: true,
            }
        },
        computed:{
            skuAmt:function(){
                var a = (this.logisticsForm.freightAmt||0)-0+(this.logisticsForm.otherAmt||0)
                this.logisticsForm.skuAmt = a
                
                return a
            }
        },
        watch:{
            logisticsForm:{
                handler(val,oldval){
                    this.logisticsForm.skuAmt = (this.logisticsForm.freightAmt||0)-0+((this.logisticsForm.otherAmt||0)-0)
                    console.log(63333333,this.logisticsForm.skuAmt);
                    
                },
                deep:true,
                immediate:true
            }
        },
        methods:{

            getTableData(){

                this.$router.replace({
                    path:'/deliverInfo/deliver',
                    query:{data:JSON.stringify(this.ruleForm)}
                })
                this.loading=true;
                let data={...this.ruleForm}
                getLogisticsRegisterList(data).then(res => {
                    
                    if(res.success && res.data &&res.data.list){
                        this.tableData = [...res.data.list]
                        this.total = res.data.total
                    }
                    this.loading = false;

                }).catch(err=>{
                    console.log(err);
                    this.loading = false;                    
                })
            },
         
            formatTime(val){
                return moment(val).format('YYYY-MM-DD')
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
                 var placeOrderStartDate = '',placeOrderEndDate='';
                  if(ruleForm.durationTime&&ruleForm.durationTime[0]){
                    placeOrderStartDate = +(new Date(ruleForm.durationTime[0]))
                    placeOrderEndDate = +(new Date(ruleForm.durationTime[1]))
                  }
                this.ruleForm={...ruleForm,pageSize:10,pageNum:1,placeOrderStartDate,placeOrderEndDate}
                this.getTableData();
                
            },
            submitDeliver(){
                
                this.$refs['subForm'].validate((valid) => {
                    if (valid) {
                        addLogisticsRegister({...this.logisticsForm,id:this.selectData.id}).then(res => {
                            if(res.success){
                                this.$message({type:'success',message:'新增物流登记成功'})
                                this.dialogVisible = false
                                this.getTableData()
                            }else{
                                this.$message({type:'info',message:'新增物流登记失败'})
                            }
                         })
                        
                        // this.getCurrentTableData();
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.ruleForm={ ...ruleForm }
                this.getTableData()
                
            },
            logisticsHandle(){
                this.logisticsForm = {}
                this.dialogVisible = true
                if(this.selectData&&this.selectData.planCode&&!this.selectData.register){
                    this.dialogVisible = true
                }else{
                    this.$message({
                        type:'info',
                        message:'请选择未登记的单据'
                    })
                }
            },
            logisticsRecord(data){
                
                if(data.register){
                    getLogisticsRegisterInfo({logisticsComCode:data.logisticsComCode,
                    logisticsOrderCode:data.logisticsOrderCode,
                    logisticsRegisterId:data.id}).then(res=>{
                        if(res.success){
                            this.dialogVisibleDeliver = true
                            this.detailData = res.data
                        }else{
                            this.$message({
                                type:'info',
                                message:'请稍后重试'
                            })
                        }
                    }).catch(err => {
                         this.$message({
                            type:'info',
                            message:'请稍后重试'
                        })
                    })
                }else{
                     this.$message({
                        type:'info',
                        message:'该单据尚未登记'
                    })
                }
            },
            currentRadioChange(data){//选中某行
                
                this.selectData = { ...data }
            },
            getLogisticsList(){
                getLogisticsSelectList().then(res=>{
                    if(res.success&&res.data&&res.data.length>0){
                        this.deliverCompanyAll = res.data
                    }
                })
            }
            
           
        },
        created(){
            this.getTableData()
            this.getLogisticsList()
            // this.demo()
            // this.currentRedioChange()
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .formInput{
        input{
           width:220px;
        }
    }
</style>