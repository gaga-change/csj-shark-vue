<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="70px" label-position="left">
      <el-row :gutter="10">
        
       <el-col :span="6">
          <el-form-item label="计划单号" prop="planCode">
            <el-input type="text" size="small" v-model="searchForm.planCode" placehold="
后四位"></el-input>
          </el-form-item>
        </el-col>

         <el-col :span="6">
            <el-form-item label-width="70px" label="物流公司" class="postInfo-container-item" prop="logisticsComCode">
              <el-select v-model="searchForm.logisticsComCode" 
                clearable placeholder="请选择物流公司" 
                size="small">
                <el-option
                  v-for="item in deliverCompany"
                  :key="item.companyCode"
                  :label="item.companyName"
                  :value="item.companyCode">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>  
        <el-col :span="6">
            <el-form-item label-width="70px" label="登记状态" class="postInfo-container-item" prop="register">
              <el-select v-model="searchForm.register" 
               clearable placeholder="请选择登记状态" 
              size="small" >
                <el-option
                  v-for="item in registerStatusEnum"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
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
              style="width:400px"
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
import { ExecStatusEnum,registerStatusEnum } from '@/utils/enum';  
export default  {
  name: 'SearchWarehousing',

  data() {
    return {
      searchRules: { 
      },
      searchForm:{},
      ExecStatusEnum,
      registerStatusEnum,
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
    },
    deliverCompany:{
      type:Array,
      default:()=>[]
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
  