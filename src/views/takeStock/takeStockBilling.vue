<template>
  <div class="TakeStockBillingCom">
    <el-form
      ref="form"
      label-width="80px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="盘点类型"
        prop="orderType"
      >
        <el-select
          v-model="formData.orderType"
          placeholder="请选择盘点类型"
        >
          <el-option
            v-for="item in takeStockTypeEnum"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
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
        <base-table2
          :config="takeStockSelectProductTableConfig"
          :data="tableData"
          :showControl="orderType === 0"
        >
          <template slot-scope="scope">
            <el-link
              type="warning"
              @click="handleDelRow(scope.row, scope.index)"
            >
              删除
            </el-link>
          </template>
        </base-table2>
      </div>
      <div class="mt20">
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            style="width:300px;"
            maxlength="20"
            type="textarea"
            placeholder="根据需要填写，比如重新盘点"
            v-model="formData.remark"
            show-word-limit
          ></el-input>
        </el-form-item>
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
    </el-form>
    <select-product
      :visible.sync="selectProductVisible"
      :selectData.sync="tableData"
      :orderType="orderType"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { insertInventoryOrder } from '@/api'
import { takeStockSelectProductTableConfig } from './components/config'
import selectProduct from './components/selectProduct'
import { takeStockTypeEnum } from '@/utils/enum'

export default {
  components: { selectProduct, BaseTable },
  data() {
    return {
      takeStockSelectProductTableConfig,
      insertInventoryOrderLoading: false,
      selectProductVisible: false,
      takeStockTypeEnum,
      tableData: [],
      formData: {
        //  ... 表单字段
        remark: '',
        orderType: 0,
      },
      rules: {
        //  ... 表单校验
        orderType: [
          { required: true, message: '必填项', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    orderType() {
      return this.formData.orderType
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
        ...this.formData
      }).then(res => {
        this.insertInventoryOrderLoading = false
        if (!res) return
        this.$message.success('操作成功！')
        this.handleResetForm()
      })
    },
    /** 重置 */
    handleResetForm() {
      this.$refs['form'] && this.$refs['form'].resetFields()
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
