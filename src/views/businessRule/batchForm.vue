<template>
  <div class="BatchForm">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
      :inline="true"
    >
      <el-form-item
        prop="email"
        label="批次描述"
        :rules="[
      { required: true, message: '请输入批次描述', trigger: 'blur' },
    ]"
      >
        <el-input
          style="width:200px"
          v-model="dynamicValidateForm.email"
        ></el-input>
      </el-form-item>
      <table class="input-table">
        <tr>
          <th>序号</th>
          <th>批次属性</th>
          <th>输入类型</th>
          <th>属性选项</th>
          <th>启用</th>
          <th>系统采集</th>
          <th>输入控制</th>
        </tr>
        <tr
          v-for="(item , index) in dynamicValidateForm.propItems"
          :key="item.key"
        >
          <td>{{index + 1}}</td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.lotAttrName'"
            >
              <el-input
                style="width:200px;"
                v-model="item.lotAttrName"
                maxlength="20"
                placeholder="批次属性"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.lotAttrType'"
            >
              <el-select
                v-model="item.lotAttrType"
                placeholder="请选择输入类型"
              >
                <el-option
                  v-for="item in mapConfig.lotAttrTypeEnum || []"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td>
            <template v-if="item.lotAttrType === 1">
              <el-form-item
                label="最大长度"
                :prop="'propItems.' + index + '.length'"
              >
                <el-input-number
                  placeholder="最大长度"
                  v-model="item.length"
                  :precision="0"
                  :min="0"
                  :max="999999"
                  controls-position="right"
                ></el-input-number>
              </el-form-item>
            </template>
            <template v-else-if="item.lotAttrType === 2">
              <el-form-item
                label-width="50px"
                label="最小值"
                :prop="'propItems.' + index + '.min'"
              >
                <el-input-number
                  placeholder="最小值"
                  v-model="item.min"
                  :precision="0"
                  :min="-999999"
                  :max="999999"
                  controls-position="right"
                  style="width:120px"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label-width="50px"
                label="最大值"
                :prop="'propItems.' + index + '.max'"
              >
                <el-input-number
                  placeholder="最大值"
                  v-model="item.max"
                  :precision="0"
                  :min="-999999"
                  :max="999999"
                  controls-position="right"
                  style="width:120px"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label-width="50px"
                label="精度"
                :prop="'propItems.' + index + '.precision'"
              >
                <el-input-number
                  placeholder="精度"
                  v-model="item.precision"
                  :precision="0"
                  :min="0"
                  :max="5"
                  controls-position="right"
                  style="width:100px"
                ></el-input-number>
              </el-form-item>
            </template>
            <template v-else-if="item.lotAttrType === 3">
              <el-form-item
                label="枚举值"
                :prop="'propItems.' + index + '.enum'"
              >
                <el-input
                  style="width:200px;"
                  v-model="item.enum"
                  maxlength="20"
                  placeholder="例如：值1、值2"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else-if="item.lotAttrType === 4">
              <el-form-item
                label="日期格式"
                :prop="'propItems.' + index + '.format'"
              >
                <el-select
                  v-model="item.format"
                  placeholder="请选择日期格式"
                  clearable
                >
                  <el-option
                    v-for="item in ['yyyy', 'yyyy-MM', 'yyyy-MM-dd']"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.status'"
            >
              <el-switch
                v-model="item.status"
                :active-value='0'
                :inactive-value='1'
              >
              </el-switch>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.dataSource'"
            >
              <el-select
                v-model="item.dataSource"
                placeholder=""
              >
                <el-option
                  v-for="item in mapConfig.noRrYesEnum || []"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.inputType'"
            >
              <el-select
                v-model="item.inputType"
                placeholder=""
              >
                <el-option
                  v-for="item in mapConfig.inputTypeEnum || []"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>
      </table>
      <!-- <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'域名' + index"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
      required: true, message: '域名不能为空', trigger: 'blur'
    }"
      >
        <el-input v-model="domain.value"></el-input>
        <el-button @click.prevent="removeDomain(domain)">删除</el-button>
      </el-form-item> -->
      <div>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('dynamicValidateForm')"
          >提交</el-button>
          <el-button @click="addDomain">新增域名</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

//  "lotAttrCode": "string //属性编码 lotAttr01-lotAttr12 12个属性值",
//  "lotAttrName": "string //属性名字",
//  "dataSource": "int //采集来源 0 : 系统采集 1：用户录入",
//       "status": "int //状态 0 : 启用  1：禁用",
//       "inputType": "int //输入控制 0:可选 1:必输 2:只读 如果只读则设置 lot_attr_value 值",
//       "lotAttrType": "int //属性类型 1:文本 2:数字 3:下拉 4:日期",
//       "lotAttrValue": "string //属性选项 如果属性格式为下拉则用于配置枚举类型，如：正品/残次品，是否;如果输入控制为必输则设置对应的默认值",
//       "isBatch": "int //是否为批次号属性:0:否 1:是\r      根据批次属性组合生成 唯一批次号",
//       "receiveOrderAttr": "string //关联的收货单中对应的属性，如果data_source\u003d0则该值必输",
//       "receiveOrderDetailAttr": "string //关关联的收货单中对应的属性，如果data_source\u003d0则该值必输",
//       "remark": "string //备注"
import { cloneDeep } from 'lodash';

export default {
  data() {
    return {
      dynamicValidateForm: {
        propItems: [{
          lotAttrName: undefined,
          lotAttrType: 1,
          status: 1,
          dataSource: 1,
          inputType: 0,
          length: 20, // 长度
          min: 0, // 最小值
          max: 99999999, // 最大值
          precision: 0, // 精度
          enum: undefined, // 枚举值
          format: 'yyyy-MM-dd', // 日期格式
          key: Date.now()
        }],
        email: ''
      }
    };
  },
  computed: {
    ...mapGetters([
      'mapConfig',
    ])
  },
  created() {
    let item = this.dynamicValidateForm.propItems[0]
    this.dynamicValidateForm.propItems = []
    for (let i = 0; i < 11; i++) {
      this.dynamicValidateForm.propItems.push(cloneDeep(item))
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
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
      }
    }
    th {
      font-weight: normal;
    }
  }
}
</style>