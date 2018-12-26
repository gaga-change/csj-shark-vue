<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="70px" label-position="left">
      <el-row :gutter="10">
        
       <el-col :span="6">
          <el-form-item label="预约单号" prop="planCode">
            <el-input type="text" size="small" v-model="searchForm.planCode" placehold="
后四位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="outbound">
          <el-form-item label="出库单号" prop="planCode">
            <el-input type="text" size="small" v-model="searchForm.orderCode" placehold="
后四位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称" label-width="85px"  prop="providerName">
            <el-input type="text" size="small" v-model="searchForm.providerName" ></el-input>
          </el-form-item>
        </el-col>
        
       <!-- <el-col :span="6">
          <el-form-item label="商品名称" label-width="85px"  prop="providerName">
            <el-input type="text" size="small" v-model="searchForm.providerName" ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
            <el-form-item label-width="70px" label="出库状态" class="postInfo-container-item" prop="execStatus">
              <el-select v-model="searchForm.execStatus" 
               filterable clearable placeholder="请选择出库状态" 
              size="small" prefix-icon="el-icon-search">
                <el-option
                  v-for="item in OutExecStatusEnum"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>  
         <el-col :span="6" v-if="outbound">
            <el-form-item label-width="70px" label="单据状态" class="postInfo-container-item" prop="orderStatus">
              <el-select v-model="searchForm.orderStatus" 
               filterable clearable placeholder="请选择出库状态" 
              size="small" prefix-icon="el-icon-search">
              <template v-for="item in OutOrderStatusEnum">
                <el-option
                  v-if="item.show"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </template>
                
              </el-select>
            </el-form-item>
        </el-col>  
        <el-col :span="6">
          <el-form-item label="货主" label-width="40px"  prop="ownerName">
            <el-input type="text" size="small" v-model="searchForm.ownerName" ></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="下单时间" label-width="70px"  prop="durationTime">
            <el-date-picker
              v-model="searchForm.durationTime"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
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
import { OutExecStatusEnum, OutOrderStatusEnum } from '@/utils/enum';  
export default  {
  name: 'SearchWarehousing',

  data() {
    return {
      searchRules: { 
      },
      searchForm:{},
      OutExecStatusEnum,
      OutOrderStatusEnum,
    }
  },
  props:{
    searchForms:{
      type:Object,
      default:() => {}
    },
    outbound:{
      type:Boolean,
      default:false,
    }
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
  