<template>
  <div class="pickingtask">
    <el-card class="simpleCard" shadow="never" body-style="padding:12px">
      <new-search @submit="submit" :searchForm="searchForm" ref="arrivalDom"></new-search>
      <el-col :span="24" style="margin-bottom:12px;">
        <el-button type="primary" size="small" @click="select">查询</el-button>
        <el-button type="primary" size="small" @click="resetForm">重置</el-button>
      </el-col>
    </el-card>

    <el-col :span="24" style="margin-bottom:12px;">
      <el-button
        type="primary"
        :disabled="!SelectionData.length>0||searchForm.isCreateOrder"
        size="small"
        @click="outOrder"
      >生成出库单</el-button>
      <el-button
        type="danger"
        :disabled="!SelectionData.length>0||searchForm.isCreateOrder"
        size="small"
        @click="outOrder('delete')"
      >删除</el-button>
    </el-col>
    <edit-table
      :loading="loding"
      :config="temporaryStorageConfig"
      :tableData="TableData"
      :useEdit="true"
      :defaultEdit="false"
      :childCanSelect="true"
      editText="修改上架数量"
      :pageSizes="[10, 20, 50]"
      :pageSize="pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
      :currentPage="currentPage"
      :total="total"
      @editDataSelect="SelectionChange"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import newSearch from './components/newSearch'
import { temporaryStorageConfig } from './components/config'
import { selectOutWarehouseJobDetail, createOutWareHouseOrder, deleteByIds } from '@/api/warehousing'
import editTable from '@/components/Table/editTable'
export default {
  components: { newSearch, editTable },
  data() {
    return {
      searchForm: {
        pickOrderCode: '',
        planCode: '',
        isCreateOrder: 0
      },
      loding: false,
      temporaryStorageConfig,
      TableData: [],
      total: 0,
      SelectionData: [],
      pageIndex: 1,
      pageSize: 10,
      currentPage: 1
    }
  },
  mounted() {
    this.getCurrentTableData();
  },

  methods: {
    moment,
    sizeChange(val) {
      this.pageSize = val
      this.getCurrentTableData()
    },
    currentChange(val) {
      this.pageIndex = val
      this.getCurrentTableData()
    },
    submit(value) {
      this.searchForm = value;
      this.getCurrentTableData()
    },

    select() {
      this.$refs['arrivalDom'].submit()
    },

    resetForm() {
      this.$refs['arrivalDom'].resetForm()
    },

    SelectionChange(val) {
      this.SelectionData = val.arr;
    },

    outOrder(type) {
      let src = '';
      this.SelectionData.forEach(v => {
        src += ` ${v.pickOrderCode} , `
      })
      let tips = `确定要为 ${src} 生成出库单吗?`;
      let Api = createOutWareHouseOrder;
      let data = { sortTaskIds: this.SelectionData.map(v => v.id) }
      if (type === 'delete') {
        tips = `确定要删除 ${src} 吗?`;
        data = this.SelectionData.map(v => v.jobId)
        Api = deleteByIds
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        Api(data).then(res => {
          if (res.success) {
            this.$message({ type: 'success', message: '操作成功' });
          } else {
            this.$message({ type: 'info', message: '操作失败' });
          }
        }).catch(err => {
          console.log(err)
          this.$message({ type: 'info', message: '操作失败' });
        })
      }).catch(err => {
        console.log(err)
        this.$message({ type: 'info', message: '操作失败' });
      })
    },

    getCurrentTableData() {
      this.loding = true;
      this.SelectionData = [];
      let json = {};
      for (let i in this.searchForm) {
        if (this.searchForm[i] !== '') {
          json[i] = this.searchForm[i];
        }
      }
      selectOutWarehouseJobDetail({pageNum: this.pageIndex, pageSize: this.pageSize, ...json, jobStatus: 4 }).then(res => {
        this.loding = false;
        if (res.success) {
          this.total = res.data && res.data.total;
          this.TableData = res.data && res.data.list || []
          this.currentPage = res.data.pageNum
        }
      }).catch(err => {
        console.log(err)
        this.loding = false;
      })
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.pickingtask {
  .tableBtnBox {
    font-size: 12px;
    color: #3399ea;
    span {
      margin-right: 12px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.el-dialog__body {
  padding-top: 0;
}
</style>