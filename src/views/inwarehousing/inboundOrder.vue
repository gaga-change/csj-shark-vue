<template>
  <div  class="refund">
     <el-card class="simpleCard"  shadow="never"  body-style="padding:12px">
        <search-invoice  
          @submit="submit"
          :searchForm="searchForm"  
          ref="inboundOrder" />

        <el-col :span="24" style="margin-bottom:12px;">
            <el-button type="primary"  size="small"  @click="select">查询</el-button>
            <el-button type="primary"  size="small" @click="resetForm">重置</el-button>
        </el-col>
     </el-card>

      <base-table 
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :loading="loading"
      :config="inPushOrderConfig"  
      :total="total" 
      :maxTotal="10"
      :pageSize="pageSize"
      :currentPage="pageNum"
      :tableData="inPushOrderTableData"/>

    <el-dialog
     style="z-index:900"
     title="详情"
     :visible.sync="dialogVisible"
     width="70%">
    <div class="alertInfo">
        <span>入库计划单 : {{activeOrder.planCode}}</span>    
        <span>供应商 : {{activeOrder.providerName}}</span>    
        <span>到货时间 : {{ moment(activeOrder.gmtCreate).format('YYYY-MM-DD') }}</span>    
    </div>
     <web-pagination-table 
       :loading="alertLoding"
       :config="inPushOrderDetailConfig" 
       :allTableData="inPushOrderDetailTable"/> 
     </el-dialog>
  </div> 
</template>

<script>
import SearchInvoice from './components/newSearch'
import webPaginationTable from '@/components/Table/webPaginationTable'
import { inPushOrderConfig ,inPushOrderDetailConfig} from './components/config';
import BaseTable from '@/components/Table'
import { inOrderList ,inOrderSelectDetailList} from '@/api/warehousing'
import _  from 'lodash';
import moment from 'moment'; 
export default {
  components: { SearchInvoice,BaseTable,webPaginationTable },
   data() {
    return {
      searchForm:{
        planCode:'',
        providerName:'',
        orderCode:'',
        ownerName:'',
        orderTime:''
      },
      pageSize:10,
      pageNum:1,
      total:0,
      loading:false,
      inPushOrderConfig,
      inPushOrderDetailConfig,
      inPushOrderTableData:[],
      alertLoding:false,
      inPushOrderDetailTable:[],
      dialogVisible:false,
      activeOrder:{}
    }
  },

  mounted(){
    this.getCurrentTableData()
  },


  created(){
    this.inPushOrderConfig.forEach(item=>{
       if(item.useLink){
           item.dom=(row, column, cellValue, index)=>{
               return <span class="link_dom" onClick={this.shouDetail.bind(this,row)} >查看详情</span>
           }
       }
    })
  },

  methods:{
    moment,
    shouDetail(row){
      this.dialogVisible=true;
      this.activeOrder=row;
      inOrderSelectDetailList(row.id).then(res=>{
        if(res.success){
          this.inPushOrderDetailTable=res.data;  
        }
      }).catch(err=>{
          console.log(err)
      })
    },

    select(){
       this.$refs['inboundOrder'].submit()
    },

    resetForm(){
      this.$refs['inboundOrder'].resetForm() 
    },

    submit(value){
      this.searchForm=value;
      this.getCurrentTableData()
    },

    handleSizeChange(val) {
      this.pageSize=val;
      this.pageNum=1;
      this.getCurrentTableData();
    },

    handleCurrentChange(val) {
     this.pageNum=val;
     this.getCurrentTableData();
    },

    getCurrentTableData(){
      this.loading=true;
      let json={};
      for(let i in this.searchForm){
        if(this.searchForm[i]!==''){
          json[i]=this.searchForm[i]
        }
      }
      if(json.orderTime&&Array.isArray(json.orderTime)){
        json['orderStartDate']=moment(json.orderTime[0]).valueOf()
        json['orderEndDate']=moment(json.orderTime[1]).valueOf()
      }
      console.log({...json,pageSize:this.pageSize,pageNum:this.pageNum})
      inOrderList({
          ...json,
          pageSize:this.pageSize,
          pageNum:this.pageNum
      }).then(res=>{
         this.loading=false;
         if(res.success){
            this.inPushOrderTableData=res.data&&res.data.list||[];
            this.total=res.data&&res.data.total
         }
      }).catch(err=>{
          this.loading=false;
          console.log(err)
      })

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .refund{
    .routerLink{
      color:#3399ea;
      white-space:nowrap;
      margin-right: 10px;
      cursor: pointer;
    }

     .link_dom{
       color: rgb(51, 153, 234);
       cursor: pointer;
     }

     .alertInfo{
        margin-bottom: 12px;
        >span{
          font-size: 14px;
          padding-right:20px;
        }   
     }
  }
</style>

