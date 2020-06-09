<template>
  <div class="BatchForm">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-row>
        <el-col>
          <el-form-item
            prop="plotName"
            label="规则描述"
            :rules="[
        { required: true, message: '请输入规则描述', trigger: ['blur', 'change'] },
      ]"
          >
            <el-input
              style="width:200px"
              placeholder="请输入规则描述"
              maxlength="30"
              v-model="dynamicValidateForm.plotName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="basicTrunoverPlotDetailReqList"
        label="执行规则"
        :rules="[
        { required: true, message: '请设置执行规则', trigger: ['change'] }
      ]"
    >
      <table class="input-table" style="width:600px">
        <tr>
          <th>序号</th>
          <th>批次属性</th>
          <th>启用</th>
          <th>排序规则</th>
        </tr>
        <tr
          v-for="(item) in dynamicValidateForm.basicTrunoverPlotDetailReqList"
          :key="item.serialNumber"
        >
          <td style="width:100px">{{item.serialNumber}}</td>          
          <td style="width:250px">
            <el-select
              v-model="item.batchAttr"
              clearable
              placeholder="请选择批次属性"
              size="mini"
            >
              <el-option
                v-for="item in batchAttrs"
                :key="item.id"
                :label="item.typeName"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </td>
          <td style="width:100px">
            <el-switch
              v-model="item.plotStatus"
              active-value="0"
              inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ccc"
            >
            </el-switch>
          </td>
          <td style="width:250px">
            <el-select
              v-model="item.sortRule"
              clearable
              placeholder="请选择排序规则"
              size="mini"
            >
              <el-option
                v-for="item in sortRules"
                :key="item.id"
                :label="item.typeName"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </td>
        </tr>
      </table>
    </el-form-item>
    <el-form-item label="补充规则">
      <el-row 
        v-for="item in rulesEnum" 
        :key="item.id" 
        style="padding-bottom:10px">
        <el-radio 
          v-model="dynamicValidateForm.addPlot" 
          :label="item.enumValue"
        >{{item.typeName}}</el-radio>
      </el-row>
    </el-form-item>

      <div class="mt20">
        <el-form-item>
          <el-button
            :loading="addLotLoading"
            type="primary"
            @click="submitForm('dynamicValidateForm')"
          >提交</el-button>
          <el-button
            :disabled="addLotLoading"
            @click="resetForm('dynamicValidateForm')"
          >重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloneDeep, omit, pick } from 'lodash';
import { addTrunoverApi, getSysEnumType } from '@/api'
export default {
  data() {
    return {
      addLotLoading: false,
      dynamicValidateForm: {
        lotName: undefined,
        addPlot: '',
        basicTrunoverPlotDetailReqList: [{
          batchAttr: '1',
          serialNumber: 1,
          sortRule: '1'
        }]
      },
      rulesEnum: [],
      sortRules: [],
      batchAttrs: []
    };
  },
  computed: {
    ...mapGetters([
      'mapConfig',
      'visitedViews',
      'chooseWarehouse',
    ])
  },
  created() {
    //批次属性枚举
    getSysEnumType({ enumType: 'MJ00004' }).then(res => {
      if (!res) return
      this.batchAttrs = res.data || []
    })
    //排序规则枚举
    getSysEnumType({ enumType: 'MJ00005' }).then(res => {
      if (!res) return
      this.sortRules = res.data || []
    })
    //补充规则枚举
    getSysEnumType({ enumType: 'MJ00006' }).then(res => {
      if (!res) return
      this.rulesEnum = res.data || []
    })
  },
  methods: {
    submitForm(formName) {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        let data = cloneDeep(this.dynamicValidateForm)
        data.basicPickPlotRuleReqList = []
        if (data.addPlot) {
          data.basicPickPlotRuleReqList.push({
            addPlot: data.addPlot
          })
        }
        this.addLotLoading = true
        addTrunoverApi(data).then(res => {
          if (!res) {
            this.addLotLoading = false
            return
          }
          this.$message.success('创建成功，即将跳转到列表！')
          setTimeout(() => {
            this.$store.dispatch('delVisitedViews', view[0]).then(() => {
              this.$router.push({
                path: `/businessRule/trunoverList`
              })
            }).catch(err => {
            })
          }, 3000)
        })

      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
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