<template>
  <el-card
    class="simpleCard"
    shadow="never"
    body-style="padding:12px"
  >
    <el-form
      :model="searchForm"
      :rules="searchRules"
      ref="searchForm"
      label-width="70px"
      label-position="left"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="计划单号">
            <el-input
              type="text"
              size="mini"
              v-model="searchForm.planCode"
              placeholder="请输入计划单号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          v-if="inbound"
        >
          <el-form-item label="入库单号">
            <el-input
              type="text"
              size="mini"
              v-model="searchForm.orderCode"
              placeholder="请输入入库单号"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="供应商">
            <el-input
              type="text"
              size="mini"
              v-model="searchForm.providerName"
              placeholder="请输入供应商"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="6"
          v-if="!inbound"
        >
          <el-form-item
            label-width="70px"
            label="入库状态"
            class="postInfo-container-item"
          >
            <el-select
              v-model="searchForm.execStatus"
              filterable
              clearable
              placeholder="请选择入库状态"
              size="mini"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in ExecStatusEnum"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="货主"
            label-width="40px"
          >
            <el-input
              type="text"
              size="mini"
              v-model="searchForm.ownerName"
              placeholder="请输入货主"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="6"
          v-if="inbound"
        >
          <el-form-item label="单据状态">
            <el-select
              v-model="searchForm.orderStatus"
              filterable
              clearable
              placeholder="请选择单据状态"
              size="mini"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in orderStatusEnum"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据类型">
            <el-select
              v-model="searchForm.busiBillType"
              filterable
              clearable
              placeholder="请选择"
              size="mini"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in busiBillTypeEnum"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货状态">
            <el-select
              v-model="searchForm.receiveStates"
              filterable
              clearable
              placeholder="请选择"
              size="mini"
              prefix-icon="el-icon-search"
            >
              <el-option
                v-for="item in receiveState"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="inbound?'入库时间':'下单时间'"
            label-width="70px"
            prop="durationTime"
          >
            <el-date-picker
              v-model="searchForm.durationTime"
              type="daterange"
              size="mini"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label-width="0">
            <el-button
              type="primary"
              size="mini"
              @click="submitIt"
            >查询</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </el-card>
</template>

<script>
import { ExecStatusEnum, OrderStatusEnum, receiveState, busiBillTypeEnum } from '@/utils/enum';
const BusiBillTypeEnumFilter = busiBillTypeEnum.filter(item => item.type.includes('in'))
export default {
  name: 'SearchWarehousing',

  data() {
    return {
      searchRules: {
      },
      searchForm: {},
      ExecStatusEnum,
      OrderStatusEnum,
      receiveState,
      busiBillTypeEnum: BusiBillTypeEnumFilter
    }
  },
  props: {
    searchForms: {
      type: Object,
      default: () => { }
    },

    inbound: {
      type: Boolean,
      default: false
    },

  },

  computed: {
    orderStatusEnum() {
      return this.OrderStatusEnum.filter(v => v.show)
    }
  },

  created() {
    this.searchForm = { ...this.searchForms }
  },
  methods: {
    submitIt() {//查询
      this.$emit('searchTrigger', this.searchForm)
    },
    resetForm() {//重置
      this.searchForm = {}
      this.$emit('resetSearch', this.searchForm)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.codeNoStyle {
  float: left;
  color: #8492a6;
  font-size: 12px;
  width: 150px;
  &:last-child {
    float: right;
  }
}
</style>
  