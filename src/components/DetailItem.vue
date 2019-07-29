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
