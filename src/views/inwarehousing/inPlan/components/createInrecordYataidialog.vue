<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="创建收货单"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <el-form
          :inline="true"
          :model="formData"
          :rules="rules"
          label-width="100px"
          ref="form"
        >
          <el-form-item
            label="收货组织"
            prop="organize"
            key="organize"
          >
            <ApiSelect
              api="asiaOrganizeList"
              :config="['organizationCode', 'organizationName']"
              v-model="formData.organize"
            />
          </el-form-item>
          <el-form-item
            label="存储地点"
            prop="outWarehouseCode"
            key="outWarehouseCode"
            v-if="formData.organize && outWarehouseType !== undefined"
          >

            <ApiSelect
              api="asiaWareHouseList"
              :config="['outWarehouseCode', 'outWarehouseName']"
              :params="{organizationCode: formData.organize, outWarehouseType }"
              v-model="formData.outWarehouseCode"
              :name.sync="formData.outWarehouseName"
            />
          </el-form-item>

        </el-form>
      </div>
      <div v-loading="childLoading">
        <base-table
          :data="sonList"
          :config="tableConfig"
        ></base-table>
      </div>
      <!-- <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>举例，商品最小单位默认为1,4个最小单位为一个内包装【一个内包装数量为4】，
          2个内包装为1箱【一箱数量8】，10箱为一个容器【一容器数量为80】</p>
      </el-alert> -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 父级设置
 * <dialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
 */
import { getInfoDetailWarehousing, createReceiveOrder } from '@/api'
const tableConfig = [
  { label: '商品编码', prop: 'skuCode' },
  { label: '货主商品编码', prop: 'ownerSkuCode' },
  { label: '商品名称', prop: 'skuName' },
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    rows: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    outWarehouseType() {
      if (this.rows[0]) {
        if (this.rows[0].ownerCode === 'EP001')
          return 0
        else return 1
      } else {
        return undefined;
      }
    }
  },
  watch: {
    /** 监听数据切换，重置表单。为何不监听rowData?因为主组件visible一一对应，但选中数据不是，selectRow 是多个弹窗共享的 */
    visible(val) {
      if (!val) return
      // Object.keys(this.formData).forEach(key => {
      //   this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      // })
      this.childApi()
    }
  },
  data() {
    return {
      sonList: [],
      tableConfig,
      childLoading: false,
      loading: false,
      formData: {
        //  ... 表单字段
        organize: undefined,
        outWarehouseCode: undefined,
        outWarehouseName: undefined,
      },
      rules: {
        organize: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        outWarehouseCode: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        //  ... 表单校验
        packageDesc: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] },
          { min: 0, max: 20, message: '不能超过20个字符', trigger: ['blur', 'change'] },
          {
            validator(rule, value, callback) {
              value > 0 ? callback() : callback('数值必须大于0')
            },
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    /** 子表内容获取 */
    childApi() {
      const rows = this.rows
      this.sonList = []
      this.childLoading = true
      Promise.all(rows.map(row => {
        return getInfoDetailWarehousing({ planCode: row.planCode }).then(res => {
          if (!res || !res.data) return
          this.sonList.push(...(res.data.inWarehousePlanDetailRespList || []))
        })
      })).then(res => {
        this.childLoading = false
      })

    },
    /** 确定 */
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const { outWarehouseCode, outWarehouseName } = this.formData
          this.loading = true
          const params = this.rows.map(row => ({
            planOrderId: row.id,
            planOrderCode: row.planCode,
            outWarehouseCode,
            outWarehouseName
          }))
          createReceiveOrder(params).then(res => {
            this.loading = false
            if (!res) return
            this.close()
            this.$message.success('收货单创建完成！3秒后将自动跳转收货单列表页。')
            setTimeout(() => {
              this.$router.push('/inwarehousing/inrecord')
            }, 3000);
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
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