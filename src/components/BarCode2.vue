<template>
  <img ref="img" :style="style">
</template>
<script>
  import JsBarcode from 'jsbarcode'
  export default {
    props: {
      code: {
        type: String,
        required: true
      },
      style: {
        type: String,
        default: ''
      }
    },
    data() {
      return {

      }
    },
    mounted() {
      console.log(this.$refs['img'], this.code)
      JsBarcode(this.$refs['img'], this.code, {
        displayValue: false
      })
    }
  }
</script>
