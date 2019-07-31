<template>
  <div class="TakeStockBillingCom">
    <div>
      <el-button
        type="primary"
        size="mini"
        @click="showChooseProdDialog"
      >
        获取盘点商品
      </el-button>
    </div>
    <div class="mt20">
      <base-table
        :config="takeStockSelectProductTableConfig"
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
      <el-form
        ref="form"
        label-width="40px"
      >
        <el-form-item label="备注">
          <el-input
            style="width:300px;"
            type="textarea"
            placeholder="根据需要填写，比如重新盘点"
            v-model="remark"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt20">
      <el-button
        type="primary"
        size="mini"
        @click="handleSubmitForm"
        :loading="insertInventoryOrderLoading"
      >
        提交
      </el-button>
      <el-button
        size="mini"
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
import { insertInventoryOrder } from '@/api'
import { takeStockSelectProductTableConfig } from './components/config'
import selectProduct from './components/selectProduct'
export default {
  components: { selectProduct, BaseTable },
  data() {
    return {
      takeStockSelectProductTableConfig,
      insertInventoryOrderLoading: false,
      selectProductVisible: false,
      tableData: [],
      remark: ''
    }
  },
  created() {

  },
  methods: {
    /** 提交 */
    handleSubmitForm() {
      if (!this.tableData.length) {
        return this.$message.error('请选择盘点商品！')
      }
      this.insertInventoryOrderLoading = true
      insertInventoryOrder({
        stockIdList: this.tableData.map(v => v.id),
        remark: this.remark
      }).then(res => {
        this.insertInventoryOrderLoading = false
        if (!res) return
        this.$message.success('提交成功！')
        this.handleResetForm()
      })
    },
    /** 重置 */
    handleResetForm() {
      this.remark = ''
      this.tableData = []
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
