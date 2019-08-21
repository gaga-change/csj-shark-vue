<template>
  <div class="LogisticsComponent">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="getLogisticsList"
      :showControl="true"
      :labelWidth="100"
    >
      <template slot-scope="scope">
        <el-link
          type="primary"
          @click="logisticsForm={...scope.row};logisticsHandle('edit')"
        >修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="logisticsDelect(scope.row)"
        >删除</el-link>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          style="margin-bottom:12px"
          @click="logisticsHandle('add')"
        >
          添加
        </el-button>
      </template>
    </base-list>
    <el-dialog
      :title="dialogTitle+'物流公司'"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <el-form
        :model="logisticsForm"
        class="formInput"
        :rules="logisticsRules"
        ref="subForm"
        label-width="70px"
        label-position="left"
      >
        <el-form-item
          label="物流公司名称"
          label-width="100px"
          prop="companyName"
          :rules="[{ required: true, message: '该项为必填'},]"
        >
          <el-autocomplete
            v-model="logisticsForm.companyName"
            :debounce="300"
            size="mini"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入物流公司"
            @select="handleSelect"
          >
          </el-autocomplete>
        </el-form-item>
        <el-form-item
          label="物流公司编码"
          prop="companyCode"
          label-width="100px"
          :rules="[{ required: true, message: '该选择物流公司'}]"
        >
          <el-input
            type="text"
            size="mini"
            placeholder="请输入物流公司编码"
            v-model="logisticsForm.companyCode"
            disabled
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="linkUser"
        >
          <el-input
            type="text"
            size="mini"
            placeholder="请输入联系人名称"
            v-model="logisticsForm.linkUser"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="linkTel"
        >
          <el-input
            type="text"
            size="mini"
            placeholder="请输入联系电话"
            v-model="logisticsForm.linkTel"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="地址"
          prop="linkAddress"
        >
          <el-input
            type="text"
            size="mini"
            placeholder="请输入地址"
            v-model="logisticsForm.linkAddress"
          >
          </el-input>
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
import { getLogisticsList, addLogistics, updateLogistics, deleteLogistics, getLogisticsSearch } from '@/api'
const tableConfig = [
  { label: '公司编码', prop: 'companyCode' },
  { label: '物流公司名称', prop: 'companyName' },
  { label: '地址', prop: 'linkAddress' },
  { label: '联系人', prop: 'linkUser' },
  { label: '创建人  ', prop: 'createrName' },
]
const searchConfig = [
  { label: '物流公司名称', prop: 'companyName', type: 'input' }
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      getLogisticsList,
      dialogVisible: false,
      dialogTitle: '',
      ruleForm: {
        pageNum: 1,
        pageSize: 10,
        companyName: '',
      },
      logisticsRules: {},
      tableData: [
      ],
      childDataName: '',
      logisticsForm: {},
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString) {
        getLogisticsSearch({
          companyName: queryString
        }).then(res => {
          if (res) {
            if (res.data && res.data.length > 0) {
              var a = [...res.data]
              a.map(item => {
                item.value = item.companyName
                return item
              })
              return cb([...a])
            } else {
              cb([])
            }
          } else {
            cb([])
          }
        })
      } else {
        cb([])
      }

    },
    handleSelect(item) {
      this.logisticsForm.companyCode = item.companyCode
    },
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    submitIt() {
      this.$refs['subForm'].validate((valid) => {
        if (valid) {
          if (this.logisticsForm.id) {
            updateLogistics({
              ...this.logisticsForm
            }).then(res => {
              if (res) {
                this.$message({ type: 'success', message: '操作成功！' });
                this.dialogVisible = false;
                this.getTableData()
              }
            })
          } else {
            addLogistics({
              ...this.logisticsForm
            }).then(res => {
              if (res) {
                this.$message({ type: 'success', message: '操作成功！' });
                this.dialogVisible = false;
                this.getTableData()
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    logisticsHandle(type) {
      if (type == 'add') {
        this.dialogVisible = true
        this.dialogTitle = '新增'
        this.logisticsForm = {}
      } else if (type == 'edit') {
        this.dialogVisible = true
        this.dialogTitle = '修改'
      }
    },
    logisticsDelect(data) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLogistics(data).then(res => {
          if (res) {
            this.$message({ type: 'success', message: '操作成功！' });
            this.dialogVisible = false;
            this.getTableData()
          }
        })
      }).catch(() => { })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.LogisticsComponent {
  .formInput {
    input {
      width: 220px;
    }
  }
}
</style>