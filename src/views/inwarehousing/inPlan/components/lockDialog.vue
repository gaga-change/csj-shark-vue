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
        <div>
          <el-input
            v-model.trim.lazy="skuCode"
            placeholder="商品编码或货主商品编码"
          ></el-input>
        </div>
        <div
          class="mt15"
          v-if="skuCode"
        >
          <template v-if="loading">
            <span>加载中...</span>
          </template>
          <template v-else-if="!skuName">
            <span>未找到匹配的商品</span>
          </template>
          <template v-else>
            <span>商品名称：</span><span>{{skuName}}</span>
          </template>
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
import { queryDetailBySkuCode } from '@/api'
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
      this.skuName = ''
      this.skuList = []
    },
    skuCode(val) {
      this.handleSearchInputChange(val)
    }
  },
  data() {
    return {
      skuCode: '',
      skuName: '',
      loading: false,
      skuList: [],
    }
  },
  methods: {
    handleSearchInputChange(v) {
      if (this.tick) {
        clearTimeout(this.tick)
      }
      this.tick = setTimeout(() => {
        if (!v) {
          this.skuName = ''
        } else {
          this.loading = true
          queryDetailBySkuCode({ skuCode: v }).then(res => {
            this.loading = false
            if (!res) return
            this.skuName = res.data.map(v => v.skuName).join('，')
            this.skuList = res.data
          })
        }
        this.tick = null
      }, 500)
    },
    handleSearch() {
      let err = ''
      if (!this.skuCode) {
        err = '请输入商品编码或货主商品编码'
      } else if (!this.skuName) {
        err = '未检索到商品'
      }
      if (err) {
        return this.$message.error(err)
      }
      this.$emit('submited', { skuList: this.skuList })
      this.close()
    },
    handleRest() {
      this.skuCode = ''
      this.skuName = ''
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