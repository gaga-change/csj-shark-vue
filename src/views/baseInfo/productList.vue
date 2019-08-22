<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
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
    <product-set-dialog
      :visible.sync="productSetDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
  </div>
</template>

<script>
import ProductSetDialog from './components/productSetDialog'
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
  components: { ProductSetDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      skuSelect,
      selectedRow: {},
      productSetDialogVisible: false,
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 扩展配置 按钮点击 */
    handleSet(row) {
      this.selectedRow = row
      this.$nextTick(() => {
        this.productSetDialogVisible = true
      })
    }
  }
}
</script>