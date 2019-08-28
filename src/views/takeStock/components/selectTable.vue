<template>
  <div class="ctabel TableIndexCom">
    <el-table
      ref="table"
      v-loading="api ? selfLoading: loading"
      :element-loading-text="elementLoadingText"
      :element-loading-background="elementLoadingBackground"
      :data="tableData"
      :highlight-current-row="highlightCurrentRow"
      @current-change="handleCurrentRedioChange"
      :summary-method="summaryMethod"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      :border="border"
      :show-summary="showSummary"
      size="mini"
      :style="tableStyle"
    >
      <el-table-column
        v-if="select"
        type="selection"
        width="55"
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        :index="1"
      ></el-table-column>
      <template v-for="item in tableConfig">
        <el-table-column
          v-if="item.edit"
          :formatter="item.formatter"
          :fixed="item.fixed"
          :type="item.columnType"
          :width="item.width"
          :key="item.lable"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="item.inputType==='number'"
              size="mini"
              v-model="scope.row[item.prop]"
              controls-position="right"
              :disabled="scope.row['inputTypeNumberDisabled']"
              :precision="item.precision || 0"
              @change="val => handleInputNumberChange(scope.row, scope.$index, item, val)"
              :min="item.min || 0"
              :max="item.max || 99999999"
            ></el-input-number>
            <el-select
              v-if="item.inputType==='select'"
              v-model="scope.row[item.prop]"
              placeholder="请选择"
            >
              <el-option
                v-for="(v, i) in Enum[item.type]"
                :key="i"
                :label="v.name"
                :value="v.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :formatter="item.formatter"
          :fixed="item.fixed"
          :type="item.columnType"
          :width="item.width"
          :key="item.lable"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        >
        </el-table-column>
      </template>
      <el-table-column
        v-if="showControl"
        :width="controlWidth"
        fixed="right"
        :label="controlName"
      >
        <template slot-scope="scope">
          <div>
            <slot
              v-bind:row="scope.row"
              v-bind:index="scope.$index"
            ></slot>
            <slot
              name="edit"
              v-bind:row="scope.row"
              v-bind:index="scope.$index"
            ></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template>
      <el-pagination
        :style="paginationStyle"
        @size-change="handleSelfSizeChange"
        @current-change="handleSelfCurrentChange"
        :current-page.sync="selfCurrentPage"
        :page-sizes="pageSizes"
        size="mini"
        :page-size="selfPageSize"
        :layout="layout"
        v-if="api"
        :total="selfTotal"
      ></el-pagination>
      <el-pagination
        :style="paginationStyle"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="tableCurrentPage"
        :page-sizes="pageSizes"
        size="mini"
        :page-size="tablePageSize"
        :layout="layout"
        v-else-if="total>maxTotal"
        :total="total"
      ></el-pagination>
    </template>
  </div>
</template>

<script>

import _ from 'lodash';
import moment from 'moment';
import { mapGetters } from 'vuex'
import * as Enum from "@/utils/enum.js";

