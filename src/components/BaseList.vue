<template>
  <div class="ComponentNameClass">
    <div>
      <search-form
        :config="searchConfig"
        @search="handleSearch"
        :labelWidth="labelWidth"
      >
      </search-form>
    </div>
    <div class="f12">
      <slot name="btns"></slot>
    </div>
    <div class="mt15">
      <base-table2
        ref='baseTable'
        :api="api"
        :config="tableConfig"
        :tableData.sync="tableData"
        :searchParams="searchParams"
        :showControl="showControl"
        :controlName="controlName"
        :controlWidth="controlWidth"
      >
        <template slot-scope="scope">
          <slot
            v-bind:row="scope.row"
            v-bind:index="scope.index"
          ></slot>
        </template>
      </base-table2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchConfig: {
      type: Array,
      default: () => []
    },
    /** 搜索 label宽度 */
    labelWidth: {
      type: Number,
      default: 80
    },
    tableConfig: {
      type: Array,
      default: () => []
    },
    /** 表格api接口 */
    api: {
      type: Function,
      default: null,
    },
    /** 显示 【操作】 */
    showControl: {
      type: Boolean,
      default: false
    },
    /** 显示 【操作】 - 更改名称 */
    controlName: {
      type: String,
      default: '操作'
    },
    /** 显示 【操作】 - 宽度 */
    controlWidth: {
      type: Number,
      default: 160
    },
  },
  data() {
    return {
      tableData: [],
      searchParams: {},
      selectRows: [],
      rowNow: {},
    }
  },
  methods: {
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    },
    /** 刷新列表 */
    fetchData(callback) {
      this.$refs['baseTable'].fetchData().then(callback)
    }
  }
}
</script>