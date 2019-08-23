<template>
  <div
    class="BaseListComponent"
    :class="{red: development}"
  >
    <div>
      <search-form2
        :config="searchConfig"
        @search="handleSearch"
        :labelWidth="labelWidth"
      >
      </search-form2>
    </div>
    <div class="f12">
      <slot name="btns"></slot>
    </div>
    <div class="mt15">
      <base-table2
        ref='baseTable'
        :api="api"
        :parseData="parseData"
        :config="tableConfig"
        :data.sync="tableData"
        :searchParams="searchParams"
        :showControl="showControl"
        :controlName="controlName"
        :controlWidth="controlWidth"
        :select="select"
        @selectionChange="selectionChange"
        :selectable="selectable"
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
    /** 附加的搜索条件 */
    appendSearchParams: {
      type: Object,
      default: () => ({})
    },
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
    /** 表格api接口 -  解析接口返回的数据。 */
    parseData: {
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
    /** 是否可选 */
    select: {
      type: Boolean,
      default: false,
    },
    /** 可选条件 */
    selectable: {
      type: Function,
      default: () => true
    },
  },
  data() {
    return {
      development: false,
      tableData: [],
      searchParams: { ...this.appendSearchParams },
      selectRows: [],
      rowNow: {},
    }
  },
  created() {
    if (process.env.NODE_ENV === "development") {
      this.development = true
    }
  },
  methods: {
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params, ...this.appendSearchParams }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$emit('search', { ...obj })
        this.$refs['baseTable'].fetchData().then(callback)
      })
    },
    /** 刷新列表 */
    fetchData(callback) {
      this.$refs['baseTable'].fetchData().then(callback)
    },
    /** 多选选择 */
    selectionChange(val) {
      this.$emit('selectionChange', val)
    }
  }
}
</script>

<style lang="scss">
.BaseListComponent {
  &.red {
    .el-card {
      border: 1px solid#f56c6c6e !important;
    }
  }
}
</style>