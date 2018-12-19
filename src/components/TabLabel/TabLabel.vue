<template>
  <el-tabs v-model="tabName" type="card" @tab-click="handleClick">
    <template v-if="tabConfig&&tabConfig.length>0">
      <el-tab-pane v-for="tab in tabConfig" :label="tab.name" :name="tab.value+''" :key="tab.name" />
    </template>
  </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        tabName: ''
      };
    },
    watch:{
      tabDefault(){
        this.tabName = this.tabDefault
      }
    },
    props:{
      tabDefault:{
        type:String,
        default:''
      },
      tabConfig:{
        type:Array,
        default: ()=>[]
      }
    },
    created(){
      this.tabName = this.tabDefault
    },
    methods: {
      handleClick(tab, event) {
        this.$emit('tabSwitch',tab,event)
      }
    }
  };
</script>