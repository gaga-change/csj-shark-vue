<template>
  <span>{{value}}</span>
</template>
<script>
export default {
  props: {
    formatter: {
      type: Function
    },
    row: {
      type: Object
    },
    index: {
      type: Number
    },
    configItem: {
      type: Object
    }
  },
  data() {
    return {
      value: ''
    }
  },
  created() {
    if (this.formatter) {
      this.value = this.formatter(this.row, { ...this.configItem }, this.row[this.configItem.prop], this.index)
    } else {
      this.value = this.row[this.configItem.prop]
    }
  }
}
</script>