<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <topbar></topbar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <el-row :gutter="16"  class="main-container-nav">
         <el-col :span="7" >
            <navbar></navbar>
         </el-col >
          <el-col :span="17" >
             <tags-view></tags-view>
         </el-col >
      </el-row>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView,Topbar } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Topbar
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    padding-top: 65px;
  }

  #app .sidebar-container{
    top:65px;
  }

  .main-container-nav{
    border-bottom: 1px solid #d8dce5;
  }

</style>
