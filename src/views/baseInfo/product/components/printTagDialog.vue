<template>
  <div class="PrintTagDialogComponent">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="打印标签"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <base-table
          :data="[rowData]"
          :config="tableConfig"
        ></base-table>
        <!-- 打印内容 -->
        <div style="visibility:hidden; height: 0; overflow:hidden">
          <!--        <div > -->
          <div ref="print">
            <div
              v-for="i in number"
              :key="i"
              class="printItemCss "
            >
              <div class="f12" style="float:right; height: 100%;  text-align: right; padding-top: 10px;">
                <bar-code :code="noList[i - 1]"/>
                <div class="mt10">
                  <p style="margin: 0">
                    <span>供应商编码 ：</span>
                    <span style="display:inline-block;width:100px;border-bottom: 1px solid #000;height:14px"></span>
                  </p>
                  <p style="margin: 0">
                    <span>供应商名称 ：</span>
                    <span style="display:inline-block;width:100px;border-bottom: 1px solid #000;height:14px"></span>
                  </p>
                </div>
              </div>
              <div
                class="f12"
                style="overflow:hidden;"
              >
                <h3 style="margin: 0; padding-top: 5px">{{i}} / {{number}}</h3>
                <p style="margin: 0">
                  <span>外部商品编码 ：</span> <span>{{rowData.ownerSkuCode}}</span>
                </p>
                <p style="margin: 0">
                  <span>商品名称 ：</span> <span>{{rowData.skuName}}</span>
                </p>
                <p style="margin: 0">
                  <span>规格 ：</span> <span>{{rowData.lotAttrCode1}}</span>
                </p>
                <p style="margin: 0">
                  <span>型号 ：</span> <span>{{rowData.lotAttrCode2}}</span>
                </p>
                <p style="margin: 0">
                  <span>单位 ：</span> <span>{{rowData.lotAttrCode3}}</span>
                </p>
                <p style="margin: 0">
                  <span>数量 ：</span>
                  <span style="display:inline-block;width:100px;border-bottom: 1px solid #000;height:14px"></span>
                </p>
                <p style="margin: 0">
                  <span>批号 ：</span>
                  <span style="display:inline-block;width:100px;border-bottom: 1px solid #000;height:14px"></span>
                </p>
              </div>
            </div>
          </div>
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
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="printLoading"
          @click="confirm()"
        >打 印</el-button>
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
  // import { saveApi } from '@/api'
  import {MakePrint} from '@/utils'
  import moment from 'moment'
  import {getSkuBarCode} from "@/api";

  const tableConfig = [
    {label: '商品编码 ', prop: 'skuCode'},
    {label: '外部商品编码', prop: 'ownerSkuCode'},
    {label: '商品名称 ', prop: 'skuName'},
    {label: '规格', prop: 'lotAttrCode1'},
    {label: '型号', prop: 'lotAttrCode2'},
    {label: '单位', prop: 'lotAttrCode3'},
    {label: '打印数量', prop: 'num', edit: true, inputType: 'number', min: 1, max: 99, width: 200},
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
        default: () => null
      }
    },
    watch: {
      /** 监听数据切换，重置表单。为何不监听rowData?因为主组件visible一一对应，但选中数据不是，selectRow 是多个弹窗共享的 */
      visible(val) {
        if (!val) return
        const row = this.$copy(this.row)
        row.num = 1
        this.rowData = row
      }
    },
    data() {
      return {
        tableConfig,
        loading: false,
        printLoading: false,
        rowData: {},
        noList: [],
        number: 0,
      }
    },
    filters: {
      /** 获取流水号 */
      getTagCode(i) {
        let num = ''
        if (i < 10) {
          num = '000' + i
        } else {
          num = '00' + i
        }
        return moment(new Date()).format('YYMMDD') + num
      },
    },
    created() {
      this.getNoList(3)
    },
    methods: {
      getNoList(num) {
        return getSkuBarCode({quantity: num}).then(res => {
          if (!res) return
          return this.noList = res.data
        })
      },
      /** 确定 */
      confirm() {
        this.printLoading = true
        this.getNoList(this.rowData.num).then(res => {
          this.printLoading = false
          if (!res) return
          this.number = this.rowData.num
          const appendStyle = `<style type='text/css'>
            body {
            margin: 0;
            padding: 0 5px;
            }
            .printItemCss {
            height: 100vh;
            overflow: hidden;
            }
            </style>`
          this.$nextTick(() => {
            MakePrint(this.$refs['print'].innerHTML, null, null, null, appendStyle)
          })
        })
      },
      /** 关闭弹窗 */
      close() {
        // 初始化表单
        // this.$refs['form'] && this.$refs['form'].resetFields()
        // 初始化没有挂载到表单的数据
        // ...
        this.visible && this.$emit('update:visible', false)
        this.rowData = {}
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .PrintTagDialogComponent {
    .printItemCss {
      height: 300px;
      overflow: hidden;
    }
  }
</style>
