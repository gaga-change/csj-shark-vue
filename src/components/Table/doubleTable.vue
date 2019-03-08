<template>
  <div class="ctabel">
    <el-table
      v-loading="loading"
      :element-loading-text="elementLoadingText"
      :element-loading-background="elementLoadingBackground"
      :data="tableDataEditable"
      :highlight-current-row="highlightCurrentRow"
      @current-change="handleCurrentRadioChange"
      @expand-change="expandChangeItem"
      :summary-method="summaryMethod"
      :border="border"
      :row-key="expandKey"
      :expand-row-keys="expands"
      :show-summary="showSummary"
      size="small"
      :style="tableStyle"
      @select="handleParentSelection"
      @select-all="handleParentSelection"
    >
      <el-table-column type="selection" width="55" v-if="canSelect"></el-table-column>
      <template v-if="childDataName">
        <el-table-column type="expand">
          <template
            slot-scope="childTable"
            v-if="childTable&&childTable.row&&childTable.row[childDataName]"
          >
            <template v-if="canEdit">
              <edit-table
                @editDataSelect="editDataSelect"
                @dataChange="dataChange"
                :editText="editText"
                :table-data="childTable.row[childDataName]"
                :unique="String(childTable.row[expandKey])"
                :config="childTableConfigFilter"
                :selected="tableSonSelection[String(childTable.row[expandKey])] || []"
                :childCanSelect="true"
              ></edit-table>
            </template>
            <template v-else>
              <el-table
                :data="childTable.row[childDataName]"
                ref="multipleTable"
                @select="(...key) => handleSelection(String(childTable.row[expandKey]), ...key)"
                @select-all="(...key) => handleSelection(String(childTable.row[expandKey]), ...key)"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  v-if="childCanSelect"
                ></el-table-column>
                <el-table-column
                  v-for="item in childTableConfigFilter"
                  :fixed="item.fixed"
                  :width="item.width"
                  :key="item.label"
                  :label="item.label"
                  :prop="item.prop"
                ></el-table-column>
              </el-table>
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-for="item in tableConfig"
        :fixed="item.fixed"
        :width="item.width"
        :key="item.label"
        :label="item.label"
      >
        <template slot-scope="scope">
          <span v-if="item.linkTo">
            <router-link
              :to="{path:item.linkTo,query:mapFormatter(item.query,scope.row)}"
              style="color:#3399ea"
            >{{item.linkText? item.linkText:scope.row[item.prop]}}</router-link>
          </span>
          <span v-else-if="item.useIf == 'files'">
            <el-dropdown>
              <span class="el-dropdown-link">
                查看附件
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(file,i) in scope.row[item.prop]" :key="file.path">
                  <a
                    class="el-dropdown-link"
                    target="blank"
                    :href="file.path"
                  >{{file.name||`附件${i+1}`}}</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <span
            v-else-if="typeof item.formatter == 'function'"
          >{{item.formatter(scope.row,{},scope.row[item.prop],scope.$index)}}</span>
          
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" v-if="handleButtonMap.length>0" fixed="right" label="操作">
        <template slot-scope="scope">
          <template v-for="thisButton in handleButtonMap">
            <el-button
              v-if="!thisButton.isHide || thisButton.isHide(scope.row)"
              :key="thisButton.title"
              :size="thisButton.size ?thisButton.size : 'size'"
              :type="thisButton.type ?thisButton.type : 'text'"
              @click="thisButton.handle(scope.$index, scope.row)"
            >{{(typeof thisButton.formatter !=='function')?thisButton.title:thisButton.formatter(scope.row)}}</el-button>
          </template>
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
    ></el-pagination>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapGetters } from "vuex";
import * as Enum from "@/utils/enum.js";
import editTable from "./editTable";

