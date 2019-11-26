<template>
  <div>
    <el-card
      class="simpleCard"
      shadow="hover"
      body-style="padding:12px"
    >
      <el-form
        :model="searchForms"
        :rules="searchRules"
        ref="searchForm"
        :label-width="labelWidth+'px'"
        :inline="true"
      >
        <el-form-item
          v-for="(item,index) in config"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :label-width="item.labelWidth ? item.labelWidth + 'px' : undefined"
        >
          <template v-if="item.type === 'enum'">
            <el-select
              v-model="searchForms[item.prop]"
              clearable
              :placeholder="`请选择${item.label}`"
              size="mini"
              @change="hanldeSubmit"
            >
              <el-option
                v-for="(item, index) in mapConfig[item.enum]"
                :key="index"
                :label="item.name"
                :value="item.value + ''"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-radio-group v-model="searchForms[item.prop]">
              <el-radio
                :label="v.value"
                v-for="v in mapConfig[item.radio]"
                :key="v.value"
              >{{v.name}}</el-radio>
            </el-radio-group>
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
            <el-input
              style="width:178px;"
              type="text"
              size="mini"
              :placeholder="`请输入${item.label}`"
              v-model="searchForms[item.prop]"
            ></el-input>
          </template>
        </el-form-item>
        <el-form-item :style="btnInline ? '' : 'display: block'">
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
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSelectInventoryAreaList, warehouseSpaceSelect } from '@/api'
export default {
  props: {
    config: {
      type: Array,
      default: () => []
    },
    /** 搜索 label宽度 */
    labelWidth: {
      type: Number,
      default: 80
    },
    /** 搜索按钮 是否和输入框在同一行 */
    btnInline: {
      type: Boolean,
      default: false,
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
      warehouseArea: [],
      warehouseSpace: [],
      spanMap: {
        'timeArea': 16
      }
    }
  },
  computed: {
    configRange() {
      return this.config.filter(v => v.props)
    },
    ...mapGetters([
      'chooseWarehouse',
      'mapConfig'
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
      warehouseSpaceSelect({
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
      const query = this.$route.query
      this.config.forEach(v => {
        if (v.default !== undefined && v.default !== null) {
          this.$set(this.searchForms, v.prop, v.default)
        } else {
          this.$set(this.searchForms, v.prop, undefined)
        }
        if (query[v.prop] !== undefined && query[v.prop] !== null) {
          this.$set(this.searchForms, v.prop, query[v.prop] + '')
        }
      })
    },
    hanldeSubmit() {
      this.submitLoading = true
      let searchForms = { ...this.searchForms }
      // 获取需要解析的字段, 针对 范围型数据
      if (this.configRange.length) {
        this.configRange.forEach(({ prop, props }) => {
          let valArr = searchForms[prop]
          delete searchForms[prop]
          if (valArr && valArr.length === 2) {
            searchForms[props[0]] = new Date(valArr[0]).getTime()
            searchForms[props[1]] = new Date(valArr[1]).getTime()
          }
        })
      }
      this.$emit('search', this.paramsTrim(searchForms), () => {
        this.submitLoading = false
      })
    },
    hanldeResetForm() {
      this.resetLoading = true
      this.$refs['searchForm'].resetFields()
      this.config.forEach(v => {
        this.$set(this.searchForms, v.prop, undefined)
      })
      this.$nextTick(() => {
        this.$emit('search', this.paramsTrim(this.searchForms), () => {
          this.resetLoading = false
        })
      })
    },
    /** 对字符串进行 去空格操作 */
    paramsTrim(form) {
      let temp = { ...form }
      Object.keys(temp).forEach(key => {
        let val = temp[key]
        if (typeof val === 'string') {
          temp[key] = temp[key].trim()
        }
      })
      return temp
    }
  }
}
</script>
