<template lang="html">
  <div>
    <el-form :inline="true" :model="postForm" class="demo-form-inline" labelWidth="120px">
      <el-form-item label="企业编号">
        <el-input v-model="postForm.code" size="small" placeholder="请输入企业编号"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="postForm.name" size="small" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        <el-button  @click="onReset" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table size="small" :data="currentData" ref="singleTable" highlight-current-row @current-change="handleCurrentChange" :loading="loading">
      <el-table-column property="code" label="企业编号" ></el-table-column>
      <el-table-column property="name" label="企业名称" ></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="pageindex"
      size="small"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      postForm: {
        code: '',
        name: ''
      },
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentData: [],
      searchData:[],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      gridData: 'gysList'
    })
  },
  created() {
    if (!this.gridData.length) {
      this.loading = true
      this.$store.dispatch('GetGysList').then(() => {
        this.loading = false
        this.searchData = _.cloneDeep(this.gridData)
        this.getCurrentData()
      })
    } else {
      this.searchData = _.cloneDeep(this.gridData)
      this.getCurrentData()
    }
  },
  methods: {
    onSubmit() {
       this.searchData = this.gridData.filter(company => {
        return company.name.includes(this.postForm.name) && company.code.includes(this.postForm.code)
      })
      this.handleCurrentPageChange(1)
    },
    onReset() {
      this.pageindex = 1
      this.pagesize = 10
      this.postForm = {
        code: '',
        name: ''
      }
      this.getCurrentData()
    },
    handleCurrentChange(row) {
      if (row) {
        this.$emit('subCompany', row)
        this.$emit('diClose')
      }
    },
    getCurrentData(data) {
      const CopyList = data || [...this.searchData]
      this.currentData = CopyList.slice((this.pageindex - 1) * this.pagesize, this.pagesize * this.pageindex) 
      this.total = data ? data.length : this.searchData.length
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getCurrentData()
    },
    handleCurrentPageChange(val) {
      this.pageindex = val
      this.getCurrentData()
    }
  }
}
</script>

<style lang="css">
</style>
