<template>
  <div class="ComponentNameClass">
    <base-list
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="checkOrderList"
      :showControl="true"
    >
      <template slot-scope="scope">
        <router-link
          :to="{path:`/qualityTesting/detail`,query:{id: scope.row.id}}"
          :style="{color:'#3399ea'}"
        >查看</router-link>
        <el-divider direction="vertical"></el-divider>
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
import { checkOrderList } from '@/api'
const tableConfig = [
  { label: '质检单号 ', prop: 'orderCode' },
  { label: '收货单号 ', prop: 'receiveOrderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
]
const searchConfig = [
  { label: '质检单号', prop: 'orderCode', type: 'input' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endtDate'], type: 'timeArea' },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      checkOrderList,
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