<template>
  <div class="ComponentNameClass">
    <base-list
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="skuSelect"
      :showControl="true"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleSet(scope.row)"
        >扩展配置</el-link>
      </template>
      <template slot="btns">
        <!-- 操作区域 -->
      </template>
    </base-list>
  </div>
</template>

<script>
import { skuSelect } from '@/api'
const tableConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格型号', prop: 'lotAttrCode1' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '商品分类', prop: 'lotAttrCode6' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode', type: 'input' },
  { label: '商品名称', prop: 'skuName', type: 'input' },
  { label: '规格型号', prop: 'lotAttrCode1', type: 'input' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      skuSelect,
      selectRows: [],
      rowNow: {},
    }
  },
  methods: {
    /** 扩展配置 按钮点击 */
    handleSet(row) {
      this.$message('功能正在开发...')
    }
  }
}
</script>