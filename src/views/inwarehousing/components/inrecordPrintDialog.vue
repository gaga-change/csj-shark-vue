<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="打印单据"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div ref="print">
        <div
          v-for="(detail, index) in rows"
          :key="index"
          :class="{hidden: index > 0}"
        >
          <div
            class="mb15"
            style="display: flex;flex-flow: wrap;"
          >
            <span
              v-for="(item, index) in topConfig"
              :key="index"
              class="f14 mr25 mt10"
            >
              <span>{{item.label}}：</span><span>{{detail[item.prop] || ''}}</span>
            </span>
          </div>
          <div>
            <table class="print-table">
              <tr>
                <th
                  v-for="(item, index) in tableConfig"
                  :key="index"
                >{{item.label}}</th>
              </tr>
              <tr
                v-for="(row, i) in []"
                :key="i"
              >
                <td
                  v-for="(item, index) in tableConfig"
                  :key="index"
                >
                  {{row[item.prop] || ''}}
                </td>
              </tr>
            </table>
          </div>
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
          @click="print()"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MakePrint } from '@/utils'
import { busiBillTypeEnum } from '@/utils/enum'
const topConfig = [
  { label: '收货单号 ', prop: 'orderCode' },
  { label: '入库计划单号 ', prop: 'planCode' },
  { label: '外部订单号', prop: 'busiBillNo' },
  { label: '单据类型', prop: 'orderType', type: 'enum', enum: busiBillTypeEnum },
  { label: '供应商', prop: 'providerName' },
  { label: '货主', prop: 'ownerName' },
]
const tableConfig = [

]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      topConfig,
      tableConfig,
    }
  },
  methods: {
    /** 确定 */
    print() {
      MakePrint(this.$refs['print'].innerHTML)
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
  },
}
</script>
<style lang="scss" scoped>
.hidden {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>