<template>
  <div class="ctabel">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :element-loading-text="elementLoadingText"
        :element-loading-background="elementLoadingBackground"
        :data="this._events.SelectionChange?allTableData:tableData"
         size="small"
        :border="border"
         @selection-change="handleSelectionChange"
        :style="tableStyle">

        <el-table-column
          v-for="item in tableConfig"
          :formatter="item.formatter"
          :key="item.lable"
          :type="item.columnType"
          :fixed="item.fixed"
          :width="item.width"
          :prop="item.prop"
          :label="item.label">
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="total>maxTotal&&!this._events.SelectionChange"
        :style="paginationStyle"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[...pageSizes,total]"
        :page-size="pageSize"
        size="small"
        :layout="layout"
        :total="total">
      </el-pagination>
  </div>
</template>

<script>

import _  from 'lodash';
import moment from 'moment';
import { mapGetters } from 'vuex'
import  * as Enum from "@/utils/enum.js";
export default {
   props: {
     loading: {
      type: Boolean,
      default: false
    },
    allTableData: {
      type: Array,
      default:()=>[]
    },
    config:{
      type: Array,
      default:()=> []
    },
    pageSizes:{
      type: Array,
      default:()=> [10, 20, 50, 100]
    },

    layout:{
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    maxTotal:{
      type: Number,
      default: 10
    },
    elementLoadingText:{
      type: String,
      default: "加载中"
    },
    elementLoadingBackground:{
      type: String,
      default: "rgba(255, 255, 255, 0.5)"
    },
    border:{
      type: Boolean,
      default: true
    },
    tableStyle:{
      type: String,
      default: "width: 100%"
    },
    paginationStyle:{
      type: String,
      default: "marginTop:16px"
    },
  },

  data() {
    return {
      tableConfig:[],
      currentPage:1,
      pageSize:10,
    }
  },
  
  beforeMount(){
    let tableConfig=_.cloneDeep(this.config);
    for(let i in tableConfig){
       if(tableConfig[i].type){
         if(tableConfig[i].useApi){
            tableConfig[i].formatter=(row, column, cellValue, index)=>this.mapConfig[tableConfig[i].type]&&this.mapConfig[tableConfig[i].type].find(v=>v.key==cellValue)&&this.mapConfig[tableConfig[i].type].find(v=>v.key==cellValue).value||cellValue
         }  else if(tableConfig[i].useLocalEnum){
            tableConfig[i].formatter=(row, column, cellValue, index)=>Enum[tableConfig[i].type]&&Enum[tableConfig[i].type].find(v=>v.value==cellValue)&&Enum[tableConfig[i].type].find(v=>v.value==cellValue).name||cellValue
         } else{
          switch(tableConfig[i].type){
            case 'time':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue?moment(cellValue).format(tableConfig[i].format||'YYYY-MM-DD'):'';break;
            case 'rate':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue+'%';break;
            case 'Boolean':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue?'是':'否' ;break;
            case 'index':tableConfig[i].formatter=(row, column, cellValue, index)=>(this.pageSize)*(this.currentPage-1)+index+1;break;
            case 'toFixed':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue&&Number(Number(cellValue).toFixed(2));break;
           }
         }
       } else if(tableConfig[i].dom){
         tableConfig[i].formatter=tableConfig[i].dom
       } else if(tableConfig[i].linkTo){
          tableConfig[i].formatter=(row, column, cellValue, index)=>{
            let json={};
            tableConfig[i].query.forEach(item=>{
                json[item.key]=row[item.value]
            })
            return  <router-link  to={{path:tableConfig[i].linkTo,query:json}} style={{color:'#3399ea'}}>{tableConfig[i].linkText?  tableConfig[i].linkText:cellValue}</router-link>
          }
          
        } else{
          tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue!==undefined&&cellValue!==null&&cellValue!==''?cellValue:'' 
       }
    }
    this.tableConfig=tableConfig;
  },

  computed: {
     ...mapGetters([
      'mapConfig',
    ]),

    total:{
      get: function () {
       return this.allTableData&&this.allTableData.length||0
      },
      set:function(){
        
      }
    },
     tableData:{
      get: function () {
       let from = this.pageSize*(this.currentPage-1);
       let to = from + this.pageSize;
       if(!this.allTableData){
         return []
       }
       return this.allTableData.slice(from,to)
      },
      set:function(){
        
      }
    }
  },


  methods: { 
     handleSizeChange(val){
        this.pageSize=val
     },
     
     handleCurrentChange(val){
       this.currentPage=val
     },

     handleSelectionChange(val){
       this.$emit('SelectionChange', val); 
     },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ctabel{
    width: 100%;
  }
  
</style>

