<template>
    <div>
        <search-logistics 
          @searchTrigger="submitForm" 
          @resetSearch="resetForm" 
          :search-name="searchName"
          :search-forms="ruleForm">
        </search-logistics>

        <el-button type="primary"
           size="small" 
           @click="formHandle('add')" 
           style="margin-bottom:15px">
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
          :title="dialogTitle+'库区'"
          :visible.sync="dialogVisible"
          width="420px">
            <el-form 
              :model="formParams" 
              class="formInput"     
              ref="subForm"  
              label-width="70px" 
              label-position="left">

              <el-form-item label="仓库编码"  
               prop="warehouseCode"  >
                 <el-input type="text" 
                   size="small" 
                   v-model="chooseWarehouse" 
                   disabled>
                 </el-input>
               </el-form-item>

               <el-form-item label="仓库名称"  prop="warehouseName" >
                  <el-input type="text" 
                    size="small" 
                    v-model="warehouseName" 
                    disabled>
                  </el-input>
               </el-form-item>

                <el-form-item label="库区编码"  
                  prop="warehouseAreaCode"  
                  :rules="[{ required: true, message: '请选择库区'}]">
                   <el-select v-model="formParams.warehouseAreaCode" 
                     clearable placeholder="请选择库区" 
                     :disabled="formType!='add'"
                     size="small">
                     <el-option
                     v-for="item in AtoZ"
                     :key="item.name"
                     :label="item.name"
                     :disabled="item.isUsed"
                     :value="item.value">
                     </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否虚拟区" label-width="90px" 
                  :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="formParams.isVirtual" 
                        :disabled="formType!='add'"
                        clearable placeholder="请选择" 
                        size="small">
                        <el-option
                        v-for="item in YesOrNoEnum"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="库区状态" label-width="90px" :rules="[{ required: true, message: '请选择'}]">
                  <el-select v-model="formParams.warehouseAreaStatus" 
                        :disabled="formType!='add'"
                        clearable placeholder="请选择" 
                        size="small">
                        <el-option
                        v-for="item in WarehouseAreaStatusEnum"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="库区性质" prop="warehouseAreaNature" 
                  :rules="[{ required: true, message: '请选择库区性质'}]">
                  <el-select v-model="formParams.warehouseAreaNature" 
                        clearable placeholder="请选择库区性质" 
                        :disabled="formType!='add'"
                        size="small">
                        <el-option
                        v-for="item in WarehouseAreaNatureEnum"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
             
                 <el-form-item label="库区功能"  prop="warehouseAreaDesc" >
                    <el-input type="textarea" 
                      :maxlength="100" 
                      size="small" 
                      v-model="formParams.warehouseAreaDesc" 
                      :disabled="this.formType=='watch'">
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
    import { mapGetters } from 'vuex'

    import DoubleTable from '@/components/Table/doubleTable'
    import { SimpleMsg } from '@/utils/luoFun'
    import { areaTableConfig } from './components/config'
    import { getInventoryArea,addInventoryArea,updateInventoryArea,deleteInventoryArea, getSelectInventoryAreaList} from '@/api/inventory'
    import { uniqueArray } from '@/utils/arrayHandler'
    import { WarehouseAreaNatureEnum, YesOrNoEnum, WarehouseAreaStatusEnum,AtoZ } from '@/utils/enum'
    import  SearchLogistics  from './components/search'
    const ruleForm = {
        pageNum: 1,
        pageSize:10,
        warehouseAreaCode:'',
        isVirtual:0,
        warehouseAreaNature:''
    }
    
    export default {
        components: { DoubleTable, SearchLogistics },
        data(){
            return {
                imgs:'',
                loading:false,
                dialogVisible:false,
                dialogData:{},
                dialogTitle:'',
                ruleForm,
                YesOrNoEnum,
                WarehouseAreaNatureEnum,
                WarehouseAreaStatusEnum,
                AtoZ,
                formRules:{},
                selectData:{//x选中的单据
                    
                },
                searchForm:{},
                // searchForms,
                tableData:[
                ],
                // pageNum:0,
                // pageSize:10,
                //子表数据名称 为空时不显示不可展开
                childDataName:'',
                //表格配置
                tableConfig:areaTableConfig,
                // currentPage:1,
                // pageSize:10,
                total:0,
                //主表操作
                handleButtonMap:[
                    {title:'修改',handle:(index,data)=>{
                        this.formHandle('edit')
                        this.formParams = {...data}

                    }},
                    {title:'状态更改',handle:(index,data)=>{
                        this.changeStatus()
                        this.formParams = {...data}

                    },formatter:function(data){
                        return data.warehouseAreaStatus ? '启用':'禁用'
                    }},
                    {title:'删除',handle:(index,data)=>{
                        this.formDelete(data)

                    }}
                    
                ],
                childCanSelect:false,//子表可选择,false不可选，
                // accordionExpand:true,//手风琴展开
                multipleSelection:[],//选中的子表数据
                expandKey:'id',
                formParams: {},
                logisticsFilter: [],
                formType: '',
                warehouseName:'',
                searchName:'inventory'
            }
        },
        methods:{
         
            handleSelect(item){
                this.formParams.companyCode = item.companyCode
            },
            changeStatus(){
                 this.$confirm('是否确定更改?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateInventoryArea({...this.formParams,warehouseAreaStatus:this.formParams.warehouseAreaStatus?0:1}).then(res => {
                         SimpleMsg({result:res.success,msgType:'user',msg:this.formParams.warehouseAreaStatus?'启用':'禁用',cb:()=>{ this.dialogVisible = false;
                                    this.getTableData()}})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            getTableData(){

                this.$router.replace({
                    path:'/baseInfo/inventoryArea',
                    query:{data:JSON.stringify(this.ruleForm)}
                })
                this.loading=true;
                
                let data={...this.ruleForm,warehouseCode:this.chooseWarehouse}
                getInventoryArea(data).then(res => {
                    
                    if(res.success && res.data &&res.data.list){
                        this.tableData = [...res.data.list]
                        this.total = res.data.total
                    }else{
                        this.tableData = []
                        this.total = 0
                    }
                    // this.loading = false;

                }).catch(err=>{
                    // this.loading = false;                    
                }).finally(()=>{
                    this.loading = false;                    
                })
                getSelectInventoryAreaList({warehouseCode:this.chooseWarehouse}).then(res=>{
                    console.log(res,22333);
                    if(res.success){
                        if(res.data&&res.data.length>0){
                            let tempList = [...this.AtoZ]
                            let temp = res.data.map(item=>item.warehouseAreaCode)
                            tempList.map(item=>{
                                if(temp.includes(item.value)){
                                    item.isUsed=true
                                }else{
                                    item.isUsed=false
                                }
                                return item
                            })
                            this.AtoZ = [...tempList]
                            // this.AtoZ.push([...tempList])
                            console.log(tempList,444444);
                            
                        }
                    }
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
                        
                        this.formParams.warehouseCode = this.chooseWarehouse
                        this.formParams.warehouseAreaName = this.formParams.warehouseAreaCode
                        if(this.formParams.id){
                            updateInventoryArea({...this.formParams}).then(res=>{
                                SimpleMsg({result:res.success,msgType:'edit',msg:'库区',cb:()=>{ this.dialogVisible = false;
                                    this.getTableData()}})
                            })
                        }else{
                            addInventoryArea({...this.formParams}).then(res => {
                                SimpleMsg({result:res.success,msgType:'add',msg:'库区',cb:()=>{ this.dialogVisible = false;
                                    this.getTableData()}})
                            })
                        }
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
            formHandle(type){
                if(type=='add'){
                    this.formParams  = {}
                }else if(type=='edit'){
                    this.dialogTitle = '修改'
                }else if(type=="watch"){
                    this.dialogTitle = '查看'
                }
                this.formType = type

                this.dialogVisible = true

            },
            formDelete(data){
                this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteInventoryArea(data).then(res => {
                         SimpleMsg({result:res.success,msgType:'delete',msg:'库区',cb:()=>{ this.dialogVisible = false;
                                    this.getTableData()}})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
        },
        computed:{
            ...mapGetters([
            
            'warehouseMap',
            'chooseWarehouse',
            ]),
        },
        watch: {
            chooseWarehouse: {
                handler: function(val, oldVal){
                    if(val!=oldVal){
                        //仓库更改数据重新请求
                        this.getTableData()
                         this.warehouseMap.map(item=>{
                        if(item.warehouseNo == this.chooseWarehouse ){
                    this.warehouseName = item.warehouseName

                        }
                    })
                    }
                },
                // 深度观察监听
                // deep: true
            }
        },
        beforeMount(){
            this.getTableData()
             this.warehouseMap.map(item=>{
                        if(item.warehouseNo == this.chooseWarehouse ){
                    this.warehouseName = item.warehouseName

                        }
                    })
            // this.demo()
            // this.currentRedioChange()
        },
        activated(){
            console.log(12);
             this.warehouseMap.map(item=>{
                        if(item.warehouseNo == this.chooseWarehouse ){
                    this.warehouseName = item.warehouseName

                        }
                    })
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