<template>
  <el-card
    class="simpleCard"
    shadow="never"
    body-style="padding:12px"
  >
    <el-form
      :model="searchForms"
      :rules="searchRules"
      ref="searchForm"
      label-width="70px"
      label-position="left"
    >
      <el-row :gutter="10">
        <el-col
          :span="6"
          v-if="searchForms.warehouseName!==undefined"
        >
          <el-form-item
            label="仓库名称"
            prop="warehouseName"
          >
            <el-input
              type="text"
              size="small"
              placeholder="请输入仓库名称"
              v-model="searchForms.warehouseName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          v-if="searchForms.skuCode!==undefined"
        >
          <el-form-item
            label="商品编码"
            prop="skuCode"
          >
            <el-input
              type="text"
              size="small"
              placeholder="请输入商品编码"
              v-model="searchForms.skuCode"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="6"
          v-if="searchForms.skuName!==undefined"
        >
          <el-form-item
            label="商品名称"
            prop="skuName"
          >
            <el-input
              type="text"
              size="small"
              placeholder="请输入商品名称"
              v-model="searchForms.skuName"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="6"
          v-if="searchForms.ownerName!==undefined"
        >
          <el-form-item
            label="货主名称"
            prop="ownerName"
          >
            <el-input
              type="text"
              size="small"
              placeholder="请输入货主名称"
              v-model="searchForms.ownerName"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="6"
          v-if="searchForms.warehouseSpaceCode!==undefined"
        >
          <el-form-item
            label="库位编码"
            prop="warehouseSpaceCode"
          >
            <el-input
              type="text"
              size="small"
              placeholder="请输入库位编码"
              v-model="searchForms.warehouseSpaceCode"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          style="min-width:400px"
          v-if="searchForms.durationTime!==undefined"
        >
          <el-form-item label="变动时间">
            <el-date-picker
              v-model="searchForms.durationTime"
              type="daterange"
              size="small"
              style="min-width:400px"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          v-if="searchForms.busiBillType!==undefined"
        >
          <el-form-item
            label="变动类型"
            prop="busiBillType"
          >
            <el-select
              v-model="searchForms.busiBillType"
              filterable
              clearable
              placeholder="请选择入库状态"
              size="small"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in busiBillTypeEnum"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button
              type="primary"
              size="small"
              @click="submitIt"
            >查询</el-button>
            <el-button
              type="primary"
              size="small"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { busiBillTypeEnum } from '@/utils/enum'
export default {
  name: 'SearchInventory',

  data() {
    return {
      searchRules: {},
      busiBillTypeEnum
    }
  },
  props: {
    searchForms: {
      type: Object,
      default: () => { }
    },
  },
  methods: {
    submitIt() {//查询
      this.$emit('searchTrigger', this.searchForms)
    },
    resetForm() {//重置
      let json = {};
      for (let i in this.searchForms) {
        if (Array.isArray(this.searchForms)) {
          json[i] = []
        } else {
          json[i] = ''
        }
      }
      this.$emit('searchTrigger', json)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.codeNoStyle {
  float: left;
  color: #8492a6;
  font-size: 12px;
  width: 150px;
  &:last-child {
    float: right;
  }
}
</style>
  