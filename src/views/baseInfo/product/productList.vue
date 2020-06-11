<template>
  <div class="">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="skuSelect"
      :showControl="true"
      :controlWidth="220"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="handleSet(scope.row)"
        >扩展配置</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/baseInfo/productDetail`,query:{id: scope.row.id}})"
        >查看</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="$router.push({path:`/baseInfo/productAdd/edit`,query:{id: scope.row.id}})"
        >编辑</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleDelete(scope.row)"
        >删除</el-link>
        <!-- <el-divider direction="vertical"></el-divider> -->
        <el-link
          type="primary"
          @click="selectedRow=scope.row;printTagDialogVisible=true"
        >打印到货标签</el-link>
      </template>
      <template slot="btns">
        <!-- 操作区域 -->
        <el-button
          type="primary"
          @click="$router.push('/baseInfo/productAdd')"
        >创建商品</el-button>
      </template>
    </base-list>
    <product-set-dialog
      :visible.sync="productSetDialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
    <printTagDialog
      :visible.sync="printTagDialogVisible"
      :row="selectedRow"
    />
  </div>
</template>

<script>
import ProductSetDialog from './components/productSetDialog'
import printTagDialog from './components/printTagDialog'
import { skuSelect, lotList, deleteSkuById, taticsListApi, trunoverListApi } from '@/api'
const tableConfig = [
  { label: '商品编码 ', prop: 'skuCode' },
  { label: '外部商品编码 ', prop: 'ownerSkuCode' },
  { label: '商品名称 ', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '单位', prop: 'lotAttrCode3' },
  { label: '商品分类', prop: 'lotAttrCode6' },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '外部商品编码 ', prop: 'ownerSkuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'lotAttrCode1' },
  { label: '型号', prop: 'lotAttrCode2' },
  { label: '批次', prop: 'lotId', type: 'enum', enum: '_lotEnum' },
  { label: '策略', prop: 'putPlotId', type: 'enum', enum: '_putPlot' },
  { label: '周转规则', prop: 'trunoverPlotId', type: 'enum', enum: '_putRule' },
]
export default {
  components: { ProductSetDialog, printTagDialog },
  data() {
    return {
      tableConfig,
      searchConfig,
      skuSelect,
      selectedRow: {},
      printTagDialogVisible: false,
      productSetDialogVisible: false,
    }
  },
  created() {
    this.initLot()
    this.putLotList()
    this.turnoverList()
  },
  methods: {
    initLot() {
      lotList({ pageSize: 9999, status: 0 }).then(res => {
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
    putLotList() {
      taticsListApi({ pageSize: 9999, plotStatus: 0 }).then(res => {
        if (!res) return
        this.$store.commit('ADD_MAP', {
          name: '_putPlot',
          keyValue: (res.data.list || []).map(v => {
            return {
              name: v.plotName,
              value: v.id,
            }
          })
        })
      })
    },
    turnoverList() {
      trunoverListApi({ pageSize: 9999, plotStatus: 0 }).then(res => {
        if (!res) return
        this.$store.commit('ADD_MAP', {
          name: '_putRule',
          keyValue: (res.data.list || []).map(v => {
            return {
              name: v.plotName,
              value: v.id,
            }
          })
        })
      })
    },
    /** 删除 */
    handleDelete(row) {
      this.$apiConfirm(`是否确定删除【${row.skuName}】？`, () => deleteSkuById({ id: row.id })).then(res => {
        if (!res) return
        this.$message.success('操作成功！')
        this.getTableData()
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
