<template>
  <div class="ComponentNameClass">
    <!-- 禁用 fixed 。 不然子表会载入两次（fixed原理实际就是两个表格重叠实现的），此时 expand 中绑定动态的 ref 会异常。 -->
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :showControlFixed="false"
      :controlWidth="160"
      :expand="true"
      @expandChange="hanldeExpandChange"
      :parseData="parseData"
    >
      <template slot-scope="scope">
        <router-link
          :to="{path:`/qualityTesting/detail`,query:{id: scope.row.id}}"
          :style="{color:'#3399ea'}"
        >查看</router-link>
        <el-divider direction="vertical"></el-divider>
        <el-link type="primary">修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link
          type="primary"
          @click="handleDeleteRow(scope.row)"
        >删除</el-link>
      </template>
      <template
        slot="expand"
        slot-scope="scope"
      >
        <base-table2
          :config="childTableConfig"
          :data="scope.row.childData"
          :loading="scope.row.childLoading"
          :select="true"
          @selectionChange="rows => childSelectionChange(rows, scope.row)"
          :selectable="() => true"
        >
        </base-table2>
      </template>
      <template slot="btns">
        <el-button
          type="primary"
          size="mini"
          @click="handleCreate"
        >
          新建质检记录
        </el-button>
        <el-tooltip
          class="item"
          effect="dark"
          content="导出当前查询的所有记录"
          placement="top"
        >
          <el-button
            type="primary"
            size="mini"
            @click="handleOutput"
          >
            导出
          </el-button>
        </el-tooltip>
      </template>
    </base-list>
  </div>
</template>

<script>
import { checkOrderList, getInfoDetailOutWarehousing } from '@/api'
import { WarehouseAreaNatureEnum, isVirtualenum } from '@/utils/enum'
const childTableConfig = []
const tableConfig = [
  { label: '质检单号 ', prop: 'orderCode' },
  { label: '收货单号 ', prop: 'receiveOrderCode' },
  { label: '创建人', prop: 'createrName' },
  { label: '创建时间', prop: 'gmtCreate', type: 'time' },
  { label: '是否虚拟区', prop: 'isVirtual', type: 'enum', enum: isVirtualenum },
]
const searchConfig = [
  { label: '质检单号', prop: 'orderCode', type: 'input' },
  { label: '创建时间', prop: 'createTimeArea', props: ['startDate', 'endtDate'], type: 'timeArea' },
  { label: '库区性质', prop: 'warehouseAreaNature', type: 'select', enum: WarehouseAreaNatureEnum },
]
export default {
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: checkOrderList,
      childTableData: [],
      childSelectRows: [],
      childSelectRowsMainRow: null,
      // 可选 附加查询条件
      appendSearchParams: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.childData = []
        v.childLoading = false
      })
      return { data, total }
    },
    /** 子表多选 */
    childSelectionChange(selectRows, mainRow, index) {
      let oldIndex = this.childSelectRows.index
      let oldRows = this.childSelectRows
      if (oldIndex !== index && (selectRows.length !== 0 || oldRows.length === 0)) {
        // 更换列
        this.childSelectRows = [...selectRows]
        this.childSelectRows.index = index
        this.childSelectRows.mainRow = mainRow
        if (oldIndex !== undefined) {
          // 准备重置 上一个列
          this.$nextTick(() => {
            this.$refs[`childTable-${oldIndex}`].clearSelection()
          })
        }
      } else if (oldIndex === index) {
        // 更新列
        this.childSelectRows = [...selectRows]
      } else {
        // 被重置
      }
    },
    /** 子列表展开 */
    hanldeExpandChange(row) {
      row.childLoading = true
      getInfoDetailOutWarehousing(row.id).then(res => {
        row.childLoading = fasle
        if (!res) return
        res.childData = res.data || []
      })
    },
    /** 删除当前行 */
    handleDeleteRow(row) {
      // this.$apiConfirm('是否确定删除？', () => delApi(row.id)).then(() => {
      //   this.$message.success('操作成功！')
      //   this.getTableData()
      // }).catch(() => { })
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    }
  }
}
</script>