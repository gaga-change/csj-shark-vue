<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForms" :rules="searchRules" ref="searchForms" label-width="70px" label-position="left">
      <el-row :gutter="10">
        <el-col :span="6"  v-if="'busiBillType' in  searchForms">
          <el-form-item label-width="70px" label="单据类型" class="postInfo-container-item">
            <el-select v-model="searchForms.busiBillType" 
             filterable clearable placeholder="请选择单据类型" 
            size="small" prefix-icon="el-icon-search">
            <template v-for="item in busiBillTypeEnum">
              <el-option
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </template>
            </el-select>
          </el-form-item>
        </el-col>
       <el-col :span="6">
          <el-form-item label="计划单号"  prop="planCode">
            <el-input type="text" size="small" placeholder="请输入计划单号" v-model="searchForms.planCode" placehold="
后四位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="打印状态" >
            <el-select v-model="searchForms.isPrint" 
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
import { OutExecStatusEnum, OutOrderStatusEnum,outboundOrderStatus, busiBillTypeEnum, printState} from '@/utils/enum';  
const BusiBillTypeEnumFilter = busiBillTypeEnum.filter(item => item.type.includes('out'))
export default  {
  name: 'SearchWarehousing',

  data() {
    return {
      searchRules: { 
      },
      OutExecStatusEnum,
      OutOrderStatusEnum,
      outboundOrderStatus,
      busiBillTypeEnum:BusiBillTypeEnumFilter,
      printState
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
  