<template>
  <div class="ComponentNameClass">
    <base-list
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="skuSelect"
      :showControl="true"
    >
      <template slot-scope="scope">
        <router-link
          :to="{path:`/qualityTesting/detail`,query:{id: scope.row.id}}"
          :style="{color:'#3399ea'}"
        >查看</router-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新建质检记录
        </el-button>
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
    /** 新建质检记录 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    }
  }
}
</script>