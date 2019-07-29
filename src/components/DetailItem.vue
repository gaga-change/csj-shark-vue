<template>
  <div class="DetailItemCom">
    <div
      class="item"
      v-for="(item, index) in config"
      :key="index"
    >
      <span class="label-text">{{item.label}} ：</span>
      <span class="value-content">{{detail[item.prop]}}</span>
    </div>
  </div>
</template>

<script>
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
