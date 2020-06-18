<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="商品锁定计划"
      :visible="visible"
      width="500px"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <!-- <div> -->
        <!-- <el-input
            v-model.trim.lazy="skuCode"
            placeholder="商品编码或货主商品编码"
          ></el-input> -->

        <!-- </div> -->
        <div>
          <el-select
            v-model="skuCodeStr"
            filterable
            remote
            reserve-keyword
            placeholder="商品编码或货主商品编码"
            :remote-method="skuCodeRemoteMethod"
            :loading="skuCodeLoading"
            @change="handelSkuChange"
            style="width: 250px"
          >

            <el-option
              v-for="item in skuList"
              :key="item.id"
              :value="item.id"
              :label="`${item.skuCode} | ${item.ownerSkuCode || ''}`"
            >
              <span>{{item.skuCode}}</span>  <el-divider direction="vertical"></el-divider>  <span>{{item.ownerSkuCode || ''}}</span>
            </el-option>
          </el-select>
        </div>
        <div class="mt15">
          <el-select
            v-model="providerStr"
            filterable
            remote
            reserve-keyword
            placeholder="供应商自有编码或外部编码"
            :remote-method="providerCodeRemoteMethod"
            :loading="providerCodeLoading"
            @change="handelProviderChange"
            style="width: 250px"
          >
            <el-option
              v-for="item in providerList"
              :key="item.id"
              :value="item.id"
              :label="`${item.customerCode} | ${item.reserve5 || ''}`"
            >
              {{item.customerCode}}  <el-divider direction="vertical"></el-divider>  {{item.reserve5}}
            </el-option>
          </el-select>
        </div>
        <div
          class="mt15"
        >
          <div  v-if="skuCode" >
            <span>商品名称：</span><span>{{skuName}}</span>
          </div>

          <div  v-if="providerCode" >
            <span>供应商名称：</span><span>{{providerName}}</span>
          </div>
        </div>
        <div
          class="mt15"
          style="text-align:center"
        >
          <el-button
            type="primary"
            @click="handleSearch"
          >查询</el-button>
          <el-button @click="handleRest">重置</el-button>
        </div>
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
      <!-- <span
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
      </span> -->
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
import { queryDetailBySkuCode, customerList } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: () => ({})
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
    visible(val) {
      if (!val) return
      this.skuCode = ''
      this.skuCodeStr = ''
      this.providerStr = ''
      this.skuName = ''
      this.ownerSkuCode = ''
      this.providerCode = ''
      this.providerName = ''
      this.outProviderCode = ''
      this.skuList = []
      this.providerList = []
    },
    // skuCode(val) {
    //   this.handleSearchInputChange(val)
    // }
  },
  data() {
    return {
      skuCode: '',
      skuCodeStr: '',
      skuName: '',
      ownerSkuCode: '',
      providerCode: '',
      providerName: '',
      providerStr: '',
      outProviderCode: '',
      loading: false,
      skuList: [],
      providerList: [],
      skuCodeLoading: false,
      providerCodeLoading: false,
    }
  },
  methods: {

    // 商品远程查询
    skuCodeRemoteMethod(query) {
      if (query !== '') {
        this.skuCodeLoading = true
        queryDetailBySkuCode({ skuCode: query }).then(res => {
          this.skuCodeLoading = false
          if (!res) return
          this.skuList = res.data
        })
      } else {
        this.skuList = [];
      }
    },
    // 供应商远程查询
    providerCodeRemoteMethod(query) {
      if (query !== '') {
        this.providerCodeLoading = true
        customerList({ customerCodeLike: query, pageNum: 1, pageSize: 999, customerType: 2 }).then(res => {
          this.providerCodeLoading = false
          if (!res) return
          this.providerList = res.data.list
        })
      } else {
        this.providerList = [];
      }
    },
    handelProviderChange(v) {
      if (v) {
        const temp = this.providerList.find(i => i.id === v)
        this.providerCode = temp && temp.customerCode
        this.providerName = temp && temp.customerName
        this.outProviderCode = temp && temp.reserve5
      } else {
        this.providerCode = ''
        this.providerName = ''
        this.outProviderCode = ''
      }
    },
    handelSkuChange(v) {
      if (v) {
        const temp = this.skuList.find(i => i.id === v)
        this.skuName = temp && temp.skuName
        this.skuCode = temp && temp.skuCode
        this.ownerSkuCode = temp && temp.ownerSkuCode
      } else {
        this.skuName = ''
        this.skuCode = ''
        this.ownerSkuCode = ''
      }
    },
    handleRest() {
      this.providerStr = undefined
      this.skuCodeStr = undefined
      this.handelSkuChange()
    },
    handleSearch() {
      let err = ''
      if (!this.skuCode) {
        err = '请选择商品'
      } else if (!this.providerCode) {
        err = '请选择供应商'
      }
      if (err) {
        return this.$message.error(err)
      }
      this.$emit('submited', { skuCode: this.skuCode, providerCode: this.providerCode, skuName: this.skuName, ownerSkuCode: this.ownerSkuCode })
      this.close()
    },
    /** 关闭弹窗 */
    close() {
      // this.$refs['form'] && this.$refs['form'].resetFields()
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
