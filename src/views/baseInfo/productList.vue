<template>
  <div class="">
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
import { skuSelect, lotList } from '@/api'
const tableConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '商品分类', prop: 'lotAttrCode6' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '批次', prop: 'lotId', type: 'enum', enum: '_lotEnum' },
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
  created() {
    this.initLot()
  },
  methods: {
    initLot() {
      lotList({ pageSize: 9999 }).then(res => {
        if (!res) return
        this.$store.commit('ADD_MAP', {
          name: '_lotEnum',
          keyValue: (res.data.list || []).map(v => {
            return {
              name: v.lotName,
              value: v.id,
            }
          })
        })
      })
    },
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 扩展配置 按钮点击 */
    handleSet(row) {
      this.selectedRow = row
      this.productSetDialogVisible = true
    }
  }
}
</script>