export default {
  props: {
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
    /** 表格api接口 - 搜索条件 */
    searchParams: {
      type: Object,
      default: () => { }
    },
    select: {
      type: Boolean,
      default: false,
    },
    selectRows: {
      type: Array,
      default: () => []
    },
    /** 跨分页多选 */
    selectTotal: {
      type: Boolean,
      default: false
    },
    /** 跨分页多选 - 唯一键 */
    selectTotalKey: {
      type: String,
      default: 'id'
    },
    /** 跨分页多选 - 最大数量限制。 */
    selectTotalMax: {
      type: Number,
      default: 50
    },
    selectable: {
      type: Function,
      default: () => true
    },
    showIndex: {
      type: Boolean,
      default: false
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
    loading: {
      type: Boolean,
      default: false
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    useRadio: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      defalut: false
    },
    summaryMethod: {
      type: Function,
      default: () => { }
    },
    tableData: {
      type: Array,
      default: () => []
    },
    config: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    },
    pageSize: {
      type: Number,
      default: 10
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    maxTotal: {
      type: Number,
      default: 10
    },
    elementLoadingText: {
      type: String,
      default: "加载中"
    },
    elementLoadingBackground: {
      type: String,
      default: "rgba(255, 255, 255, 0.5)"
    },
    border: {
      type: Boolean,
      default: true
    },
    tableStyle: {
      type: String,
      default: "width: 100%"
    },
    paginationStyle: {
      type: String,
      default: "marginTop:16px"
    },
    total: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      Enum,
      tableConfig: [],
      selfTotal: 0,
      selfPageSize: 10,
      selfCurrentPage: 1,
      selfLoading: true,
    }
  },
  watch: {
    selectRows(val, oldVal) {
      // 重置选中
      if (val.length === 0) {
        this.$refs.table.clearSelection()
      } else if (this.selectTotal) {
        this.$refs.table.clearSelection()
        this.selectTotalKey && val.forEach(checkRow => {
          let row = this.tableData.find(v => v[this.selectTotalKey] === checkRow[this.selectTotalKey])
          row && this.$refs['table'].toggleRowSelection(row, true)
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ]),
    tablePageSize: {
      get: function () {
        return this.pageSize
      },
      set: function () {

      }
    },
    tableCurrentPage: {
      get: function () {
        return this.currentPage
      },
      set: function () {

      }
    },
  },
  mounted() {
    if (this.api) {
      this.fetchData()
    }
  },
  beforeMount() {
    let tableConfig = _.cloneDeep(this.config);
    for (let i in tableConfig) {
      if (tableConfig[i].type) {
        if (tableConfig[i].useApi) {
          tableConfig[i].formatter = (row, column, cellValue, index) => this.mapConfig[tableConfig[i].type] && this.mapConfig[tableConfig[i].type].find(v => v.key == cellValue) && this.mapConfig[tableConfig[i].type].find(v => v.key == cellValue).value || cellValue
        } else if (tableConfig[i].useLocalEnum) {
          let item = { ...tableConfig[i] }
          tableConfig[i].formatter = (row, column, cellValue, index) => {
            let res = cellValue
            if (!item.type) {
              console.error('需要 【type】字段')
            } else if (!Enum[item.type]) {
              console.error(`枚举列表中为找到【${item.type}】`)
            } else {
              let temp = Enum[item.type].find(v => v.value == cellValue)
              if (temp) {
                res = temp.name
              } else {
                console.error(`枚举异常, 在【${item.type}】下未找到相应枚举值【${cellValue}】`)
              }
            }
            return res
          }
        } else {
          switch (tableConfig[i].type) {
            case 'time': tableConfig[i].formatter = (row, column, cellValue, index) => cellValue ? moment(cellValue).format(tableConfig[i].format || 'YYYY-MM-DD HH:mm:ss') : ''; break;
            case 'Boolean': tableConfig[i].formatter = (row, column, cellValue, index) => cellValue ? '是' : '否'; break;
            case 'index': tableConfig[i].formatter = (row, column, cellValue, index) => (this.pageSize) * (this.currentPage - 1) + index + 1; break;
            case 'toFixed': tableConfig[i].formatter = (row, column, cellValue, index) => cellValue && Number(Number(cellValue).toFixed(2)); break;
            case 'files': tableConfig[i].formatter = (row, column, cellValue, index) => {
              let files = row.files;
              if (!files || files.length < 1) {
                return ''
              }
              return <el-dropdown>
                <span class="el-dropdown-link">
                  查看附件<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  {
                    files.map((v, i) => <el-dropdown-item>
                      <a class="el-dropdown-link" target="blank" href={v.path}>{v.name || `附件${i + 1}`}</a>
                    </el-dropdown-item>)
                  }
                </el-dropdown-menu>
              </el-dropdown>
            }; break;

            case 'outgoing+reply': tableConfig[i].formatter = (row, column, cellValue, index) => {
              if (row.isCreate) {
                return <div>
                  <router-link to={{ path: '/outgoing/plan-detail', query: { planCode: row.planCode } }} style={{ color: '#3399ea', margin: '0 10px 0 0' }}>查看</router-link>
                  <router-link to={{ path: '/reply/newreceiptorder', query: { id: row.id } }} style={{ color: '#3399ea' }}>创建回单</router-link>
                </div>
              } else {
                return <div>
                  <router-link to={{ path: '/outgoing/plan-detail', query: { planCode: row.planCode } }} style={{ color: '#3399ea', margin: '0 10px 0 0' }}>查看</router-link>
                </div>
              }
            }; break;

          }
        }
      } else if (tableConfig[i].dom) {
        tableConfig[i].formatter = tableConfig[i].dom
      } else if (tableConfig[i].linkTo) {
        tableConfig[i].formatter = (row, column, cellValue, index) => {
          let json = {};
          tableConfig[i].query.forEach(item => {
            json[item.key] = row[item.value]
          })
          return <router-link to={{ path: tableConfig[i].linkTo, query: json }} style={{ color: '#3399ea' }}>{tableConfig[i].linkText ? tableConfig[i].linkText : cellValue}</router-link>
        }

      } else {
        tableConfig[i].formatter = (row, column, cellValue, index) => cellValue !== undefined && cellValue !== null && cellValue !== '' ? cellValue : ''
      }
    }
    this.tableConfig = tableConfig;
  },
  methods: {
    /** 输入框内容改变 */
    handleInputNumberChange(row, index, item, value) {
      this.$emit('inputNumberChange', { row, index, item, value })
    },
    fetchData() {
      this.selfLoading = true
      return this.api({
        pageNum: this.selfCurrentPage,
        pageSize: this.selfPageSize,
        ...this.searchParams
      }).then(res => {
        this.selfLoading = false
        if (!res) return
        let data = null
        let total = null
        if (this.parseData) {
          let obj = this.parseData(res)
          data = obj.data
          total = obj.total
        } else {
          data = res.data.list || []
          total = res.data.total
        }
        let recoverSelectRows = []
        if (this.selectTotal) {
          // 需要恢复选中状态
          let keys = this.selectRows.map(v => v[this.selectTotalKey]).join(',') + ','
          data.forEach(v => {
            if (~keys.indexOf(v[this.selectTotalKey])) {
              recoverSelectRows.push(v)
            }
          })
        }
        this.$emit('update:tableData', data)
        this.selectTotal && this.$nextTick(() => {
          recoverSelectRows.forEach(v => {
            this.$refs['table'].toggleRowSelection(v, true)
          })
        })
        this.selfTotal = total
      })
    },
    handleSizeChange(val) {
      this.$emit('sizeChange', val)
    },
    handleSelfSizeChange(val) {
      this.selfPageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    },
    handleSelfCurrentChange(val) {
      this.selfCurrentPage = val
      this.fetchData()
    },
    handleCurrentRedioChange(currentRow, oldCurrentRow) {
      this.$emit('currentRedioChange', currentRow, oldCurrentRow)
    },
    handleSelect(selection, row) {
      // 如果 selectTotal= false, 走 handleSelectionChange
      if (!this.selectTotal) return
      let temp = [...this.selectRows]
      let selected = selection[selection.length - 1] === row
      row = JSON.parse(JSON.stringify(row))
      if (selected) {
        temp.push(row)
      } else {
        temp.splice(temp.findIndex(v => v[this.selectTotalKey] === row[this.selectTotalKey]), 1)
      }
      if (temp.length > this.selectTotalMax) {
        this.$message(`最多选取${this.selectTotalMax}条,当前已超出，将自动删除第一条选中内容！`)
        let delRow = temp.shift()
        let row = this.tableData.find(v => v[this.selectTotalKey] === delRow[this.selectTotalKey])
        row && this.$refs['table'].toggleRowSelection(row, false)
      }
      this.$emit('update:selectRows', temp)
    },
    handleSelectAll(selection) {
      // 如果 selectTotal= false, 走 handleSelectionChange
      if (!this.selectTotal) return
      let temp = [...this.selectRows]
      if (selection.length) { // 全选
        this.tableData.forEach(row => {
          // 在已选的总库中，添加当前列表中的项
          if (!temp.find(v => v[this.selectTotalKey] === row[this.selectTotalKey])) {
            temp.push(row)
          }
        })
      } else { // 全不选
        this.tableData.forEach(row => {
          // 在已选的总库中，剔除当前列表中的项
          let index = temp.findIndex(v => v[this.selectTotalKey] === row[this.selectTotalKey])
          if (~index) {
            temp.splice(index, 1)
          }
        })
      }
      if (temp.length > this.selectTotalMax) {
        this.$message(`最多选取${this.selectTotalMax},当前已超出，将自动删除前${temp.length - this.selectTotalMax}条选中内容！`)
        let delRows = temp.splice(0, temp.length - this.selectTotalMax)
        delRows.forEach(delRow => {
          let row = this.tableData.find(v => v[this.selectTotalKey] === delRow[this.selectTotalKey])
          row && this.$refs['table'].toggleRowSelection(row, false)
        })
      }
      this.$emit('update:selectRows', temp)
    },
    handleSelectionChange(val) {
      // 如果 selectTotal= true, 走handleSelect
      if (this.selectTotal) return
      this.$emit('update:selectRows', val)
      this.$emit('selectionChange', val)
    },
    setCurrentRow(row) {
      // this.$refs['table'].setCurrentRow()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.TableIndexCom {
  td {
    word-break: break-word;
  }
}
.ctabel {
  width: 100%;
  .el-radio__label {
    display: none;
  }
}
</style>