export default {
  components: { editTable },
  props: {
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

    editText: {
      type: String,
      default: "编辑"
    },

    summaryMethod: {
      type: Function,
      default: () => {}
    },
    handleButtonMap: {
      type: Array,
      default: () => []
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
    //子表配置
    childDataName: {
      type: String,
      default: ""
    },
    childCanSelect: {
      //子表能否勾选
      type: Boolean,
      defalut: false
    },
    childTableConfig: {
      type: Array,
      default: () => []
    },
    // currentRadioChange:{
    //   type:Function,
    // },
    accordionExpand: {
      type: Boolean,
      default: false
    },
    expandKey: {
      type: String,
      default: ""
    },
    expandsParent: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    canSelect: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tableConfig: [],
      tableDataEditable: [],
      childTableConfigFilter: [],
      expands: [],
      tableSonSelection: {}
    };
  },
  created() {},
  watch: {
    tableData() {
      this.tableDataEditable = [...this.tableData];
    },
    expandsParent() {
      this.expands = [...this.expandsParent];
    }
  },
  beforeMount() {
    this.tableDataEditable = [...this.tableData];
    let childTableConfigFilter = [...this.childTableConfig];
    let tableConfig = [...this.config];
    for (let i in tableConfig) {
      if (tableConfig[i].type) {
        if (tableConfig[i].useApi) {
          tableConfig[i].formatter = (row, column, cellValue, index) =>
            (this.mapConfig[tableConfig[i].type].find(
              v => v.key == cellValue
            ) &&
              this.mapConfig[tableConfig[i].type].find(v => v.key == cellValue)
                .value) ||
            cellValue;
        } else if (tableConfig[i].useLocalEnum) {
          tableConfig[i].formatter = (row, column, cellValue, index) => {
            return (
              (Enum[tableConfig[i].type].find(v => v.value == cellValue) &&
                Enum[tableConfig[i].type].find(v => v.value == cellValue)
                  .name) ||
              cellValue
            );
          };
        } else {
          switch (tableConfig[i].type) {
            case "time":
              tableConfig[i].formatter = (row, column, cellValue, index) =>
                cellValue
                  ? moment(Number(cellValue)).format(
                      tableConfig[i].format || "YYYY-MM-DD HH:mm:ss"
                    )
                  : "";
              break;
            case "Boolean":
              tableConfig[i].formatter = (row, column, cellValue, index) =>
                cellValue ? "是" : "否";
              break;
            case "index":
              tableConfig[i].formatter = (row, column, cellValue, index) =>
                this.pageSize * (this.currentPage - 1) + index + 1;
              break;
            case "toFixed":
              tableConfig[i].formatter = (row, column, cellValue, index) =>
                cellValue && Number(Number(cellValue).toFixed(2));
              break;
          }
        }
      } else {
        tableConfig[i].formatter = (row, column, cellValue, index) =>
          cellValue !== undefined && cellValue !== null && cellValue !== ""
            ? cellValue
            : "";
      }
    }
    for (let i in childTableConfigFilter) {
      if (childTableConfigFilter[i].type) {
        if (childTableConfigFilter[i].useApi) {
          childTableConfigFilter[i].formatter = (
            row,
            column,
            cellValue,
            index
          ) =>
            (this.mapConfig[childTableConfigFilter[i].type].find(
              v => v.key == cellValue
            ) &&
              this.mapConfig[childTableConfigFilter[i].type].find(
                v => v.key == cellValue
              ).value) ||
            cellValue;
        } else if (childTableConfigFilter[i].useLocalEnum) {
          childTableConfigFilter[i].formatter = (
            row,
            column,
            cellValue,
            index
          ) => {
            return (
              (Enum[childTableConfigFilter[i].type].find(
                v => v.value == cellValue
              ) &&
                Enum[childTableConfigFilter[i].type].find(
                  v => v.value == cellValue
                ).name) ||
              cellValue
            );
          };
        } else {
          switch (childTableConfigFilter[i].type) {
            case "time":
              childTableConfigFilter[i].formatter = (
                row,
                column,
                cellValue,
                index
              ) =>
                cellValue
                  ? moment(cellValue).format(
                      tableConfig[i].format || "YYYY-MM-DD"
                    )
                  : "";
              break;
            case "Boolean":
              childTableConfigFilter[i].formatter = (
                row,
                column,
                cellValue,
                index
              ) => (cellValue ? "是" : "否");
              break;
            case "index":
              childTableConfigFilter[i].formatter = (
                row,
                column,
                cellValue,
                index
              ) => this.pageSize * (this.currentPage - 1) + index + 1;
              break;
            case "toFixed":
              childTableConfigFilter[i].formatter = (
                row,
                column,
                cellValue,
                index
              ) => cellValue && Number(Number(cellValue).toFixed(2));
              break;
          }
        }
      } else {
        childTableConfigFilter[i].formatter = (row, column, cellValue, index) =>
          cellValue !== undefined && cellValue !== null && cellValue !== ""
            ? cellValue
            : "";
      }
    }
    this.tableConfig = tableConfig;
    this.childTableConfigFilter = childTableConfigFilter;
  },

  computed: {
    ...mapGetters(["mapConfig"]),

    tablePageSize: {
      get: function() {
        return this.pageSize;
      },
      set: function() {}
    },

    tableCurrentPage: {
      get: function() {
        return this.currentPage;
      },
      set: function() {}
    }
  },
  methods: {
    dataChange(index, type, changeData) {
      this.$emit("dataChange", index, type, changeData);
    },
    expandChangeItem(row, expandedRows) {
      if (!this.canEdit) {
        let key = row[this.expandKey];
        let selected = this.tableSonSelection[key] || [];
        let ids = selected.length
          ? selected.map(v => v.skuCode).join(",") + ","
          : "";
        if (ids) {
          let rows = [];
          row[this.childDataName].forEach(item => {
            if (~ids.indexOf(item.skuCode)) {
              rows.push(item);
            }
          });
          this.$nextTick(() => {
            let table = this.$refs.multipleTable;
            if (table) {
              rows.forEach(row => {
                table.toggleRowSelection(row);
              });
            }
          });
        }
      }
      this.$emit("expandChangePa", row, expandedRows);
    },

    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },

    handleCurrentChange(val) {
      this.$emit("currentChange", val);
    },

    handleCurrentRadioChange(currentRow, oldCurrentRow) {
      if (currentRow) {
        this.$emit("currentRadioChange", currentRow, oldCurrentRow);
      }
    },
    handleSelection(key, val, row) {
      this.tableSonSelection = {}; // 清空上次选中内容，避免选中多个
      if (val.length) {
        this.tableSonSelection[key] = val;
      }
      this.$emit("childDataSelect", val);
    },
    handleParentSelection(val, row) {
      this.$emit("dataSelect", val);
    },
    editDataSelect(val, row) {
      this.tableSonSelection = {}; // 清空上次选中内容，避免选中多个
      this.tableSonSelection[val.unique] = val.arr || [];
      this.$emit("childDataSelect", val, row);
    },
    mapFormatter(target, data) {
      let json = {};
      target.forEach(item => {
        json[item.key] = data[item.value];
      });
      return json;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.ctabel {
  width: 100%;
  .el-radio__label {
    display: none;
  }
}
</style>

