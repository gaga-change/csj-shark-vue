<template>
  <div class="ctabel">
      <el-table
        v-loading="loading"
        :element-loading-text="elementLoadingText"
        :element-loading-background="elementLoadingBackground"
        :data="tableDataEditable"
        :highlight-current-row="highlightCurrentRow"
        @current-change="handleCurrentRedioChange"
        :summary-method="summaryMethod"
        :border="border"
        :show-summary="showSummary"
        size="small"
        :style="tableStyle">

          <el-table-column
            v-for="item in tableConfig"
            :fixed="item.fixed"
            :width="item.width"
            :key="item.label"
            :label="item.label">
             <template slot-scope="scope">
                <template v-if="scope.row.editable&&item.editable">
                  <template v-if="item.editType">
                    <el-input
                      size="mini"
                      style="width:70px"
                      v-if="item.editType"
                      :type="item.editType"
                      v-model="scope.row[item.prop]" >
                    </el-input>
                  </template>
                  <template v-else>
                    <el-input
                    size="mini"
                    style="width:70px"
                    v-model="scope.row[item.prop]" >
                    </el-input>
                  </template>
                </template>
                <span v-else-if="item.linkTo">
                  <router-link :to="{path:item.linkTo,query:mapFormatter(item.query,scope.row)}" style="color:#3399ea">{{item.linkText?  item.linkText:scope.row[item.prop]}}</router-link>
                </span>
                <span v-else-if="item.useIf == 'files'">
                  <el-dropdown>
                             <span class="el-dropdown-link">
                               查看附件<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                             <el-dropdown-menu slot="dropdown">
                               <el-dropdown-item v-for="(file,i) in scope.row[item.prop]" :key="file.path">
                                    <a class="el-dropdown-link"  target="blank"   :href="file.path">{{file.name||`附件${i+1}`}}</a>
                                  </el-dropdown-item>
                                
                             </el-dropdown-menu>
                          </el-dropdown>
                </span>
                <span v-else-if="typeof item.formatter == 'function'">
                  {{item.formatter(scope.row,{},scope.row[item.prop],scope.$index)}}
                </span>
              
                <span v-else>
                  {{scope.row[item.prop]}}
                </span>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            fixed="right"
            label="操作" >
            <template slot-scope="scope">
                <div style="width:160px">
                    <el-button v-if="scope.row.editable" type="success" @click="goeditrow(scope.$index,'confirm')" size="mini" >确定</el-button>
                    <el-button v-else @click="goeditrow(scope.$index,'edit')" size="mini" >编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </div>
            </template>
          </el-table-column>
      </el-table>

      <el-pagination
        :style="paginationStyle"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="tableCurrentPage"
        :page-sizes="pageSizes"
        size="small"
        :page-size="tablePageSize"
        :layout="layout"
         v-if="total>maxTotal"
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
    highlightCurrentRow:{
       type: Boolean,
       default: false    
    },
    useRadio:{
      type: Boolean,
      default: false      
    },
    showSummary:{
      type:Boolean,
      defalut:false
    },
    summaryMethod:{
      type: Function,
      default: ()=>{}    
    },
    tableData: {
      type: Array,
      default:()=>[]
    },
    config:{
      type: Array,
      default:()=> []
    },
    currentPage:{
      type: Number,
      default: 1
    },
    pageSizes:{
      type: Array,
      default:()=> [10, 50, 100, 500]
    },
    pageSize:{
      type: Number,
      default: 10
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
    total:{
      type: Number,
      default: 0
    },
   
  },

  data() {
    return {
      tableConfig:[],
      tableDataEditable: [],
    }
  },
  created(){

  },
  watch:{
    tableData(){
      this.tableDataEditable = [...this.tableData]
    }
    
  },
  beforeMount(){
    this.tableDataEditable = [...this.tableData]
    let tableConfig=_.cloneDeep(this.config);
    for(let i in tableConfig){
       if(tableConfig[i].type){
         if(tableConfig[i].useApi){
            tableConfig[i].formatter=(row, column, cellValue, index)=>this.mapConfig[tableConfig[i].type].find(v=>v.key==cellValue)&&this.mapConfig[tableConfig[i].type].find(v=>v.key==cellValue).value||cellValue
         } else if(tableConfig[i].useLocalEnum){
           
           
            tableConfig[i].formatter=(row, column, cellValue, index)=>{
              return Enum[tableConfig[i].type].find(v=>v.value==cellValue)&&Enum[tableConfig[i].type].find(v=>v.value==cellValue).name||cellValue}
         } 
         else{
          switch(tableConfig[i].type){
            case 'time':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue?moment(cellValue).format(tableConfig[i].format||'YYYY-MM-DD'):'';break;
            case 'Boolean':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue?'是':'否' ;break;
            case 'index':tableConfig[i].formatter=(row, column, cellValue, index)=>(this.pageSize)*(this.currentPage-1)+index+1;break;
            case 'toFixed':tableConfig[i].formatter=(row, column, cellValue, index)=>cellValue&&Number(Number(cellValue).toFixed(2));break;

           }
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

    tablePageSize:{
      get: function () {
       return this.pageSize
      },
      set:function(){
        
      }
    },

    tableCurrentPage: {
      get: function () {
       return this.currentPage
      },
      set:function(){

      }
    },

  },

  methods: { 
     handleSizeChange(val){
        this.$emit('sizeChange', val); 
     },
     
     handleCurrentChange(val){
        this.$emit('currentChange', val); 
     },

     handleCurrentRedioChange(currentRow, oldCurrentRow){
       this.$emit('currentRedioChange', currentRow, oldCurrentRow); 
     },
    
      goeditrow(index,type) {
       
        let data=_.cloneDeep(this.tableDataEditable);

        data[index].editable = !data[index].editable
        this.tableDataEditable=data;
        if(type!='edit'){
          this.$emit('dataChange',index,type,data[index])//触发父组件方法，数据更改
        }
      },

      handleDelete(index, row) {
        this.tableDataEditable.splice(index, 1)
        this.$emit('dataChange',index,'delete')
      },
      mapFormatter(target, data){
        let json={};
        target.forEach(item=>{
          json[item.key]=data[item.value]
        })
        return json
      },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .ctabel{
    width: 100%;
    .el-radio__label{
      display: none;
    }
  }
</style>

