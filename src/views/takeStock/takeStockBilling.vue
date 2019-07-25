<template>
  <div>
    <div>
      <el-button
        type="primary"
        size="small"
        @click="showChooseProdDialog"
      >
        获取盘点商品
      </el-button>
    </div>
    <div>
      <base-table
        :config="takeStockSelectProductTableConfig"
        :tableData="tableData"
      />
    </div>
    <select-product
      :visible.sync="selectProductVisible"
      :selectData.sync="tableData"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { takeStockSelectProductTableConfig } from './components/config'
import selectProduct from './components/selectProduct'
export default {
  components: { selectProduct, BaseTable },
  data() {
    return {
      takeStockSelectProductTableConfig,
      selectProductVisible: true,
      tableData: [],
    }
  },
  created() {

  },
  methods: {
    /** 展示选择商品弹窗 */
    showChooseProdDialog() {
      this.selectProductVisible = true
    }
  },
}
</script>
