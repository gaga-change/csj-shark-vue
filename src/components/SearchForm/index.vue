<template>
  <div>
    <el-card
      class="simpleCard"
      shadow="never"
      body-style="padding:12px"
    >
      <el-form
        :model="searchForms"
        :rules="searchRules"
        ref="searchForm"
        label-width="80px"
        :inline="true"
      >
        <el-form-item
          v-for="(item,index) in config"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >

          <template v-if="item.type === 'input'">
            <el-input
              style="width:178px;"
              type="text"
              size="mini"
              :placeholder="`请输入${item.label}`"
              v-model="searchForms[item.prop]"
            ></el-input>
          </template>
          <template v-else-if="item.type === 'select'">

            <el-select
              v-model="searchForms[item.prop]"
              clearable
              :placeholder="`请选择${item.label}`"
              size="mini"
            >
              <el-option
                v-for="item in selectEnums[item.prop]"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'timeArea'">
            <el-date-picker
              size="mini"
              v-model="searchForms[item.prop]"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'warehouseAreaCode'">
            <el-select
              size="mini"
              v-model="searchForms.warehouseAreaCode"
              placeholder="请选择库区"
              @change="warehouseAreaCodeChange"
              :loading="getSelectInventoryAreaListLoading"
            >
              <el-option
                v-for="(item, index) in warehouseArea"
                :key="index"
                :label="item.warehouseAreaName"
                :value="item.warehouseAreaCode"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'warehouseSpaceCode'">
            <el-select
              size="mini"
              v-model="searchForms.warehouseSpaceCode"
              placeholder="请选择库位"
              :loading="getInventorySiteLoading"
            >
              <el-option
                v-for="(item, index) in warehouseSpace"
                :key="index"
                :label="item.warehouseSpaceCode"
                :value="item.warehouseSpaceCode"
              ></el-option>
            </el-select>
          </template>
          <template v-else>
            <div>
              配置文件异常，没有相应 【type = {{item.type}}】
            </div>
          </template>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label-width="0">
              <el-button
                size="mini"
                type="primary"
                @click="hanldeSubmit"
                :disabled="resetLoading"
                :loading="submitLoading"
              >查询</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="hanldeResetForm"
                :disabled="submitLoading"
                :loading="resetLoading"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import * as Enum from "@/utils/enum";
import { getSelectInventoryAreaList, getInventorySite } from '@/api'
export default {
  props: {
    config: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    inputItems() {
      return this.config.filter(v => !v.type)
    }
  },
  watch: {
    config(val) {
      this.bindKeys()
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      getSelectInventoryAreaListLoading: false,
      getInventorySiteLoading: false,
      resetLoading: false,
      submitLoading: false,
      searchForms: {},
      searchRules: {},
      selectEnums: {},
      warehouseArea: [],
      warehouseSpace: [],
      spanMap: {
        'timeArea': 16
      }
    }
  },
  computed: {
    ...mapGetters([
      'chooseWarehouse',
    ]),
  },
  created() {
    this.bindKeys()
    if (this.config.find(v => v.type === 'warehouseAreaCode')) {
      this.initData()
    }
  },
  methods: {
    initData() {
      this.getSelectInventoryAreaListLoading = true
      getSelectInventoryAreaList({ warehouseCode: this.chooseWarehouse }).then(res => {
        if (!res) return
        this.getSelectInventoryAreaListLoading = false
        this.warehouseArea = res.data
      })
    },
    /** 库区修改 */
    warehouseAreaCodeChange(val) {
      this.searchForms.warehouseSpaceCode = ''
      this.getInventorySiteLoading = true
      getInventorySite({
        pageNum: 1,
        pageSize: 9999,
        warehouseAreaCode: val,
        warehouseCode: this.chooseWarehouse
      }).then(res => {
        this.getInventorySiteLoading = false
        if (!res) return
        this.warehouseSpace = res.data.list || []
      })
    },
    bindKeys() {
      this.config.forEach(v => {
        this.$set(this.searchForms, v.prop, undefined)
        switch (v.type) {
          case 'select':
            this.selectEnums[v.prop] = Enum[v.enum]
            break
          default:
            break
        }
      })
    },
    hanldeSubmit() {
      this.submitLoading = true
      this.$emit('search', { ...this.searchForms }, () => {
        this.submitLoading = false
      })
    },
    hanldeResetForm() {
      this.resetLoading = true
      this.$refs['searchForm'].resetFields()
      this.$emit('search', {}, () => {
        this.resetLoading = false
      })
    }
  }
}
</script>
