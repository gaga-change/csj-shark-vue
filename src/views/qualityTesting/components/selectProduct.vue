<template>
  <div class="SelectProductCom">
    <el-dialog
      title="选择收货单"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div class="mb10">
        <search-form
          :config="selectGoodsSearchConfig"
          @search="handleSearch"
        >
        </search-form>
      </div>
      <div>
        <base-table
          ref='baseTable'
          :config="arrivalConfig"
          :api="queryReceiverOrder"
          :tableData.sync="tableData"
          :searchParams="searchParams"
          :highlightCurrentRow="true"
          @currentRedioChange="currentRedioChange"
        />
      </div>
      <el-alert
        class="mt15"
        title="注：点击表格中的行即可选中！"
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
import { queryReceiverOrder, getSelectInventoryAreaList, getInventorySite } from '@/api'
import { selectGoodsSearchConfig, arrivalConfig } from './config'
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
      arrivalConfig,
      selectGoodsSearchConfig,
      searchParams: {},
      selectGoodsSearchConfig,
      selectRows: [],
      tableData: [],
      warehouseArea: [],
      warehouseSpace: [],
      queryReceiverOrder,
    }
  },
  computed: {
    ...mapGetters([
      'chooseWarehouse',
    ]),
  },
  watch: {
    visible(val) {
      if (val && !this.selectData.length) {
        // this.$refs['baseTable'] && this.$refs['baseTable'].setCurrentRow()
      }
    }
  },
  created() {
  },
  methods: {
    currentRedioChange(row, oldrow) {
      this.selectRows = [row]
    },
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params }
      if (params.createTimeArea) {
        delete obj.createTimeArea
        obj.startDate = new Date(params.createTimeArea[0]).getTime()
        obj.endtDate = new Date(params.createTimeArea[1]).getTime()
      }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    },
    /** 确认 */
    confrim() {
      this.$emit('update:selectData', [...this.selectRows])
      // this.selectRows = []
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
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
