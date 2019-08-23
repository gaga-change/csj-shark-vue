<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :showControl="true"
      :controlWidth="160"
      :select="true"
      @selectionChange="selectionChange"
      :selectable="() => true"
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
import { checkOrderList } from '@/api'
import { WarehouseAreaNatureEnum, isVirtualenum } from '@/utils/enum'
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
      selectRows: [],
      // 可选 附加查询条件
      appendSearchParams: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 主表多选 */
    selectionChange(selectRows) {
      this.selectRows = [...selectRows]
    },
    /** 删除当前行 */
    handleDeleteRow(row) {
      // this.$apiConfirm('是否确定删除？', () => delApi(row.id)).then(() => {
      //   this.$message.success('操作成功！')
      //   this.getTableData()
      // }).catch(() => { })
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.data.list || []
      let total = res.data.total
      data.forEach(v => {
        v.updateLockStatusOutLoading = false
        v.updateLockStatusInLoading = false
      })
      return { data, total }
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    }
  }
}
</script>