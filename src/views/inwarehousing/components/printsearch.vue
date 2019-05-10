<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="70px" label-position="left">
      <el-row>
        <el-col :span="6">
          <el-form-item label="单据类型" >
            <el-select v-model="searchForm.busiBillType" 
               filterable clearable placeholder="请选择" 
              size="small" prefix-icon="el-icon-search">
                <el-option
                  v-for="item in BusiBillTypeEnum"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划单号" >
            <el-input type="text" size="small" v-model="searchForm.planCode" placeholder="请输入计划单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="打印状态" >
            <el-select v-model="searchForm.isPrint" 
               filterable clearable placeholder="请选择" 
              size="small" prefix-icon="el-icon-search">
                <el-option
                  v-for="item in printState"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
            <el-form-item label-width="0">
              <el-button type="primary"  size="small"  @click="submitIt">查询</el-button>
              <el-button type="primary"  size="small" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
      </el-row>  
      
    </el-form>
  </el-card>
</template>

<script>
// import {  InvoiceType  as invoicetype  } from '@/utils'
import { printState, BusiBillTypeEnum } from '@/utils/enum';  
const BusiBillTypeEnumFilter = BusiBillTypeEnum.filter(item => item.type.includes('in')) 
export default  {
  name: 'SearchWarehousing',

  data() {
    return {
      searchRules: { 
      },
      searchForm:{
        
      },
      printState,
      BusiBillTypeEnum: BusiBillTypeEnumFilter
    }
  },
  props:{
    searchForms:{
      type:Object,
      default:() => {}
    },
    
    inbound:{
      type:Boolean,
      default:false
    },
    
  },
  
  created(){
    this.searchForm = {...this.searchForms}
  },

  
  methods:{
    submitIt(){//查询
      this.$emit('searchTrigger',this.searchForm)
    },
    resetForm(){//重置
      this.searchForm = {}
      this.$emit('resetSearch',this.searchForm)
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .codeNoStyle{
    float: left; 
    color: #8492a6; 
    font-size: 12px;
    width:150px;
    &:last-child{
      float: right;
    } 
  }
</style>
  