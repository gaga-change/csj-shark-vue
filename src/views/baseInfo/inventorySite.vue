<template>
  <div>
    <search-logistics @searchTrigger="submitForm" :search-forms="ruleForm"></search-logistics>

    <div style="margin-bottom:12px;">
      <el-button type="primary" size="small" @click="formHandle('add')">添加</el-button>
      <el-button type="primary" size="small" @click="printSite">打印库位码</el-button>
    </div>
    <double-table
      :loading="loading"
      :table-data="tableData"
      :can-select="canSelect"
      @dataSelect="dataSelect"
      :handle-button-map="handleButtonMap"
      :config="tableConfig"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :total="total"
      :maxTotal="10"
      :expand-key="expandKey"
      :pageSize="ruleForm.pageSize"
      :currentPage="ruleForm.pageNum"
    ></double-table>

    <el-dialog :title="dialogTitle+'库位'" :visible.sync="dialogVisible" width="600px">
      <el-form :model="formParams" ref="subForm" label-width="70px" label-position="left">
        <el-form-item
          label="库区编码"
          prop="warehouseAreaCode"
          label-width="70px"
          :rules="[{ required: true, message: '请选择库区'}]"
        >
          <el-select
            v-model="formParams.warehouseAreaCode"
            clearable
            placeholder="请选择库区"
            :disabled="this.formType!='add'"
            size="small"
          >
            <el-option
              v-for="item in warehouseAreaCodeEnum"
              :key="item.warehouseAreaCode"
              :label="item.warehouseAreaCode"
              :value="item.warehouseAreaCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="库位编码"
          label-width="70px"
          :rules="[{ required: true, message: '请选择库位'}]"
        >
          <div class="inventorySite">
            <span class="tip">从</span>
            <el-input
              type="text"
              style="width:150px"
              size="small"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.platoonStart"
            ></el-input>

            <span class="tip">到</span>
            <el-input
              type="text"
              size="small"
              style="width:150px"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.platoonEnd"
              class="siteInput"
            ></el-input>
            <span class="tip"></span>
          </div>

          <div class="inventorySite">
            <span class="tip">从第</span>
            <el-input
              type="text"
              size="small"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.columnStart"
              class="siteInput"
            ></el-input>

            <span class="tip">层到</span>
            <el-input
              type="text"
              size="small"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.columnEnd"
              class="siteInput"
            ></el-input>
            <span class="tip">层</span>
          </div>

          <div class="inventorySite">
            <span class="tip">库位从第</span>
            <el-input
              type="text"
              size="small"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.floorStart"
              class="siteInput"
            ></el-input>

            <span class="tip">层到</span>
            <el-input
              type="text"
              size="small"
              placeholder="请输入1-99整数"
              :min="1"
              :max="99"
              v-model="formParams.floorEnd"
              class="siteInput"
            ></el-input>
            <span class="tip">层</span>
          </div>
        </el-form-item>
      </el-form>
      <div>提示：第一行是货架，第二行是货架层高，第三行是具体库位号</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitIt">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="打印库位码" :visible.sync="dialogVisibleSite" width="70%">
      <div id="print" class="printSiteCss">
        <div
          v-for="item in multipleParentSelection"
          class="printItemCss"
          :key="item.warehouseSpaceCode"
        >
          <bar-code :code="item.warehouseSpaceCode"></bar-code>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-loading="loading">
        <el-button @click="dialogVisibleSite = false">取 消</el-button>
        <el-button type="primary" @click="printIt">打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'


import DoubleTable from '@/components/Table/doubleTable'
import { SimpleMsg } from '@/utils/luoFun'
import { siteTableConfig } from './components/config'
import { getInventorySite, addInventorySite, updateInventorySite, deleteInventorySite, getSelectInventoryAreaList } from '@/api/inventory'

import { uniqueArray } from '@/utils/arrayHandler'
import { MakePrint } from '@/utils/luoFun'
import SearchLogistics from './components/search'

