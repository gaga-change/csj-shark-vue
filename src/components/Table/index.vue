<template>
  <div class="ctabel TableIndexCom">
    <el-table
      ref="table"
      v-loading="loading"
      :element-loading-text="elementLoadingText"
      :element-loading-background="elementLoadingBackground"
      :data="tableData"
      :highlight-current-row="highlightCurrentRow"
      @current-change="handleCurrentRedioChange"
      :summary-method="summaryMethod"
      @selection-change="handleSelectionChange"
      :border="border"
      :show-summary="showSummary"
      size="small"
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
              :precision="item.precision || 0"
              :min="item.min || 0"
              :max="item.max || 99999999"
            ></el-input-number>
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
            <slot></slot>
            <slot
              name="edit"
              v-bind:row="scope.row"
              v-bind:index="scope.$index"
            ></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :style="paginationStyle"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="tableCurrentPage"
      :page-sizes="pageSizes"
      size="small"
      :page-size="tablePageSize"
      :layout="layout"
      v-if="total>maxTotal"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>

import _ from 'lodash';
import moment from 'moment';
import { mapGetters } from 'vuex'
import * as Enum from "@/utils/enum.js";

export default {
  props: {
    selectRows: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Function,
      default: () => true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    select: {
      type: Boolean,
      default: false,
    },
    controlName: {
      type: String,
      default: '操作'
    },
    controlWidth: {
      type: Number,
      default: 160
    },
    showControl: {
      type: Boolean,
      default: false
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
      default: () => [10, 50, 100, 500]
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
      tableConfig: [],
    }
  },
  watch: {
    selectRows(val) {
      // 重置选中
      if (val.length === 0) {
        this.$refs.table.clearSelection()
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
  created() {

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

    handleSizeChange(val) {
      this.$emit('sizeChange', val);
    },

    handleCurrentChange(val) {
      this.$emit('currentChange', val);
    },

    handleCurrentRedioChange(currentRow, oldCurrentRow) {
      this.$emit('currentRedioChange', currentRow, oldCurrentRow);
    },

    handleSelectionChange(val) {
      this.$emit('update:selectRows', val)
      this.$emit('selectionChange', val);
    },
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

