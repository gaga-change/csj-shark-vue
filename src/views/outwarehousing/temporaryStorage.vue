<template>
  <div class="pickingtask">
    <el-card
      shadow="never"
      body-style="padding:12px"
      class="confirmstyle"
    >
      <new-search
        @submit="submit"
        :searchForm="searchForm"
        ref="arrivalDom"
      ></new-search>
    </el-card>
    <div style="margin-left:280px;">
      <el-col
        :span="24"
        style="margin-bottom:12px;"
      >
        <el-button
          type="primary"
          :disabled="!SelectionData.length>0"
          size="small"
          @click="outOrder"
        >复核(生成出库单)</el-button>
        <el-button
          type="danger"
          :disabled="!SelectionData.length>0"
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
        @currentChange="currentChange"
        @editDataSelect="selectionChange"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import newSearch from './components/confirmSearch'
import { temporaryStorageConfig } from './components/config'
import { selectOutWarehouseJobDetail, createOutWareHouseOrder, deleteByIds } from '@/api'
import editTable from '@/components/Table/outTable'
export default {
  components: { newSearch, editTable },
  data() {
    return {
      searchForm: {
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
      currentPage: 1,
      isShow: false
    }
  },
  mounted() {
    // this.getCurrentTableData();
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

    selectionChange(val) {
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
          if (res) {
            this.$message({ type: 'success', message: '操作成功' });
          }
        })
      }).catch(() => { })
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
      if (!json.planCode) {
        this.TableData = []
        this.loding = false
        return
      }
      selectOutWarehouseJobDetail({ ...json }).then(res => {
        this.loding = false;
        if (res) {
          if (res.data && res.data.length > 0) {
            this.TableData = res.data
          } else {
            this.TableData = []
          }
        }
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
.confirmstyle {
  float: left;
  width: 260px;
  min-height: 400px;
}

.el-dialog__body {
  padding-top: 0;
}
</style>