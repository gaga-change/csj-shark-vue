<template>
  <div class="DetailItemCom">
    <div
      class="item"
      v-for="(item, index) in config"
      :key="index"
    >
      <span class="label-text">{{item.label}} ：</span>
      <template v-if="item.type === 'time'">
        <span class="value-content">{{detail[item.prop] | timeFormat}}</span>
      </template>
      <template v-else-if="item.type === 'enum'">
        <span class="value-content">{{detail[item.prop] | parseEnum(item)}}</span>
      </template>
      <template v-else>
        <span class="value-content">{{detail[item.prop]}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// moment(cellValue).format(tableConfig[i].format || 'YYYY-MM-DD HH:mm:ss')
export default {
  props: {
    detail: {
      type: Object,
      default: () => { }
    },
    config: {
      type: Array,
      default: () => { }
    },
    labelWidth: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {

    }
  },
  filters: {
    timeFormat(val) {
      if (!val) return ''
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    parseEnum(val, item) {
      if (val === '' || val === undefined || val === null) {
        return ''
      }
      if (!item.enum) {
        console.error(`列【${item.label} : ${item.prop}】,需要 【enum】字段`)
        return ''
      }
      let temp = item.enum.find(v => v.value == val)
      if (!temp) {
        console.error(`列【${item.label} : ${item.prop}】,没有对应枚举值（${val}）`)
        return ''
      }
      return temp.name
    }
  }
}

</script>

<style lang="scss">
.DetailItemCom {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 12px;
  .item {
    display: flex;
    width: 200px;
    margin-right: 20px;
    margin-top: 10px;
    .label-text {
      width: 80px;
      text-align: right;
    }
    .value-content {
      flex: 1;
    }
  }
}
</style>
