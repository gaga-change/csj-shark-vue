<template>
  <div class="menu-wrapper">
    <template
      v-for="item in routes"
      v-if="!item.hidden&&item.children"
    >
      <template v-if="item.outLinkUrl">
        <a
          v-if="item.children.length===1 && !item.children[0].children && !item.alwaysShow"
          target="_blank"
          :href="item.outLinkUrl + enterprise"
          :key="item.children[0].name"
        >
          <el-menu-item
            :index="item.path+'/'+item.children[0].path"
            :class="{'submenu-title-noDropdown':!isNest}"
          >
            <svg-icon
              v-if="item.children[0].meta&&item.children[0].meta.icon"
              :icon-class="item.children[0].meta.icon"
            ></svg-icon>
            <span
              v-if="item.children[0].meta&&item.children[0].meta.title"
              slot="title"
            >{{item.children[0].meta.title}}</span>
          </el-menu-item>
        </a>
        <el-submenu
          v-else
          :index="item.name||item.path"
          :key="item.name"
        >
          <template slot="title">
            <svg-icon
              v-if="item.meta&&item.meta.icon"
              :icon-class="item.meta.icon"
            ></svg-icon>
            <span
              v-if="item.meta&&item.meta.title"
              slot="title"
            >{{item.meta.title}}</span>
          </template>

          <template
            v-for="child in item.children"
            v-if="!child.hidden"
          >
            <sidebar-item
              :is-nest="true"
              class="nest-menu"
              v-if="child.children&&child.children.length>0"
              :routes="[child]"
              :key="child.path"
            ></sidebar-item>

            <a
              v-else
              target="_blank"
              :href="child.outLinkUrl + enterprise"
              :key="child.name"
            >
              <el-menu-item :index="item.path+'/'+child.path">
                <svg-icon
                  v-if="child.meta&&child.meta.icon"
                  :icon-class="child.meta.icon"
                ></svg-icon>
                <span
                  v-if="child.meta&&child.meta.title"
                  slot="title"
                >{{child.meta.title}}</span>
              </el-menu-item>
            </a>
          </template>
        </el-submenu>
      </template>
      <template v-else>
        <router-link
          v-if="item.children.length===1 && !item.children[0].children && !item.alwaysShow"
          :to="item.path+'/'+item.children[0].path"
          :key="item.children[0].name"
        >
          <el-menu-item
            :index="item.path+'/'+item.children[0].path"
            :class="{'submenu-title-noDropdown':!isNest}"
          >
            <svg-icon
              v-if="item.children[0].meta&&item.children[0].meta.icon"
              :icon-class="item.children[0].meta.icon"
            ></svg-icon>
            <span
              v-if="item.children[0].meta&&item.children[0].meta.title"
              slot="title"
            >{{item.children[0].meta.title}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu
          v-else
          :index="item.name||item.path"
          :key="item.name"
        >
          <template slot="title">
            <svg-icon
              v-if="item.meta&&item.meta.icon"
              :icon-class="item.meta.icon"
            ></svg-icon>
            <span
              v-if="item.meta&&item.meta.title"
              slot="title"
            >{{item.meta.title}}</span>
          </template>

          <template
            v-for="child in item.children"
            v-if="!child.hidden"
          >
            <sidebar-item
              :is-nest="true"
              class="nest-menu"
              v-if="child.children&&child.children.length>0"
              :routes="[child]"
              :key="child.path"
            ></sidebar-item>

            <router-link
              v-else
              :to="item.path+'/'+child.path"
              :key="child.name"
            >
              <el-menu-item :index="item.path+'/'+child.path">
                <svg-icon
                  v-if="child.meta&&child.meta.icon"
                  :icon-class="child.meta.icon"
                ></svg-icon>
                <span
                  v-if="child.meta&&child.meta.title"
                  slot="title"
                >{{child.meta.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>

    </template>
    <!-- 补丁，给版本号&备案号显示 留出区域 -->
    <div style="height:30px"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    enterprise() {
      return this.companyId ? '&enterprise=' + this.companyId : ''
    },
    ...mapGetters({
      company: 'company',
      companyId: 'companyId',
      userInfo: 'userInfo'
    })
  }
}
</script>
