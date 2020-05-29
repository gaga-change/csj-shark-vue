<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="上架"
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
              label="库位"
              prop="warehouseSpaceCode"
            >
              <el-input
                style="width:200px;"
                v-model="formData.warehouseSpaceCode"
                placeholder="请输入库位"
              ></el-input>
            </el-form-item>
            <el-form-item label="带容器">
              <el-switch v-model="hasContainer">
              </el-switch>
            </el-form-item>
            <el-form-item
              label="上架数量"
              prop="putQty"
            >
              <el-input-number
                placeholder="上架数量"
                v-model="formData.putQty"
                :precision="0"
                :min="1"
                :max="99999999"
                controls-position="right"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="容器"
              prop="trayCode"
              v-if="hasContainer"
            >
              <el-input
                style="width:200px;"
                v-model="formData.trayCode"
                placeholder="请输入容器"
              ></el-input>
            </el-form-item>
            <el-form-item
              label=""
              prop="checkResult"
            >
              <el-radio-group v-model="formData.checkResult">
                <el-radio :label="2">正品</el-radio>
                <el-radio :label="1">残次品</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品状态">
              <MapSelect
                :disabled="true"
                v-model="formData.skuStatus"
                map="productStatusEnum"
              />
            </el-form-item>
            <div class="mt10">
              <span>推荐库位：</span>
              <span
                v-for="(item, i) in warehouseSpaceList"
                :key="item.id"
              >
                <el-link
                  type="primary"
                  @click="handleSelectWarehouseSpaceCode(item)"
                >{{item.warehouseSpaceCode}}</el-link>
                <el-divider
                  v-if="i + 1 !== warehouseSpaceList.length"
                  direction="vertical"
                ></el-divider>
              </span>
            </div>
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
        >确认上架</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { inJobAdd, warehouseSpaceSelect } from '@/api'

const detailItemConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '商品名称', prop: 'skuName' },
  { label: '规格', prop: 'skuFormat' },
  { label: '型号', prop: 'skuModel' },
  { label: '单位', prop: 'skuUnitCode' },
  { label: '批次', prop: 'batchNo' },
  { label: '容器', prop: 'trayCode' },
  { label: '数量', prop: 'receiveQty' },
  { label: '上架数量', prop: 'realInQty' },
  { label: '商品状态', prop: 'skuStatus', type: 'enum', enum: 'productStatusEnum' },
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
  data() {
    return {
      warehouseSpaceListLoading: true,
      warehouseSpaceList: [],
      detailItemConfig,
      loading: false,
      hasContainer: false,
      formData: {
        //  ... 表单字段
        warehouseSpaceCode: undefined,
        putQty: undefined,
        trayCode: undefined,
        checkResult: undefined,
        skuStatus: undefined,
      },
      rules: {
        warehouseSpaceCode: [{ required: true, message: '必填项', trigger: 'blur' }, { min: 0, max: 20, message: '不能超过20个字符', trigger: 'blur' },],
        putQty: [{ required: true, message: '必填项', trigger: 'blur' },],
        trayCode: [{ required: true, message: '必填项', trigger: 'blur' }, { min: 0, max: 20, message: '不能超过20个字符', trigger: 'blur' },],
        checkResult: [{ required: true, message: '必填项', trigger: 'blur' },]
      }
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    },
    ...mapGetters([
      'chooseWarehouse',
    ]),
  },
  watch: {
    /** 监听数据切换，重置表单。为何不监听rowData?因为主组件visible一一对应，但选中数据不是，selectRow 是多个弹窗共享的 */
    visible(val) {
      if (!val) return
      this.formData.skuStatus = (this.row || {}).skuStatus || undefined
    }
  },
  created() {
    this.warehouseSpaceListLoading = true
    warehouseSpaceSelect({
      pageNum: 1,
      pageSize: 5,
      warehouseCode: this.chooseWarehouse
    }).then(res => {
      this.warehouseSpaceListLoading = false
      if (!res) return
      this.warehouseSpaceList = res.data.list
    })
  },
  methods: {
    /** 选择推荐库位 */
    handleSelectWarehouseSpaceCode(item) {
      this.formData.warehouseSpaceCode = item.warehouseSpaceCode
    },
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          inJobAdd({ putSpaceInfoList: [{ ...this.formData }], orderDetailItemId: this.rowData.id }).then(res => {
            this.loading = false
            if (!res) return
            this.$message.success('操作成功！')
            this.$emit('submited')
            this.close()
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.hasContainer = false
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