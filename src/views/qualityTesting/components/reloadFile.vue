<template>
  <div>
    <el-dialog
      title="质检报告"
      :visible="visible"
      width="50%"
      :before-close="handleClose"
      @close="close"
    >
      <div v-loading="getCheckReportByOrderCodeLoading">
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
            size="mini"
            type="primary"
          >点击上传</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          ></div>
        </el-upload>
      </div>
      <span slot="footer">
        <el-button
          @click="close"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
          size="mini"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCheckReportByOrderCode, uploadReportFile } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      getCheckReportByOrderCodeLoading: false,
      fileList: [],
      addFile: [],
    }
  },
  watch: {
    row(val) {
      this.fileList = []
      this.getCheckReportByOrderCodeLoading = true
      getCheckReportByOrderCode({ checkOrderCode: this.row.orderCode }).then(res => {
        this.getCheckReportByOrderCodeLoading = false
        if (res) return
        this.fileList = res.data.map(v => {
          return {
            name: v.reportName,
            url: v.reportUrl
          }
        })
      })
    }
  },
  methods: {
    uploadSectionFile(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadReportFile(form, {
        onUploadProgress: function (event) {
          param.file.percent = event.loaded / event.total * 100
          param.onProgress(param.file)
        },
        onDownloadProgress: function (progressEvent) { }
      }).then(res => {
        if (res) {
          param.file.url = this.res.data
          param.onSuccess(param.file)
        } else {
          param.onError(param.file)
        }
      })
    },
    handleRemove(file, fileList) {
      let index = this.addFile.find(v => v.uid = file.uid)
      if (~index) {
        this.addFile.splice(index, 1)
      } else {
        // 在这删除已发布的文件
      }
    },
    handleSuccess(file, fileList) {
      this.addFile.push(file)
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    /** 提交 */
    submit() {

    },
    close() {
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
}
</script>