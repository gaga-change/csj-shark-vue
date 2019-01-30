<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="90px" label-position="left">
      <el-row >

        <el-col :span="6" v-if="searchForm.companyName!==undefined">
          <el-form-item label="物流公司名称" prop="companyName">
            <el-input type="text" size="small"  placeholder="请输入物流公司名称" v-model="searchForm.companyName" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="searchForm.warehouseAreaCode!==undefined">
           <el-form-item label="库区编码"  prop="warehouseAreaCode"  :rules="[
              { required: true, message: '请选择库区'},
             ]">
                   <el-select v-model="searchForm.warehouseAreaCode" 
                        clearable placeholder="请选择库区" 
                        size="small">
                        <el-option
                        v-for="item in AtoZ"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
        </el-col>

          <el-col :span="6" v-if="searchForm.isVirtual!==undefined">
           <el-form-item label="是否虚拟区" label-width="90px" >
                  <el-select v-model="searchForm.isVirtual" 
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
          </el-col>

          <el-col :span="6" v-if="searchForm.warehouseAreaNature!==undefined">
              <el-form-item label="库区性质" prop="warehouseAreaNature">
                    <el-select v-model="searchForm.warehouseAreaNature" 
                          clearable placeholder="请选择库区性质" 
                          size="small">
                          <el-option
                          v-for="item in WarehouseAreaNatureEnum"
                          :key="item.name"
                          :label="item.name"
                          :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
          </el-col>

        <el-col :span="6" v-if="searchForm.warehouseSpaceCode!==undefined">
          <el-form-item label="库位编码" prop="warehouseSpaceCode">
            <el-input type="text" size="small"  placeholder="请输入库位编码" v-model="searchForm.warehouseSpaceCode" ></el-input>
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
 import { WarehouseAreaNatureEnum, YesOrNoEnum, WarehouseAreaStatusEnum,AtoZ } from '@/utils/enum'
export default  {
  name: 'SearchInventory',

  data() {
    return {
      searchRules: { 
      },
      searchForm:{},
      WarehouseAreaNatureEnum,
      YesOrNoEnum,
      WarehouseAreaStatusEnum,
      AtoZ
    }
  },
  props:{
    searchForms:{
      type:Object,
      default:() => {}
    },
    searchName:{
      type:String,
      default:'logistics'
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
  