<template>
  <div>
    <scroll-bar>
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </scroll-bar>
    <div class="beian">
      <a
        href="http://www.beian.miit.gov.cn"
        target="_blank"
      >浙ICP备14018558号-1</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'menu',
      'sidebar'
    ]),
    routes() {
      return [...this.menu]
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.beian {
  position: absolute;
  width: 100%;
  height: 20px;
  color: #fff;
  opacity: 0.5;
  left: 0;
  bottom: 65px;
  text-align: center;
  z-index: 999999999;
  font-size: 12px;
}
</style>
