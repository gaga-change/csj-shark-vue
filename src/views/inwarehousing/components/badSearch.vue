<template lang="html">
   <div class="refund-form">
      <el-form  :model="searchForm"  ref="searchForm" label-width="70px" label-position="left">
        <el-row  class="elFormItem">
          <el-col :span="6"  style="min-width:300px" v-if="searchForm.planCode!==undefined">
            <el-form-item 
              label="计划单号"  
              label-width="70px"
              prop="planCode"  >
              <el-input type="text" size="small"    placeholder="请输入计划单号"    v-model.trim="searchForm.planCode" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6"  style="min-width:300px" v-if="searchForm.providerName!==undefined">
            <el-form-item 
              label="供应商名称"  
              label-width="80px"
              prop="providerName"  >
              <el-input type="text" size="small"    placeholder="请输入供应商名称"    v-model.trim="searchForm.providerName" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6"  style="min-width:300px">
             <el-form-item 
               label="入库状态" 
               prop="orderType" 
              >
              <el-select v-model="searchForm.execState" 
              size="small"  filterable clearable placeholder="请选择入库状态" prefix-icon="el-icon-search">
                <el-option
                  v-for="item in badStatuslist"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>  
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { busiBillTypeEnum, badStatuslist } from '@/utils/enum'
export default {
  data() {
    return {
       busiBillTypeEnum,
       badStatuslist
    }
  },

  props:{
     searchForm:{
       type:Object,
       default:()=>{}
     },
     useRules:{
       type:Boolean,
       default:false
     },
  },
  
  computed: {
    ...mapGetters([
      'mapConfig',
  ])},


  methods:{

    submit(type){
       this.$refs['searchForm'].validate((valid) => {
          if (valid) {
             this.$emit('submit',this.searchForm,type)
          } else{
            return false;
          }
       })
    },

    resetForm(type){
      let data = _.cloneDeep(this.searchForm);
      let json={};
      for(let i in data){
        json[i]=''
      }
      this.$emit('submit',{...json},type)
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .refund-form{
    &::before,&::after{
      clear: both; 
      content: '';
      display: block;
    };
     .el-form-item{
       height:30px;
       margin-bottom: 30px
     }

     .card-text{
        color: rgb(51, 153, 234);
        margin-left: 12px;
        cursor: pointer;
     }


  }

  .codeNoStyle{
    float: left; 
    color: #8492a6; 
    font-size: 12px;
    width:150px;
    &:last-child{
      float: right;
    }
   }
  .providerList{
    display: flex;
    justify-content: space-between;
    >span{
      &:first-child{
        min-width: 150px;
      }
      &:nth-child(2){
        min-width: 100px;
      }
    }
}

</style>
