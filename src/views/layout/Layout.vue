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
          var warehouseMap =  this.$store.getters.warehouseMap 
          if(this.$store.getters.chooseWarehouse||chooseWarehouse){
            if(this.$store.getters.chooseWarehouse != chooseWarehouse){
              chooseWarehouse = chooseWarehouse ? chooseWarehouse : this.$store.getters.chooseWarehouse
              this.setWarehouse(chooseWarehouse)
            }
           
          }else{
            const h = this.$createElement
            if(!(warehouseMap&&warehouseMap.length>0)){
                this.$msgbox(
              {
                title: '未关联仓库',
                message:'您还未关联仓库，请关联仓库后操作' ,  
                type:'info',
                showCancelButton: false,
                showConfirmButton:false,
                confirmButtonText: '确定',
                center:true,
                showClose:true,
                confirmButtonClass:'buttonRight',
                closeOnClickModal:false,
                beforeClose: (action, instance, done) => {
                  this.$message({type:'info',message:'配置仓库后重新登录',duration:1500,onClose:()=>{
                    this.$store.dispatch('SetWarehouse','')
                    location.href = `/csj_logout`
                  }})
                    
                }
              }
            )
            }else{
              chooseWarehouse = warehouseMap[0].warehouseNo
              if(warehouseMap.length<2){
                
                  this.setWarehouse(chooseWarehouse,(res)=>{   
                        this.$message({
                          type:'success',
                          message:`您当前默认的仓库是${warehouseMap[0].warehouseName}`
                        })
                        
                  },(err)=>{
                      this.$message({
                          type:'info',
                          message:`默认的仓库选择失败，请手动选择`
                        })
                  })
              }else{
                this.$msgbox({
                  title: '请选择仓库',
                  message: h('div',{},[h('span',{style:"margin-right:10px;"},'仓库'),h('Select',{props:{value:''},class:'el-select',style:'height:26px;',on:{'change':(event)=>{chooseWarehouse = event.target.value;console.log(chooseWarehouse)}}}, warehouseMap.map(item=> h('Option',{attrs:{value:item.warehouseNo}},item.warehouseName))
                  )]),  
                  showCancelButton: false,
                  confirmButtonText: '确定',
                  showClose:false,
                  confirmButtonClass:'buttonRight',
                  closeOnClickModal:false,
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = '执行中...';
                      this.setWarehouse(chooseWarehouse,function(){
                        done();
                      
                        
                        setTimeout(() => {
                          instance.confirmButtonLoading = false;
                        }, 300);
                      })
                    } 
                  }
                })
              }
              
            }
            
          }
    },
    setWarehouse(warehouse,cb,errcb,fcb){
      setWarehouseCode({operaterId:this.$store.getters.userInfo.id,warehouseCode:warehouse}).then(res => {
        if(res.success){
          this.$store.dispatch('SetWarehouse',warehouse)
          if(cb&&typeof cb == 'function'){
            cb(res)
          }
        }
        if(fcb&&typeof fcb == 'function'){
          fcb(res)
        }
      }).catch(err=>{
        if(errcb&&typeof errcb == 'function'){
          errcb(err)
        }
        if(fcb&&typeof fcb == 'function'){
          fcb(err)
        }
      })
    }
  },
  created(){
    this.setUserWarehouse()
  },
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


