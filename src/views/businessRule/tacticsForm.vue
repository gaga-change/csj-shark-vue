<template>
  <div class="BatchForm">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
    >
      <el-form-item
        prop="plotName"
        label="策略描述"
        :rules="[
      { required: true, message: '请输入策略描述', trigger: ['blur', 'change'] },
    ]"
      >
        <el-input
          style="width:200px"
          placeholder="请输入策略描述"
          maxlength="30"
          v-model="dynamicValidateForm.plotName"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="warehouseAreaCode"
        label="上架库区"
        :rules="[
          { required: true, message: '请选择上架库区', trigger: ['change'] }
        ]"
      >
        <el-select
          v-model="dynamicValidateForm.warehouseAreaCode"
          clearable
          multiple
          placeholder="请选择库区"
          size="mini"
        >
          <el-option
            v-for="item in warehouseAreaCodeEnum"
            :key="item.warehouseAreaCode"
            :label="item.warehouseAreaCode"
            :value="item.warehouseAreaCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="ruleList"
        label="策略规则"
        :rules="[
          { required: true, message: '请设置策略规则', trigger: ['change'] }
        ]"
      >
        <table class="input-table" style="width:600px">
          <tr>
            <th>规则名称</th>
            <th>执行顺序</th>
            <th>启用</th>
            <th>操作</th>
          </tr>
          <tr
            v-for="(item , index) in plotRules"
            :key="index"
          >          
            <td style="width:250px">
              <el-select
                v-model="dynamicValidateForm.ruleList[index]"
                clearable
                placeholder="请选择规则"
                size="mini"
              >
                <el-option
                  v-for="item in plotRules"
                  :key="item.id"
                  :disabled="dynamicValidateForm.ruleList.includes(item.enumValue)"
                  :label="item.typeName"
                  :value="item.enumValue"
                ></el-option>
              </el-select>
            </td>
            <td>{{index + 1}}</td>
            <td style="width:100px">
              <el-switch
                v-model="dynamicValidateForm.statusList[index]"
                :active-value="0"
                :inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ccc">
              </el-switch>
            </td>
            <td>
              <el-button type="text" @click="move(index, -1)" :disabled="index === 0">上移</el-button>
              <el-button type="text" @click="move(index, 1)" :disabled="plotRules.length === index + 1">下移</el-button>
            </td>
          </tr>
        </table>
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
import { addTaticsApi, getSelectInventoryAreaList, getSysEnumType } from '@/api'
export default {
  data() {
    return {
      addLotLoading: false,
      dynamicValidateForm: {
        lotName: undefined,
        warehouseAreaCode: [],        
        ruleList: [],
        statusList: []
      },
      // formatArr: ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'],
      formatArr: ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'],
      warehouseAreaCodeEnum: [],
      plotRules: []
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
    //策略规则枚举
    getSysEnumType({ enumType:'MJ00001' }).then(res => {
      if (!res) return
      this.plotRules = res.data || []
    })
    getSelectInventoryAreaList({
      warehouseCode: this.chooseWarehouse
    }).then(res => {
      if (!res) return
      this.warehouseAreaCodeEnum = res.data || []
    })
  },
  methods: {
    move(index, step) {
      if (!this.dynamicValidateForm.ruleList[index + step])
      return
      const copyArr = cloneDeep(this.dynamicValidateForm.ruleList)
      const copyStatus = cloneDeep(this.dynamicValidateForm.statusList)
      this.$set(this.dynamicValidateForm.ruleList, index, copyArr[index + step])
      this.$set(this.dynamicValidateForm.ruleList, index + step, copyArr[index])

      this.$set(this.dynamicValidateForm.statusList, index, copyStatus[index + step])
      this.$set(this.dynamicValidateForm.statusList, index + step, copyStatus[index])
    },
    submitForm(formName) {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        let data = cloneDeep(this.dynamicValidateForm)
        let params = {
          plotName: data.plotName,
          warehouseAreaCode: data.warehouseAreaCode
        }
        params.addPutPlotDetailReqList = data.ruleList.map((v, index) => {
          const obj = this.plotRules.find(item => item.enumValue === v) || {}
          return {
            plotRuleId: v,
            plotRuleName: obj.typeName,
            serialNumber: index + 1,
            plotStatus: data.statusList[index]
          }
        })
        this.addLotLoading = true
        addTaticsApi(params).then(res => {
          if (!res) {
            this.addLotLoading = false
            return
          }
          this.$message.success('创建成功，即将跳转到列表！')
          setTimeout(() => {
            this.$store.dispatch('delVisitedViews', view[0]).then(() => {
              this.$router.push({
                path: `/businessRule/tacticsList`
              })
            }).catch(err => {
            })
          }, 3000)
        })

      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      });
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