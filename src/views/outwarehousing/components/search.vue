<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForms" :rules="searchRules" ref="searchForms" label-width="70px" label-position="left">
      <el-row :gutter="10">
        
       <el-col :span="6">
          <el-form-item label="计划单号"  prop="planCode">
            <el-input type="text" size="small" placeholder="请输入计划单号" v-model="searchForms.planCode" placehold="
后四位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="outbound">
          <el-form-item label="出库单号"   prop="planCode">
            <el-input type="text" size="small"  placeholder="请输入出库单号" v-model="searchForms.orderCode" placehold="
后四位"></el-input>
          </el-form-item>
        </el-col>
 
        <el-col :span="6">
          <el-form-item label="客户/供应商" label-width="80px"  prop="ownerName">
            <el-input type="text" size="small" placeholder="请输入货主"  v-model="searchForms.ownerName" ></el-input>
          </el-form-item>
        </el-col>
         
          <el-col :span="6"  v-if="'execStatus' in  searchForms">
            <el-form-item label-width="70px" label="出库状态" class="postInfo-container-item" prop="execStatus">
              <el-select v-model="searchForms.execStatus" 
               filterable clearable placeholder="请选择出库状态" 
              size="small" prefix-icon="el-icon-search">
              <template v-for="item in OutExecStatusEnum">
                <el-option
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </template>
              </el-select>
            </el-form-item>
        </el-col> 

          <el-col :span="6"  v-if="'orderStatus' in  searchForms">
            <el-form-item label-width="70px" label="单据状态" class="postInfo-container-item" prop="orderStatus">
              <el-select v-model="searchForms.orderStatus" 
               filterable clearable placeholder="请选择出库状态" 
              size="small" prefix-icon="el-icon-search">
              <template v-for="item in outboundOrderStatus">
                <el-option
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </template>
              </el-select>
            </el-form-item>
        </el-col> 


         <el-col :span="12" v-if="'durationTime' in  searchForms">
          <el-form-item :label="searchForms.text||'下单时间'" label-width="70px"  prop="durationTime">
            <el-date-picker
              v-model="searchForms.durationTime"
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
import { OutExecStatusEnum, OutOrderStatusEnum,outboundOrderStatus} from '@/utils/enum';  
export default  {
  name: 'SearchWarehousing',

  data() {
    return {
      searchRules: { 
      },
      OutExecStatusEnum,
      OutOrderStatusEnum,
      outboundOrderStatus,
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
  

  
  methods:{

    submitIt(){//查询
      this.$emit('searchTrigger',this.searchForms)
    },

    resetForm() {
       this.$emit('resetSearch') 
    },
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
  