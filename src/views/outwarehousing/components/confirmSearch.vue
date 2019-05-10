<template lang="html">
  <div class="refund-form">
      <el-form  :model="selectForm"  ref="searchForm" label-width="0px" label-position="left">
        <el-form-item  
          prop="outOrderCode"  >
          <el-input type="text" size="small"    placeholder="请输入计划单号"    v-model.trim="selectForm.outOrderCode" @blur="selectCode"></el-input>
        </el-form-item>
    </el-form>
    <out-table
      :loading="loading"
      :config="outTableConfig"  
      :tableData="totalcode"
      @currentRadioChange="currentRadioChange"
    />
  </div>
</template>

<script>
import { outcodelist } from '@/api/warehousing'
import outTable from '@/components/Table/outTable'
import { outTableConfig } from './config'
export default {
  components: { outTable },
  props:{
     searchForm:{
       type:Object,
       default:()=>{}
     },
  },
  data(){
    return{
      selectForm:{
        outOrderCode:null
      },
      oldcode:[],
      totalcode:[],
      loading:false,
      outTableConfig,
      activeOrder:null
    }
  },
  created(){
    this.getcodelist()
  },
  methods:{
    getcodelist(){
      outcodelist().then(res=>{
        if(res.success){
          if(res.data && res.data.length>0){
            let owndata=res.data
            this.totalcode=[]
            this.oldcode=[]
            for(let i=0;i<owndata.length;i++){
              this.totalcode.push({index:i+1,value:owndata[i]})
              this.oldcode.push({index:i+1,value:owndata[i]})
            }
          }else{
            this.totalcode=[]
            this.oldcode=[]
          }
        }else{
          this.totalcode=[]
          this.oldcode=[]
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    currentRadioChange(currentRow){
      if(currentRow){
        this.searchForm.planCode=currentRow.value
        this.$emit('submit',this.searchForm)
      }else{
        this.$emit('submit',this.searchForm)
      }
      // this.searchForm.planCode=currentRow.value
      // this.$emit('submit',this.searchForm)
    },
    selectCode(){
      this.searchForm.planCode=''
      this.currentRadioChange()
      if(this.selectForm.outOrderCode){
        let owndata=[]
        this.oldcode.map(item=>{
          if(item.value.indexOf(this.selectForm.outOrderCode)>-1){
            owndata.push(item)
          }
        })
        if(owndata.length>0){
          this.totalcode=[...owndata]
        }else{
          this.totalcode=[...this.oldcode]
        }
      }else{
        this.totalcode=[...this.oldcode]
      }
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .refund-form{
    &::before,&::after{
      clear: both; 
      content: '';
      display: block;
    };
     .el-form-item{
       height:30px;
       margin-bottom: 30px
     }

     .card-text{
        color: rgb(51, 153, 234);
        margin-left: 12px;
        cursor: pointer;
     }


  }

  .codeNoStyle{
    float: left; 
    color: #8492a6; 
    font-size: 12px;
    width:150px;
    &:last-child{
      float: right;
    }
   }
  .providerList{
    display: flex;
    justify-content: space-between;
    >span{
      &:first-child{
        min-width: 150px;
      }
      &:nth-child(2){
        min-width: 100px;
      }
    }
}

</style>