export default {
  components: { DoubleTable, SearchLogistics },
  data() {
    return {
      imgs: '',
      loading: false,
      dialogVisible: false,
      dialogData: {},
      dialogTitle: '',
      ruleForm: {
        pageNum: 1,
        pageSize: 10,
        warehouseAreaCode: '',
        warehouseSpaceCode: '',
      },
      formRules: {},
      selectData: {//x选中的单据

      },
      searchForm: {},
      tableData: [
      ],
      //子表数据名称 为空时不显示不可展开
      childDataName: '',
      //表格配置
      tableConfig: siteTableConfig,
      total: 0,
      //主表操作
      handleButtonMap: [
        {
          title: '状态更改',
          handle: (index, data) => {
            this.changeStatus()
            this.formParams = { ...data }
          },
          formatter: (data) => {
            return data.openStatus ? '启用' : '禁用'
          }
        },
        {
          title: '删除',
          handle: (index, data) => {
            this.formDelect(data)
          },
          isHide: (data) => {
            return data.openStatus
          }
        }
      ],
      canSelect: true,
      multipleParentSelection: [],//选中的主表
      childCanSelect: false,//子表可选择,false不可选，
      multipleSelection: [],//选中的子表数据
      expandKey: 'id',
      formParams: {},
      logisticsFilter: [],
      formType: '',
      warehouseAreaCodeEnum: [],
      dialogVisibleSite: false,
    }
  },
  computed: {
    ...mapGetters([
      'warehouseMap',
      'chooseWarehouse',
    ]),
  },
  watch: {
    chooseWarehouse: {
      handler: function (val, oldVal) {
        if (val != oldVal) {
          //仓库更改数据重新请求
          this.getTableData()
          this.warehouseMap.map(item => {
            if (item.warehouseNo == this.chooseWarehouse) {
              this.warehouseName = item.warehouseName
            }
          })
        }
      },
    }
  },
  methods: {

    handleSelect(item) {
      this.formParams.companyCode = item.companyCode
    },
    //主表多选
    dataSelect(selectData) {
      this.multipleParentSelection = [...selectData]
    },
    printSite() {
      if (this.multipleParentSelection.length > 0) {
        this.dialogVisibleSite = true;
      } else {
        this.$message({
          type: 'info',
          message: '请选择需要打印的库位码'
        })
      }
    },
    printIt() {
      var useStyle = `<style type='text/css'> 
                                .printItemCss{
                                    width:40mm;
                                    height:25mm;   
                                }  
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                               </style>`
      MakePrint(document.getElementById('print').innerHTML, useStyle)
    },
    changeStatus() {
      this.$confirm('是否确定更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateInventorySite({
          id: this.formParams.id,
          flag: this.formParams.openStatus ? 0 : 1
        }).then(res => {
          SimpleMsg({
            result: res.success,
            msgType: 'user',
            msg: this.formParams.openStatus ? '启用' : '禁用',
            cb: () => {
              this.dialogVisible = false;
              this.getTableData()
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getTableData() {

      this.$router.replace({
        path: '/baseInfo/inventorySite',
        query: { data: JSON.stringify(this.ruleForm) }
      })
      this.loading = true;
      let data = {
        ...this.ruleForm,
        warehouseCode: this.chooseWarehouse
      }
      getInventorySite(data).then(res => {
        if (res.success && res.data && res.data.list) {
          this.tableData = [...res.data.list]
          this.total = res.data.total
        } else {
          this.tableData = []
          this.total = 0
        }
        this.loading = false;

      }).catch(err => {
        this.loading = false;
      })
      getSelectInventoryAreaList({
        warehouseCode: this.chooseWarehouse
      }).then(res => {
        if (res.success) {
          if (res.data && res.data.length > 0) {
            this.warehouseAreaCodeEnum = [...res.data]
          }
        }
      })
    },


    handleSizeChange(val) {
      this.ruleForm = { ...this.ruleForm, pageSize: val, pageNum: 1 }
      this.getTableData()
    },

    handleCurrentChange(val) {
      this.ruleForm = { ...this.ruleForm, pageNum: val }
      this.getTableData()
    },
    submitForm(ruleForm) {
      this.ruleForm = { ...ruleForm, pageSize: 10, pageNum: 1 }
      this.getTableData();

    },

    submitIt() {
      this.$refs['subForm'].validate((valid) => {
        if (valid) {
          if (this.formParams.platoonEnd < this.formParams.platoonStart) {
            this.$message({
              type: 'info',
              message: '输入货架编号有误，结束编号必须不小于开始编号！'
            })
            return false
          }
          if (this.formParams.columnEnd < this.formParams.columnStart) {
            this.$message({
              type: 'info',
              message: '输入货架层高编号有误，结束编号必须不小于开始编号！'
            })
            return false
          }
          if (this.formParams.floorEnd < this.formParams.floorStart) {
            this.$message({
              type: 'info',
              message: '输入具体库位编号有误，结束编号必须不小于开始编号'
            })
            return false
          }
          addInventorySite({
            ...this.formParams
          }).then(res => {
            SimpleMsg({
              result: res.success,
              msgType: 'add',
              msg: '库位',
              cb: () => {
                this.dialogVisible = false;
                this.getTableData()
              }
            })
          })
        } else {
          return false;
        }
      });
    },
    formHandle(type) {
      if (type == 'add') {
        this.formParams = {}
      } else if (type == 'edit') {
        this.dialogTitle = '修改'
      } else if (type == "watch") {
        this.dialogTitle = '查看'
      }
      this.formType = type

      this.dialogVisible = true

    },
    formDelect(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInventorySite(data).then(res => {
          SimpleMsg({
            result: res.success,
            msgType: 'delete',
            msg: '库位',
            cb: () => {
              this.dialogVisible = false;
              this.getTableData()
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
  },
  created() {
    this.getTableData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.formInput {
  input {
    width: 220px;
  }
}
.inventorySite {
  display: flex;
  .tip {
    flex: 2;
    text-align: center;
  }
  .siteInput {
    flex: 4;
  }
}
.printSiteCss {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  .printItemCss {
    width: 40mm;
    height: 25mm;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>