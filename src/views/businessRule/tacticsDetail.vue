<template>
  <div v-loading="lotDetailLoading">
    <detail-item
      :config="detailConfig"
      :detail="detail"
    ></detail-item>
    <div class="mt15"></div>
    <detail-item
      :config="titleConfig"
    ></detail-item>
    <div class="mt15"></div>
    <base-table
      :config="tableConfig"
      :showIndex="true"
      :data="propItems"
      :tableStyle="'width:600px'"
    ></base-table>
  </div>
</template>

<script>
import { taticsDetailApi } from '@/api'
const detailConfig = [
  { label: '策略描述', prop: 'plotName' },
  { label: '上架库区', prop: 'warehouseAreaName' },
]
const titleConfig = [
  { label: '策略规则' }
]
const tableConfig = [
  { label: '规则名称', prop: 'plotRuleName' },
  { label: '执行顺序', prop: 'serialNumber' },
  { label: '是否开启', prop: 'plotStatus', dom: v =>  v === 0 ? '禁用' : '启用' },
]
export default {
  data() {
    return {
      tableConfig,
      detailConfig,
      titleConfig,
      lotDetailLoading: true,
      detail: {},
      propItems: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.lotDetailLoading = false
      taticsDetailApi(this.$route.query.id).then(res => {
        this.lotDetailLoading = false
        if (!res) return
        const { basicPutPlotDO: detail, basicPutPlotDetailDOList: ruleList, basicWarehouseAreaDOList: areaList } = res.data
        const codeArr = detail.warehouseAreaCode || []
        detail.warehouseAreaName = codeArr.map(
          code => {
            const area = areaList.find(area => area.warehouseAreaCode === code)
            return area.warehouseAreaName
          }
        ).join(',')
        this.detail = detail
        this.propItems = ruleList
      })
    }
  }
}
</script>