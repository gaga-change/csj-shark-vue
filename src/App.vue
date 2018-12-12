<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
.el-button{
  font-size:12px;
}
.simpleCard{
    padding-bottom: 0;
    margin-bottom: 20px;
    box-shadow: 0 !important;
    .el-form-item{
      margin-bottom: 10px;
      .el-input{
        max-width:200px;
      }
    }
    .simpleCardLastLine{
      margin-bottom: 0;
    }
  }
</style>

