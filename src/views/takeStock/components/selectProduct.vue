<template>
  <div class="SelectProductCom">
    <el-dialog
      title="选择盘点商品"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div class="mb10">
        <el-card shadow="never">
          <el-form
            ref="form"
            :inline="true"
            :model="formData"
            class="demo-form-inline"
          >
            <el-form-item
              label="库区"
              prop="warehouseAreaCode"
            >
              <el-select
                size="mini"
                v-model="formData.warehouseAreaCode"
                placeholder="请选择库区"
                @change="warehouseAreaCodeChange"
                :loading="getSelectInventoryAreaListLoading"
              >
                <el-option
                  v-for="(item, index) in warehouseArea"
                  :key="index"
                  :label="item.warehouseAreaName"
                  :value="item.warehouseAreaCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="库位"
              v-if="formData.warehouseAreaCode"
              prop="warehouseSpaceCode"
            >
              <el-select
                size="mini"
                v-model="formData.warehouseSpaceCode"
                placeholder="请选择库位"
                :loading="getInventorySiteLoading"
              >
                <el-option
                  v-for="(item, index) in warehouseSpace"
                  :key="index"
                  :label="item.warehouseSpaceCode"
                  :value="item.warehouseSpaceCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="商品编码"
              prop="skuCode"
            >
              <el-input
                size="mini"
                v-model="formData.skuCode"
                placeholder="请输入商品编码"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称"
              prop="skuName"
            >
              <el-input
                size="mini"
                v-model="formData.skuName"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                @click="submitForm"
              >查询</el-button>
              <el-button
                size="mini"
                @click="resetForm"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div>
        <base-table
          ref='baseTable'
          :config="takeStockSelectProductTableConfig"
          :api="planInventoryQuerysSkuStockList"
          :select="true"
          :selectTotal="true"
          :selectRows.sync="selectRows"
          :searchParam="formData"
          :tableData.sync="tableData"
        />
      </div>
      <el-alert
        class="mt15"
        title="注：最多选取50条，如需盘点更多商品，请分批处理！"
        type="info"
        :closable="false"
      >
      </el-alert>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="confrim"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/Table'
import { mapGetters } from 'vuex'
import { planInventoryQuerysSkuStockList, getSelectInventoryAreaList, getInventorySite } from '@/api'
import { takeStockSelectProductTableConfig } from './config'
export default {
  components: { BaseTable },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        warehouseAreaCode: '',
        warehouseSpaceCode: '',
        skuName: '',
        skuCode: ''
      },
      takeStockSelectProductTableConfig,
      selectRows: [],
      tableData: [],
      warehouseArea: [],
      warehouseSpace: [],
      getInventorySiteLoading: false,
      getSelectInventoryAreaListLoading: false,
      planInventoryQuerysSkuStockList,
    }
  },
  computed: {
    ...mapGetters([
      'chooseWarehouse',
    ]),
  },
  watch: {
    selectRows(val) {

    },
    selectData(val) {

    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getSelectInventoryAreaListLoading = true
      getSelectInventoryAreaList({ warehouseCode: this.chooseWarehouse }).then(res => {
        if (!res) return
        this.getSelectInventoryAreaListLoading = false
        this.warehouseArea = res.data
      })
    },
    /** 库区修改 */
    warehouseAreaCodeChange(val) {
      this.formData.warehouseSpaceCode = ''
      this.getInventorySiteLoading = true
      getInventorySite({
        pageNum: 1,
        pageSize: 9999,
        warehouseAreaCode: val,
        warehouseCode: this.chooseWarehouse
      }).then(res => {
        this.getInventorySiteLoading = false
        if (!res) return
        this.warehouseSpace = res.data.list || []
      })
    },
    /** 查询 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('submit')
          console.log()
          this.$refs['baseTable'].fetchData()
        }
      })
    },
    /** 重置 */
    resetForm() {
      this.$refs['form'].resetFields()
      this.$refs['baseTable'].fetchData()
    },
    /** 确认 */
    confrim() {
      this.$emit('update:selectData', [...this.selectRows])
      this.close()
    },
    /** 关闭 */
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
<style lang="scss">
.SelectProductCom {
  .el-card__body {
    padding: 10px 10px 0 10px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
