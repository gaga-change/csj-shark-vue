<template>
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <el-form :model="searchForm" :rules="searchRules" ref="searchForm" label-width="70px" label-position="left">
      <el-row :gutter="10">
        <el-col :span="6" v-if="searchForm.warehouseName!==undefined">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-input type="text" size="small" placeholder="请输入仓库名称"  v-model="searchForm.warehouseName" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"  v-if="searchForm.skuCode!==undefined">
          <el-form-item label="商品编码"  prop="skuCode">
            <el-input type="text" size="small" placeholder="请输入商品编码" v-model="searchForm.skuCode" ></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="6" v-if="searchForm.skuName!==undefined">
          <el-form-item label="商品名称"  prop="skuName">
            <el-input type="text" size="small" placeholder="请输入商品名称" v-model="searchForm.skuName" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="searchForm.ownerName!==undefined">
          <el-form-item label="货主名称"  prop="ownerName">
            <el-input type="text" size="small" placeholder="请输入货主名称" v-model="searchForm.ownerName" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="searchForm.warehouseSpaceCode!==undefined">
          <el-form-item label="库位编码"  prop="warehouseSpaceCode">
            <el-input type="text" size="small" placeholder="请输入库位编码" v-model="searchForm.warehouseSpaceCode" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" style="min-width:400px" v-if="searchForm.durationTime!==undefined">
          <el-form-item label="变动时间">
            <el-date-picker
              v-model="searchForm.durationTime"
              type="daterange"
              size="small"
              style="min-width:400px"
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
export default  {
  name: 'SearchInventory',

  data() {
    return {
      searchRules:{},
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
  