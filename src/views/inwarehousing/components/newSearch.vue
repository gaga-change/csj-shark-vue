<template lang="html">
   <div class="refund-form">
      <el-form  :model="searchForm"  ref="searchForm" label-width="70px" label-position="left">
        <el-row  class="elFormItem">

            <el-col :span="6"  style="min-width:300px" v-if="searchForm.orderType!==undefined">
             <el-form-item 
               label="单据类型" 
               prop="orderType" 
               :rules="useRules?[
                { required: true, message: '该项为必填'},
               ]:[]">
              <el-select v-model="searchForm.orderType" 
              size="small"  filterable clearable placeholder="请选择单据类型" prefix-icon="el-icon-search">
                <el-option
                  v-for="item in BusiBillTypeEnum"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
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

          
          <el-col :span="6"  style="min-width:300px" v-if="searchForm.orderCode!==undefined">
            <el-form-item 
              label="入库单号"  
              label-width="80px"
              prop="orderCode"  >
              <el-input type="text" size="small"    placeholder="请输入入库单号"    v-model.trim="searchForm.orderCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.planCode!==undefined">
            <el-form-item 
              label="计划单号"  
              label-width="70px"
              prop="planCode"  >
              <el-input type="text" size="small"    placeholder="请输入计划单号"    v-model.trim="searchForm.planCode" ></el-input>
            </el-form-item>
          </el-col>

           <el-col :span="6"  style="min-width:300px" v-if="searchForm.receiveOrderCode!==undefined">
            <el-form-item 
              label="收货单号"  
              label-width="80px"
              prop="receiveOrderCode"  >
              <el-input type="text" size="small"    placeholder="请输入收货单号"    v-model.trim="searchForm.receiveOrderCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.skuName!==undefined">
            <el-form-item 
              label="商品名称"  
              label-width="80px"
              prop="skuName"  >
              <el-input type="text" size="small"    placeholder="请输入商品名称"    v-model.trim="searchForm.skuName" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.ownerName!==undefined">
            <el-form-item 
              label="货主"  
              label-width="40px"
              prop="ownerName"  >
              <el-input type="text" size="small"    placeholder="请输入货主"    v-model.trim="searchForm.ownerName" ></el-input>
            </el-form-item>
          </el-col>

            <el-col :span="6"  style="min-width:300px" v-if="searchForm.isCreateOrder!==undefined">
            <el-form-item 
              label="是否已生成入库单"  
              label-width="120px"
              prop="isCreateOrder"  >
                <el-radio-group v-model="searchForm.isCreateOrder">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="searchForm.orderTime!==undefined">
            <el-form-item 
              label="入库日期"
              label-width="90px"
              style="width:300px"
              prop="orderTime">
                <el-date-picker
                    v-model="searchForm.orderTime"
                    type="daterange"
                    size="small"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>

          </el-col> 

      </el-row>  
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BusiBillTypeEnum } from '@/utils/enum'
export default {
  data() {
    return {
       BusiBillTypeEnum
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
