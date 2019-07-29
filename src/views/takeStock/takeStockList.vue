<template>
  <div class="TakeStockListCom">
    <div>
      <search-form
        :config="takeStockListSearchConfig"
        @search="handleSearch"
      >
      </search-form>
    </div>
    <div>
      <el-button
        type="primary"
        size="mini"
        :disabled="!selectRows.length"
        @click="handlePrint"
      >
        打印
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleOutput"
      >
        导出
      </el-button>
    </div>
    <div class="mt15">
      <base-table
        ref='baseTable'
        :api="planInventoryList"
        :config="takeStockListConfig"
        :tableData.sync="tableData"
        :searchParams="searchParams"
        :select="true"
        :selectRows.sync="selectRows"
        :showControl="true"
        :controlWidth="160"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:`/takeStock/detail`,query:{id: scope.row.id}}"
            :style="{color:'#3399ea'}"
          >查看</router-link>
          <router-link
            v-if="scope.row.executeStatus === 0 || scope.row.executeStatus === 1"
            :to="{path:`/takeStock/record`,query:{id: scope.row.id}}"
            :style="{color:'#3399ea'}"
          >盘点录入</router-link>
          <el-button
            class="btn-link"
            v-if="scope.row.executeStatus === 0"
            @click="handleChangeStatus(scope.row, 1)"
          >
            取消
          </el-button>
          <el-button
            class="btn-link"
            v-if="scope.row.executeStatus === 1"
            @click="handleChangeStatus(scope.row, 1)"
          >
            终止
          </el-button>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/components/Table/index'
import SearchForm from '@/components/SearchForm/index'
import { planInventoryList, inventoryRemoveOrStop } from '@/api'
import { takeStockListConfig, takeStockListSearchConfig } from './components/config'
export default {
  components: { BaseTable, SearchForm },
  data() {
    return {
      takeStockListConfig,
      takeStockListSearchConfig,
      planInventoryList,
      tableData: [],
      searchParams: {},
      selectRows: []
    }
  },
  methods: {
    /** 取消或终止 */
    handleChangeStatus(row, operate) {
      this.$confirm(`此操作将${operate ? '终止' : '取消'}该盘点单，是否继续`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            inventoryRemoveOrStop({
              id: row.id,
              operate
            }).then(res => {
              instance.confirmButtonLoading = false
              if (res) {
                this.$message.success('操作成功！')
                done()
              }
            })
          } else {
            done()
          }
        }
      }).then(() => {
      }).catch(() => { })
    },
    /** 导出 */
    handleOutput() {
      this.$message.info('正在开发中...')
    },
    /** 打印 */
    handlePrint() {
      this.$message.info('正在开发中...')
    },
    /** 搜索 */
    handleSearch(params, callback) {
      let obj = { ...params }
      if (params.createTimeArea) {
        delete obj.createTimeArea
        obj.startDate = params.createTimeArea[0]
        obj.endtDate = params.createTimeArea[0]
      }
      this.searchParams = obj
      this.$nextTick(() => {
        this.$refs['baseTable'].fetchData().then(callback)
      })
    }
  }
}
</script>
