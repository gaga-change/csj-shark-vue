<template>
  <div class="BatchForm">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
      :inline="true"
    >
    <el-row>
      <el-col>
        <el-form-item
          prop="plotName"
          label="波次描述"
          :rules="[
        { required: true, message: '请输入波次描述', trigger: ['blur', 'change'] },
      ]"
        >
          <el-input
            style="width:200px"
            placeholder="请输入波次描述"
            disabled
            maxlength="30"
            v-model="dynamicValidateForm.plotName"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="plotLevel"
          label="优先级"
          :rules="[
        { required: true, message: '请输入优先级', trigger: ['blur', 'change'] },
      ]"
        >
          <el-input-number
            v-model="dynamicValidateForm.plotLevel"
            :precision="0"
            disabled
            :min="1"
            style="width:100px"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <item-title text="执行条件"></item-title>
    <el-row>
      <el-col>
        <el-form-item
          prop="taskBeignTime"
          label="起止时间"
          :rules="[
        { required: true, message: '请选择开始时间', trigger: ['blur', 'change'] },
      ]"
        >
          <el-time-picker
            v-model="dynamicValidateForm.taskBeignTime"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            disabled
            style="width:120px"
            placeholder="开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item
          prop="taskEndTime"
          label="至"
          label-width="30"
          :rules="[
        { required: true, message: '请选择结束时间', trigger: ['blur', 'change'] },
      ]"
        >
          <el-time-picker
            v-model="dynamicValidateForm.taskEndTime"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            disabled
            style="width:120px"
            placeholder="结束时间">
          </el-time-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item
          prop="timeSpan"
          label="间隔时间"
          :rules="[
        { required: true, message: '请输入间隔时间', trigger: ['blur', 'change'] },
      ]"
        >
          <el-input-number
            v-model="dynamicValidateForm.timeSpan"
            :precision="0"
            :min="1"
            disabled
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          prop="timeUnit"
          label="单位"
          :rules="[
        { required: true, message: '请选择间隔单位', trigger: ['blur', 'change'] },
      ]"
        >
          <el-select
            v-model="dynamicValidateForm.timeUnit"
            clearable
            placeholder="请选择间隔单位"
            size="mini"
            disabled
            style="width:80px"
          >
            <el-option
              v-for="item in timeUnitEum"
              :key="item.id"
              :label="item.typeName"
              :value="item.enumValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <item-title text="生效订单"></item-title>
    <el-row>
      <el-col>
        <el-form-item
          prop="billStatus"
          label="单据状态"
          :rules="[
        { required: true, message: '请选择状态', trigger: ['blur', 'change'] },
      ]"
        >
          <el-tag>新建</el-tag>
          <el-tag>已分配</el-tag>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item
          prop="orderTimeDesc"
          label="订单时间"
          :rules="[
        { required: true, message: '请选择订单时间', trigger: ['change'] },
      ]"
        >
          <el-select
            v-model="dynamicValidateForm.orderTimeDesc"
            clearable
            placeholder="请选择订单时间"
            size="mini"
            disabled
          >
            <el-option
              v-for="item in orderTimeDescEum"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="orderTime"
          label="每天"
          :rules="[
        { required: true, message: '请选择结束时间', trigger: ['blur', 'change'] },
      ]"
        >
          <el-time-picker
            style="width:120px"
            v-model="dynamicValidateForm.orderTime"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            disabled
            placeholder="结束时间">
          </el-time-picker>
          前
        </el-form-item>
      </el-col>
    </el-row>
    <item-title text="补充规则"></item-title>
    <el-row v-for="item in rulesEnum" :key="item.id" style="padding:10px 30px">
      <el-radio disabled v-model="dynamicValidateForm.addPlot" :label="item.enumValue">{{item.typeName}}</el-radio>
    </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloneDeep, omit, pick } from 'lodash';
import { waveDetailApi, getSysEnumType } from '@/api'
export default {
  data() {
    return {
      addLotLoading: false,
      dynamicValidateForm: {
        lotName: undefined,
        taskBeignTime: '',
        taskEndTime: '',
        orderTime: '',
        timeUnit: '2',
        billStatus: [ 0, 1 ],
        orderTimeDesc: '仓库截单时间',
        addPlot: '1',
        plotLevel: null,
      },
      timeUnitEum: [],
      orderTimeDescEum: ['仓库截单时间'],
      rulesEnum: []
    };
  },
  computed: {
    ...mapGetters([
      'mapConfig',
      'visitedViews',
      'chooseWarehouse',
    ]),
    receiveOrderAttrSelectedArr() {
      return this.dynamicValidateForm.propItems.map(v => v.receiveOrderAttr).filter(v => v)
    }

  },
  created() {
    //波次补充规则枚举
    getSysEnumType({ enumType:'MJ00002' }).then(res => {
      if (!res) return
      this.rulesEnum = res.data || []
    })
    //时间单位枚举
    getSysEnumType({ enumType:'MJ00003' }).then(res => {
      if (!res) return
      this.timeUnitEum = res.data || []
    })
    waveDetailApi(this.$route.query.id).then(res => {
      this.lotDetailLoading = false
      if (!res) return
      this.dynamicValidateForm = res.data.basicPickPlotDO
      this.dynamicValidateForm.addPlot = res.data.basicPickPlotRuleDOList[0] && res.data.basicPickPlotRuleDOList[0].addPlot
    })
  },
  methods: {

  }
}
</script>
<style lang="scss">
.BatchForm {
  .input-table {
    width: 100%;
    font-size: 0;
    color: #606266;
    // border: 1px solid;
    border: 1px solid #ebeef5;
    border-right: none;
    border-bottom: none;
    border-collapse: collapse;
    th,
    td {
      font-size: 14px;
      padding: 5px 0;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      text-align: center;
      .el-form-item {
        margin: 0;
        &.is-error {
          margin-bottom: 18px;
        }
      }
    }
    th {
      font-weight: normal;
    }
  }
}
</style>