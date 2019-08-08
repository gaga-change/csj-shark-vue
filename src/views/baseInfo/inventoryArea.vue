<template>
  <div>
    <search-logistics
      @searchTrigger="submitForm"
      :search-name="searchName"
      :search-forms="ruleForm"
    ></search-logistics>

    <el-button
      type="primary"
      size="mini"
      @click="formHandle('add')"
      style="margin-bottom:15px"
    >添加</el-button>
    <base-table
      :loading="loading"
      :tableData="tableData"
      :config="tableConfig"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :total="total"
      :maxTotal="10"
      :pageSize="ruleForm.pageSize"
      :currentPage="ruleForm.pageNum"
      :showControl="true"
      :controlWidth="240"
    >
      <template
        slot="edit"
        slot-scope="scope"
      >
        <el-button
          class=" ml5 mr5"
          size="mini"
          :type="scope.row.inLock ? 'primary': 'warning'"
          plain
          :loading="scope.row.updateLockStatusInLoading"
          @click="handleLock(scope.row, scope.index, 'in')"
        >
          {{scope.row.inLock ? '解锁入库' : '入库锁定'}}
        </el-button>
        <el-button
          class=" ml5 mr5"
          size="mini"
          :type="scope.row.outLock ? 'primary': 'warning'"
          plain
          :loading="scope.row.updateLockStatusOutLoading"
          @click="handleLock(scope.row, scope.index, 'out')"
        >
          {{scope.row.outLock ? '解锁出库' : '出库锁定'}}
        </el-button>
        <el-button
          class="btn-link ml5 mr5 mt10"
          @click="formParams={...scope.row};formHandle('edit')"
        >
          修改
        </el-button>
        <el-button
          class="btn-link ml5 mr5 mt10"
          @click="formDelete(scope.row)"
        >
          删除
        </el-button>
      </template>
    </base-table>
    <el-dialog
      :title="dialogTitle+'库区'"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <el-form
        :model="formParams"
        class="formInput"
        ref="subForm"
        label-width="70px"
        label-position="left"
      >
        <el-form-item
          label="仓库编码"
          prop="warehouseCode"
        >
          <el-input
            type="text"
            size="mini"
            v-model="chooseWarehouse"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="仓库名称"
          prop="warehouseName"
        >
          <el-input
            type="text"
            size="mini"
            v-model="warehouseName"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="库区编码"
          prop="warehouseAreaCode"
          :rules="[
          { required: true, message: '请选择库区'},
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'change' }, 
          { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字' }]"
        >
          <el-input
            :disabled="formType!='add'"
            type="primary"
            v-model="formParams.warehouseAreaCode"
            placeholder="请输入库区"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否虚拟区"
          label-width="90px"
          prop="isVirtual"
        >
          <el-switch
            v-model="formParams.isVirtual"
            :disabled="formType!='add'"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="库区性质"
          prop="warehouseAreaNature"
          :rules="[{ required: true, message: '请选择库区性质'}]"
        >
          <el-select
            v-model="formParams.warehouseAreaNature"
            clearable
            placeholder="请选择库区性质"
            :disabled="formType!='add'"
            size="mini"
          >
            <el-option
              v-for="item in WarehouseAreaNatureEnum"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="库区功能"
          prop="warehouseAreaDesc"
        >
          <el-input
            type="textarea"
            :maxlength="100"
            size="mini"
            v-model="formParams.warehouseAreaDesc"
            :disabled="this.formType=='watch'"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="mini"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitIt"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import DoubleTable from '@/components/Table/doubleTable'
import BaseTable from '@/components/Table'
import { SimpleMsg } from '@/utils/luoFun'
import { areaTableConfig } from './components/config'
import { getInventoryArea, addInventoryArea, updateInventoryArea, warehouseAreaUpdateLockStatus, deleteInventoryArea, getSelectInventoryAreaList } from '@/api'
import { uniqueArray } from '@/utils/arrayHandler'
import { WarehouseAreaNatureEnum, YesOrNoEnum, isVirtualenum } from '@/utils/enum'
import SearchLogistics from './components/search'

export default {
  components: { DoubleTable, SearchLogistics, BaseTable },
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
        isVirtual: 0,
        warehouseAreaNature: ''
      },
      YesOrNoEnum,
      WarehouseAreaNatureEnum,
      isVirtualenum,
      formRules: {},
      selectData: {//x选中的单据

      },
      searchForm: {},
      // searchForms,
      tableData: [
      ],
      // pageNum:0,
      // pageSize:10,
      //子表数据名称 为空时不显示不可展开
      childDataName: '',
      //表格配置
      tableConfig: areaTableConfig,
      total: 0,
      childCanSelect: false,//子表可选择,false不可选，
      // accordionExpand:true,//手风琴展开
      multipleSelection: [],//选中的子表数据
      expandKey: 'id',
      formParams: {
        isVirtual: 0
      },
      logisticsFilter: [],
      formType: '',
      warehouseName: '',
      searchName: 'inventory'
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
  created() {
    this.getTableData()
    this.warehouseMap.map(item => {
      if (item.warehouseNo == this.chooseWarehouse) {
        this.warehouseName = item.warehouseName

      }
    })
  },
  activated() {
    this.warehouseMap.map(item => {
      if (item.warehouseNo == this.chooseWarehouse) {
        this.warehouseName = item.warehouseName
      }
    })
    this.getTableData()
  },
  methods: {
    /** 出入库 解锁或锁定 */
    handleLock(row, index, type) {
      let flag = null
      let isIn = type === 'in'
      let id = row.id
      if (isIn && row.inLock) {
        flag = 2 // 入库解锁
      } else if (isIn && !row.inLock) {
        flag = 1 // 入库锁定
      } else if (!isIn && row.outLock) {
        flag = 4 // 出库解锁
      } else {
        flag = 3 // 出库锁定
      }
      isIn ? row.updateLockStatusInLoading = true : row.updateLockStatusOutLoading = true
      warehouseAreaUpdateLockStatus(id, {
        flag
      }).then(res => {
        isIn ? row.updateLockStatusInLoading = false : row.updateLockStatusOutLoading = false
        if (!res) return
        let item = this.tableData.find(v => v.id === id)
        if (isIn && row.inLock) {
          item.inLock = 0
        } else if (isIn && !row.inLock) {
          item.inLock = 1
        } else if (!isIn && row.outLock) {
          item.outLock = 0
        } else {
          item.outLock = 1
        }
      })
    },
    handleSelect(item) {
      this.formParams.companyCode = item.companyCode
    },
    changeStatus() {
      this.$confirm('是否确定更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateInventoryArea({ ...this.formParams, warehouseAreaStatus: this.formParams.warehouseAreaStatus ? 0 : 1 }).then(res => {
          if (!res) return
          SimpleMsg({
            result: res.success, msgType: 'user', msg: this.formParams.warehouseAreaStatus ? '启用' : '禁用',
            cb: () => {
              this.dialogVisible = false
              this.getTableData()
            }
          })
        })
      }).catch(() => { })
    },
    getTableData() {
      this.$router.replace({
        path: '/baseInfo/inventoryArea',
        query: { data: JSON.stringify(this.ruleForm) }
      })
      this.loading = true;
      let data = { ...this.ruleForm, warehouseCode: this.chooseWarehouse }
      getInventoryArea(data).then(res => {
        this.loading = false
        if (!res) return
        this.tableData = [...res.data.list].map(v => {
          v.updateLockStatusOutLoading = false
          v.updateLockStatusInLoading = false
          return v
        })
        this.total = res.data.total
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
      this.getTableData()

    },

    submitIt() {
      this.$refs['subForm'].validate((valid) => {
        if (valid) {
          this.formParams.warehouseCode = this.chooseWarehouse
          this.formParams.warehouseAreaName = this.formParams.warehouseAreaCode
          if (this.formParams.id) {
            updateInventoryArea({ ...this.formParams }).then(res => {
              if (!res) return
              SimpleMsg({
                result: res.success,
                msgType: 'edit',
                msg: '库区',
                cb: () => {
                  this.dialogVisible = false;
                  this.getTableData()
                }
              })
            })
          } else {
            addInventoryArea({ ...this.formParams }).then(res => {
              if (!res) return
              SimpleMsg({
                result: res.success,
                msgType: 'add',
                msg: '库区',
                cb: () => {
                  this.dialogVisible = false;
                  this.getTableData()
                }
              })
            })
          }
        } else {
          return false
        }
      })
    },

    formHandle(type) {
      if (type == 'add') {
        this.formParams = { isVirtual: 0 }
      } else if (type == 'edit') {
        this.dialogTitle = '修改'
      } else if (type == "watch") {
        this.dialogTitle = '查看'
      }
      this.formType = type

      this.dialogVisible = true

    },
    formDelete(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInventoryArea(data).then(res => {
          if (!res) return
          SimpleMsg({
            result: res.success,
            msgType: 'delete',
            msg: '库区',
            cb: () => {
              this.dialogVisible = false;
              this.getTableData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.formInput {
  input {
    width: 220px;
  }
}
</style>