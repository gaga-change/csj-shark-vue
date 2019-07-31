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
      label-width="80px"
    >
      <el-row>
        <el-col
          :span="8"
          v-if="'companyName' in searchForms"
        >
          <el-form-item
            label="物流公司名称"
            prop="companyName"
            label-width="90px"
          >
            <el-input
              type="text"
              size="mini"
              placeholder="请输入物流公司名称"
              v-model="searchForms.companyName"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="8"
          v-if="'warehouseAreaCode' in searchForms"
        >
          <el-form-item
            label="库区编码"
            prop="warehouseAreaCode"
          >
            <el-select
              v-model="searchForms.warehouseAreaCode"
              clearable
              placeholder="请选择库区"
              size="mini"
            >
              <el-option
                v-for="item in AtoZ"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="8"
          v-if="'isVirtual' in searchForms"
        >
          <el-form-item label="是否虚拟区">
            <el-select
              v-model="searchForms.isVirtual"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in YesOrNoEnum"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="8"
          v-if="'warehouseAreaNature' in searchForms"
        >
          <el-form-item
            label="库区性质"
            prop="warehouseAreaNature"
          >
            <el-select
              v-model="searchForms.warehouseAreaNature"
              clearable
              placeholder="请选择库区性质"
              size="mini"
            >
              <el-option
                v-for="item in WarehouseAreaNatureEnum"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="8"
          v-if="'warehouseSpaceCode' in searchForms"
        >
          <el-form-item
            label="库位编码"
            prop="warehouseSpaceCode"
          >
            <el-input
              type="text"
              size="mini"
              placeholder="请输入库位编码"
              v-model="searchForms.warehouseSpaceCode"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button
              size="mini"
              type="primary"
              @click="submitIt"
            >查询</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import {
  WarehouseAreaNatureEnum,
  YesOrNoEnum,
  AtoZ
} from '@/utils/enum'
export default {
  name: 'SearchInventory',

  data() {
    return {
      searchRules: {},
      WarehouseAreaNatureEnum,
      YesOrNoEnum,
      AtoZ
    }
  },
  props: {
    searchForms: {
      type: Object,
      default: () => { }
    },
    searchName: {
      type: String,
      default: 'logistics'
    }
  },

  methods: {
    submitIt() {
      //查询
      this.$emit('searchTrigger', this.searchForms)
    },

    resetForm() {
      //重置
      let json = {}
      for (let i in this.searchForms) {
        if (Array.isArray(this.searchForms)) {
          json[i] = []
        } else if (i === 'isVirtual') {
          json[i] = 0
        } else {
          json[i] = ''
        }
      }
      this.$emit('searchTrigger', { ...json })
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
