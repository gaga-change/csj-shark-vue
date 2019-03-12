<template lang="html">
   <div class="refund-form">
      <el-form  :model="searchForm"  ref="searchForm" label-width="70px" label-position="left">
        <el-row  class="elFormItem"> 
          <el-col :span="6"  style="min-width:300px" v-if="searchForm.orderCode!==undefined">
            <el-form-item 
              label="拣货单号"  
              label-width="80px"
              prop="orderCode"  >
              <el-input type="text" size="small"    placeholder="请输入拣货单号"    v-model.trim="searchForm.orderCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.outOrderCode!==undefined">
            <el-form-item 
              label="计划单号"  
              label-width="80px"
              prop="outOrderCode"  >
              <el-input type="text" size="small"    placeholder="请输入计划单号"    v-model.trim="searchForm.outOrderCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.pickOrderCode!==undefined">
            <el-form-item 
              label="拣货单号"  
              label-width="80px"
              prop="pickOrderCode"  >
              <el-input type="text" size="small"    placeholder="请输入拣货单号"    v-model.trim="searchForm.pickOrderCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.planCode!==undefined">
            <el-form-item 
              label="出库计划单号"  
              label-width="100px"
              prop="planCode"  >
              <el-input type="text" size="small"    placeholder="请输入出库计划单号"    v-model.trim="searchForm.planCode" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"  style="min-width:300px" v-if="searchForm.isCreateOrder!==undefined">
            <el-form-item 
              label="是否已生成出库单"  
              label-width="120px"
              prop="isCreateOrder"  >
                <el-radio-group v-model="searchForm.isCreateOrder">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>

          
      </el-row>  
    </el-form>
  </div>
</template>

<script>

export default {

  props:{
     searchForm:{
       type:Object,
       default:()=>{}
     },
  },
  

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
        console.log(i)
        if(i==='pageSize'){
           json[i]=10;
        } else if(i==='pageNum'){
           json[i]=1;
        } else{
          json[i]=''
        }
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
