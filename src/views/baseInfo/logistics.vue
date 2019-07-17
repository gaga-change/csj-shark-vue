<template>
    <div>
        <search-logistics 
           @searchTrigger="submitForm"  
           :search-forms="ruleForm">
        </search-logistics>

        <el-button type="primary" 
          size="small" 
          style="margin-bottom:12px"
          @click="logisticsHandle('add')" >
          添加
        </el-button>

        <double-table 
          :loading="loading" 
          :table-data="tableData" 
          :handle-button-map="handleButtonMap" 
          :config="tableConfig"   
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange" 
          :total="total" 
          :maxTotal="10"
          :expand-key="expandKey"
          :pageSize="ruleForm.pageSize"
          :currentPage="ruleForm.pageNum">
        </double-table>

        <el-dialog
          :title="dialogTitle+'物流公司'"
          :visible.sync="dialogVisible"
          width="420px">

            <el-form 
               :model="logisticsForm" 
               class="formInput" 
               :rules="logisticsRules"     
               ref="subForm"  
               label-width="70px" 
               label-position="left">

                 <el-form-item label="物流公司名称" 
                   label-width="100px" 
                   prop="companyName" 
                   :rules="[{ required: true, message: '该项为必填'},]">
                    <el-autocomplete 
                      v-model="logisticsForm.companyName" 
                      :debounce="300" 
                      size="small" 
                      :fetch-suggestions="querySearchAsync" 
                      placeholder="请输入物流公司" 
                      @select="handleSelect">
                    </el-autocomplete>
                </el-form-item>

                 <el-form-item 
                   label="物流公司编码"  
                   prop="companyCode" 
                   label-width="100px" 
                   :rules="[{ required: true, message: '该选择物流公司'}]">
                    <el-input type="text" 
                      size="small" 
                      placeholder="请输入物流公司编码"
                      v-model="logisticsForm.companyCode" 
                      disabled>
                    </el-input>
                </el-form-item>

                 <el-form-item label="联系人"  
                    prop="linkUser" >
                    <el-input type="text" 
                      size="small" 
                      placeholder="请输入联系人名称"
                      v-model="logisticsForm.linkUser" >
                    </el-input>
                </el-form-item>

                 <el-form-item label="联系电话"  
                    prop="linkTel" >
                    <el-input type="text" 
                      size="small" 
                      placeholder="请输入联系电话"
                      v-model="logisticsForm.linkTel" >
                    </el-input>
                </el-form-item>

                 <el-form-item label="地址"  
                   prop="linkAddress" >
                    <el-input type="text" 
                      size="small" 
                      placeholder="请输入地址"
                      v-model="logisticsForm.linkAddress" >
                    </el-input>
                </el-form-item>
            </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitIt">确 定</el-button>
                </span>
                
            </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import DoubleTable from '@/components/Table/doubleTable'
    import { tableConfig } from './components/config'
    import { getLogisticsList,addLogistics,updateLogistics,deleteLogistics,getLogisticsSearch } from '@/api'
    import { uniqueArray } from '@/utils/arrayHandler'
    import  SearchLogistics  from './components/search'

    export default {
        components: { DoubleTable, SearchLogistics },
        data(){
            return {
                imgs:'',
                loading:false,
                dialogVisible:false,
                dialogData:{},
                dialogTitle:'',
                ruleForm:{
                    pageNum: 1,
                    pageSize:10,
                    companyName:'',  
                },
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
                    {title:'修改',handle:(index,data)=>{
                        this.logisticsHandle('edit')
                        this.logisticsForm = {...data}

                    }},
                    {title:'删除',handle:(index,data)=>{
                        this.logisticsDelect(data)

                    }}
                ],
                childCanSelect:false,//子表可选择,false不可选，
                // accordionExpand:true,//手风琴展开
                multipleSelection:[],//选中的子表数据
                expandKey:'id',
                logisticsForm: {},
                logisticsFilter: []
            }
        },
        methods:{
            querySearchAsync(queryString, cb){
                if(queryString){
                    getLogisticsSearch({
                        companyName:queryString
                    }).then(res=>{
                        if(res.success){
                            if(res.data&&res.data.length>0){
                                var a = [...res.data]
                                a.map(item=>{
                                    item.value = item.companyName
                                    return item
                                })
                                return cb([...a])
                            }else{
                                cb([])
                            }
                        }else{
                            cb([])
                        }    
                    }).catch(err =>{
                        cb([])
                    }) 
                }else{
                    cb([])
                }
               
            },
            handleSelect(item){
                this.logisticsForm.companyCode = item.companyCode
            },

            getTableData(){
                this.$router.replace({
                    path:'/baseInfo/logistics',
                    query:{data:JSON.stringify(this.ruleForm)}
                })
                this.loading=true;
                let data={...this.ruleForm}
                getLogisticsList(data).then(res => {
                    if(res.success && res.data &&res.data.list){
                        this.tableData = [...res.data.list]
                        this.total = res.data.total
                    }else{
                        this.tableData = []
                        this.total = 0
                    }
                    this.loading = false;

                }).catch(err=>{
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
            submitIt(){
                this.$refs['subForm'].validate((valid) => {
                    if (valid) {
                        if(this.logisticsForm.id){
                            updateLogistics({
                                ...this.logisticsForm
                            }).then(res=>{
                                if(res.success){
                                  this.$message({type:'success',message:'操作成功！'}); 
                                  this.dialogVisible = false;
                                  this.getTableData()
                                } else{
                                   this.$message({type:'error',message:'操作失败'}) 
                                }
                            }).catch(err=>{
                                this.$message({type:'error',message:'操作失败'})
                            })
                        }else{
                            addLogistics({
                                ...this.logisticsForm
                            }).then(res => {
                                if(res.success){
                                  this.$message({type:'success',message:'操作成功！'}); 
                                  this.dialogVisible = false;
                                  this.getTableData()
                                } else{
                                   this.$message({type:'error',message:'操作失败'}) 
                                }
                            }).catch(err=>{
                                this.$message({type:'error',message:'操作失败'})
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            logisticsHandle(type){
                if(type=='add'){
                    this.dialogVisible = true
                    this.dialogTitle = '新增'
                    this.logisticsForm  = {}
                }else if(type=='edit'){
                    this.dialogVisible = true
                    this.dialogTitle = '修改'
                }
            },

            logisticsDelect(data){
                this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteLogistics(data).then(res => {
                        if(res.success){
                           this.$message({type:'success',message:'操作成功！'}); 
                           this.dialogVisible = false;
                           this.getTableData()
                        } else{
                           this.$message({type:'error',message:'操作失败'}) 
                        }
                    }).catch(err=>{
                        this.$message({type:'error',message:'操作失败'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
        },
        created(){
            this.getTableData()
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