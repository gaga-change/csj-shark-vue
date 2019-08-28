<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="false"
      :select="true"
      @selectionChange="selectionChange"
      :selectable="() => true"
    >
      <template slot="btns">
        <el-button
          type="primary"
          @click="handleUp"
          :disabled="!selectRows.length"
        >
          上架
        </el-button>
      </template>
    </base-list>
  </div>
</template>

<script>
import { selectReceiveDetailItem } from '@/api'
import { execStatuslist } from '@/utils/enum'
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName', width: '200' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '单位', prop: 'skuUnitName' },
  { label: '包装', prop: 'packageString' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '实际收货量', prop: 'receiveQty' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: execStatuslist },
]
const searchConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuFormat' },
  { label: '容器', prop: 'trayCode' },
  { label: '上架状态', prop: 'isPut', type: 'enum', enum: execStatuslist },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: selectReceiveDetailItem,
      selectRows: [],
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 上架按钮点击 */
    handleUp() {
      this.$message('正在开发')
    }
  }
}
</script>