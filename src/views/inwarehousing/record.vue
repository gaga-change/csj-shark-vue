<template>
  <div class="record">
    <el-card
      class="simpleCard"
      shadow="never"
      body-style="padding:12px"
    >
      <new-search
        @submit="submit"
        :searchForm="searchForm"
        ref="arrivalDom"
      >
      </new-search>
      <el-col
        :span="24"
        style="margin-bottom:12px;"
      >
        <el-button
          type="primary"
          size="mini"
          @click="select"
        >查询</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="resetForm"
        >重置</el-button>
      </el-col>
    </el-card>

    <div style="margin-bottom:12px">
      <el-button
        :disabled="
          !Array.isArray(inOriderSelectData) || inOriderSelectData.length <= 0
        "
        @click="orderAdd"
        :loading="inOrderAddLoading"
        type="primary"
        size="mini"
      >
        生成入库单
      </el-button>
    </div>

    <edit-table
      :loading="false"
      :config="recordListConfig"
      :useEdit="true"
      :defaultEdit="false"
      :checkSelectable="checkSelectable"
      :childCanSelect="true"
      editText="修改上架数量"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
      :total="total"
      :pageSizes="[10, 20, 50]"
      @editDataSelect="editDataSelect"
      @dataChange="dataChange"
      :tableData="recordListTableData"
    />
  </div>
</template>

<script>
import newSearch from './components/newSearch'
import editTable from '@/components/Table/editTable'
import webPaginationTable from '@/components/Table/webPaginationTable'
import _ from 'lodash'
import moment from 'moment'
import { recordListConfig } from './components/config'
import { jobList, inOrderAdd } from '@/api'
export default {
  components: { newSearch, webPaginationTable, editTable },
  data() {
    return {
      inOrderAddLoading: false,
      searchForm: {
        receiveOrderCode: '',
        planCode: '',
        skuName: '',
        isCreateOrder: 0
      },
      recordListConfig,
      recordListTableData: [],
      inOriderSelectData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },

  mounted() {
    this.getCurrentTableData()
  },

  methods: {
    moment,
    checkSelectable(row) {
      return !row.isCreateOrder
    },
    dataChange(index, type, changeData) {
    },

    editDataSelect(val) {
      this.inOriderSelectData = val.arr
    },

    orderAdd() {
      let inWarehouseJobList = []
      let receiveOrderCodeList = []
      _.cloneDeep(this.inOriderSelectData).forEach(item => {
        inWarehouseJobList.push(item.id)
        receiveOrderCodeList.push(item.receiveOrderCode)
      })
      this.$confirm(
        `确定要为 ${receiveOrderCodeList.join(
          ' , '
        )} 生成入库单吗?`,
        '生成入库单',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.inOrderAddLoading = true
        inOrderAdd({
          inWarehouseJobList
        }).then(res => {
          this.inOrderAddLoading = false
          if (!res) return
          this.getCurrentTableData()
          this.inOriderSelectData = []
          this.$message({ type: 'success', message: '操作成功！' })
        })
      }).catch(() => { })
    },

    submit(value) {
      this.searchForm = value
      this.getCurrentTableData()
    },
    currentChange(val) {
      this.pageIndex = val
      this.getCurrentTableData()
    },
    sizeChange(val) {
      this.pageSize = val
      this.getCurrentTableData()
    },
    select() {
      this.$refs['arrivalDom'].submit()
    },

    resetForm() {
      this.$refs['arrivalDom'].resetForm()
    },

    getCurrentTableData() {
      let json = {}
      for (let i in this.searchForm) {
        if (this.searchForm[i] !== '') {
          json[i] = this.searchForm[i]
        }
      }
      jobList({ pageNum: this.pageIndex, pageSize: this.pageSize, ...json })
        .then(res => {
          if (res) {
            this.recordListTableData = (res.data && res.data.list) || []
            this.total = res.data.total
            this.currentPage = res.data.pageNum
          }
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
// .record {
// }
</style>
