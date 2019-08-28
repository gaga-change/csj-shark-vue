<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="收货登记"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <!-- 基本信息 -->
        <div>
          <detail-item
            :config="detailItemConfig"
            :detail="rowData"
          />
        </div>
        <div class="mt20">
          <el-form
            :inline="true"
            :model="formData"
            :rules="rules"
            ref="form"
          >
            <el-form-item
              label="批次"
              prop="batchNo"
            >
              <el-input
                style="width:200px;"
                v-model="formData.batchNo"
                placeholder="请输入批次"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="容器"
              prop="trayCode"
            >
              <el-input
                style="width:200px;"
                v-model="formData.trayCode"
                placeholder="请输入容器"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数量"
              prop="receiveQty"
            >
              <el-input-number
                placeholder="数量"
                v-model="formData.receiveQty"
                :precision="0"
                :min="1"
                :max="99999999"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="close()"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { receiveRegistration } from '@/api'

const detailItemConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '预期收货量', prop: 'planQty' },
  { label: '包装（字段待定）', prop: 'abc' },
]

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: {}
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    rowData(val) {
      this.$refs['form'] && this.$refs['form'].resetFields()
    }
  },
  data() {
    return {
      detailItemConfig,
      loading: false,
      formData: {
        //  ... 表单字段
        batchNo: undefined,
        trayCode: undefined,
        receiveQty: undefined,
      },
      rules: {
        batchNo: [{ required: true, message: '必填项', trigger: 'blur' }, { min: 0, max: 20, message: '不超过20个字符', trigger: 'blur' },],
        trayCode: [{ required: true, message: '必填项', trigger: 'blur' }, { min: 0, max: 20, message: '不超过20个字符', trigger: 'blur' },],
        receiveQty: [{ required: true, message: '必填项', trigger: 'blur' },]
      }
    }
  },
  methods: {
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          receiveRegistration({ ...this.formData, detailId: this.rowData.id }).then(res => {
            this.loading = false
            if (!res) return
            this.$refs['form'] && this.$refs['form'].resetFields()
            this.$message.success('操作成功！')
            this.$emit('submited')
            this.close()
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>