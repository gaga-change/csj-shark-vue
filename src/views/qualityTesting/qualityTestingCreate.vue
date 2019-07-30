<template>
  <div class="TakeStockBillingCom">
    <div>
      <el-button
        type="primary"
        size="small"
        @click="showChooseProdDialog"
      >
        引入收货单
      </el-button>
    </div>
    <div class="mt20">
      <base-table
        :config="arrivalConfig"
        :tableData="tableData"
        :showControl="true"
      >
        <template
          slot="edit"
          slot-scope="scope"
        >
          <el-button
            size="mini"
            type="warning"
            @click="handleDelRow(scope.row, scope.index)"
          >
            删除
          </el-button>
        </template>
      </base-table>
    </div>
    <div class="mt20">
      <div style="display: flex;">
        <div class="mr20">
          <span class="c-red f14">*</span>
          <span class="f14 ">质检报告</span>
        </div>
        <div style="flex: 1">
          <el-upload
            class="upload-demo"
            action="/action"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            multiple
            :http-request="uploadSectionFile"
            :limit="10"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button
              class="btn-link f14"
              size="mini"
              type="primary"
            >点击上传</el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            ></div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="mt20">
      <el-button
        type="primary"
        size="small"
        @click="handleSubmitForm"
        :loading="checkOrderAddCheckOrderLoading"
      >
        提交
      </el-button>
      <el-button
        size="small"
        @click="handleResetForm"
      >
        重置
      </el-button>
    </div>
    <select-product
      :visible.sync="selectProductVisible"
      :selectData.sync="tableData"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { checkOrderAddCheckOrder, uploadReportFile } from '@/api'
import { arrivalConfig } from './components/config'
import selectProduct from './components/selectProduct'
export default {
  components: { selectProduct, BaseTable },
  data() {
    return {
      arrivalConfig,
      checkOrderAddCheckOrderLoading: false,
      selectProductVisible: false,
      tableData: [],
      getCheckReportByOrderCodeLoading: false,
      checkOrderAddReportLoading: false,
      fileList: [],
    }
  },
  created() {

  },
  methods: {
    uploadSectionFile(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadReportFile(form, {
        onUploadProgress(event) {
          param.file.percent = event.loaded / event.total * 100
          param.onProgress(param.file)
        },
        onDownloadProgress(progressEvent) { }
      }).then(res => {
        if (res) {
          param.file.url = res.data
          param.onSuccess(param.file)
        } else {
          param.onError(param.file)
        }
      })
    },
    handleRemove(file, fileList) {
      this.fileList.splice(this.fileList.find(v => v.uid === file.uid), 1)
    },
    handleSuccess(file, fileList) {
      this.fileList.push(file)
    },
    handlePreview(file) {
      window.open(file.url)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    /** 提交 */
    handleSubmitForm() {
      if (!this.tableData.length) {
        return this.$message.error('请选择收货单！')
      }
      if (!this.fileList.length) {
        return this.$message.error('请上传质检报告！')
      }
      this.checkOrderAddCheckOrderLoading = true
      checkOrderAddCheckOrder({
        receiveOrderCode: this.tableData[0].orderCode,
        attachmentList: this.fileList.map(v => {
          return {
            reportName: v.name,
            reportUrl: v.url
          }
        }),
      }).then(res => {
        this.checkOrderAddCheckOrderLoading = false
        if (!res) return
        this.$message.success('提交成功！')
        this.handleResetForm()
      })
    },
    /** 重置 */
    handleResetForm() {
      this.tableData = []
      this.fileList = []
    },
    /** 删除行 */
    handleDelRow(row, index) {
      this.$confirm(`将删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => { })
    },
    /** 展示选择商品弹窗 */
    showChooseProdDialog() {
      this.selectProductVisible = true
    }
  },
}
</script>

<style lang="scss">
.TakeStockBillingCom {
  padding: 20px;
}
</style>
