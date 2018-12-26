<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="90px" label-position="left">
      <el-row :gutter="10">
        
        <el-col :span="6">
          <el-form-item label="物流公司名称" prop="companyName">
            <el-input type="text" size="small" v-model="searchForm.companyName" ></el-input>
          </el-form-item>
        </el-col>
      <!-- </el-row>  
       <el-row :gutter="10"> -->
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
export default  {
  name: 'SearchInventory',

  data() {
    return {
      searchRules: { 
      },
      searchForm:{},
    }
  },
  props:{
    searchForms:{
      type:Object,
      default:() => {}
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
  