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
import { setWarehouseCode } from '@/api/login.js'
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
  },
  methods:{
    setUserWarehouse(){
        var chooseWarehouse = sessionStorage.getItem('warehouse')
          // var userWarehouse = this.$store.getters.userInfo.roles
          var warehouseMap =  this.$store.getters.warehouseMap 
          // this.$store.getters.userInfo.warehouses.filter(item=> userWarehouse.includes(item.warehouseNo))
          if(this.$store.getters.chooseWarehouse||chooseWarehouse){
            if(this.$store.getters.chooseWarehouse != chooseWarehouse){
              chooseWarehouse = chooseWarehouse ? chooseWarehouse : this.$store.getters.chooseWarehouse
              this.setWarehouse(chooseWarehouse)
            }
           
          }else{
            const h = this.$createElement
            chooseWarehouse = warehouseMap[0].warehouseNo
            if(!chooseWarehouse){
                // this.$alert({title:'您还未关联仓库，请关联仓库后操作',closable:false})
                this.$msgbox(
              {
                title: '未关联仓库',
                message:'您还未关联仓库，请关联仓库后操作' ,  
                type:'error',
                showCancelButton: false,
                showConfirmButton:false,
                confirmButtonText: '确定',
                center:true,
                showClose:false,
                confirmButtonClass:'buttonRight',
                closeOnClickModal:false,
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    this.setWarehouse(chooseWarehouse,function(){
                      done();
                      console.log(33331);
                      
                      setTimeout(() => {
                        instance.confirmButtonLoading = false;
                      }, 300);
                    })

                  } 
                }
              }
            )
            }else{
              this.$msgbox(
              {
                title: '请选择仓库',
                message: h('div',{},[h('span',{style:"margin-right:10px;"},'仓库'),h('Select',{props:{value:''},class:'el-select',style:'height:26px;',on:{'change':(event)=>{chooseWarehouse = event.target.value;console.log(chooseWarehouse)}}}, warehouseMap.map(item=> h('Option',{attrs:{value:item.warehouseNo}},item.warehouseName))
                )]),  
                showCancelButton: false,
                confirmButtonText: '确定',
                // center:true,
                showClose:false,
                confirmButtonClass:'buttonRight',
                closeOnClickModal:false,
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    this.setWarehouse(chooseWarehouse,function(){
                      done();
                      console.log(33331);
                      
                      setTimeout(() => {
                        instance.confirmButtonLoading = false;
                      }, 300);
                    })

                    // this.$store.dispatch('SetWarehouse',chooseWarehouse).then(res=>{
                    //   done();
                    //   setTimeout(() => {
                    //     instance.confirmButtonLoading = false;
                    //   }, 300);
                    //   // next({ ...to, replace: true })
                    // })
                  } 
                }
              }
            )
            }
            
          }
    },
    setWarehouse(warehouse,cb){
      setWarehouseCode({operaterId:this.$store.getters.userInfo.id,warehouseCode:warehouse}).then(res => {
        if(res.success){
          // sessionStorage.setItem('warehouse',warehouse)
          this.$store.dispatch('SetWarehouse',warehouse)
          if(cb&&typeof cb == 'function'){
            cb()
          }
        }
      })
    }
  },
  created(){
    this.setUserWarehouse()
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
  .el-message-box--center .el-message-box__btns{
    text-align: right !important;
  }
</style>


