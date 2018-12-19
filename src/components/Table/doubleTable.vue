<template>
  <div class="ctabel">
         
        <!--  -->

      <el-table
        v-loading="loading"
        :element-loading-text="elementLoadingText"
        :element-loading-background="elementLoadingBackground"
        :data="tableDataEditable"
        :highlight-current-row="highlightCurrentRow"
        @current-change="handleCurrentRadioChange"
        :summary-method="summaryMethod"
        :border="border"
        :row-key="expandKey"
        :expand-row-keys="expands"
        :show-summary="showSummary"
        size="small"
        :style="tableStyle">
        <template v-if="childDataName">
          <el-table-column type="expand" fixed>
            <template slot-scope="childTable" v-if="childTable&&childTable.row&&childTable.row[childDataName]">
               <el-table :data="childTable.row[childDataName]"@select="handleSelection" @select-all="handleSelection" @expand-change="expandChange">
                 <el-table-column type="selection" width="55" v-if="childCanSelect" @expand-change="expandChange"></el-table-column>
                <el-table-column
                  v-for="item in childTableConfigFilter"
                  :fixed="item.fixed"
                  :width="item.width"
                  :key="item.label"
                  :label="item.label"
                  :prop="item.prop"
                >
                  <!-- <span v-if="item.linkTo">
                    <router-link :to="{path:item.linkTo,query:mapFormatter(item.query,childTable.row[childDataName])}" style="color:#3399ea">{{item.linkText?  item.linkText:childTable.row[childDataName][item.prop]}}</router-link>
                  </span>
                  <span v-else-if="item.useIf == 'files'">
                    <el-dropdown>
                              <span class="el-dropdown-link">
                                查看附件<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(file,i) in childTable.row[childDataName][item.prop]" :key="file.path">
                                      <a class="el-dropdown-link"  target="blank"   :href="file.path">{{file.name||`附件${i+1}`}}</a>
                                    </el-dropdown-item>
                                  
                              </el-dropdown-menu>
                            </el-dropdown>
                  </span>
                  <span v-else-if="typeof item.formatter == 'function'">
                    {{item.formatter(childTable.row[childDataName],{},childTable.row[childDataName][item.prop],childTable.row[childDataName].$index)}}
                  </span>
                
                  <span v-else>
                    {{childTable.row[childDataName][item.prop]}}1231231231231
                  </span> -->
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </template>
          
          <el-table-column
            v-for="item in tableConfig"
            :fixed="item.fixed"
            :width="item.width"
            :key="item.label"
            :label="item.label">
             <template slot-scope="scope">
                <span v-if="item.linkTo">
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
            v-if="handleButtonMap.length>0"
            fixed="right"
            label="操作" >
            <template slot-scope="scope">
                <!-- <div style="width:160px">
                  {handleButtonMap.map(thisButton => <el-button size="mini" type="primary" onClick={thisButton.handle}>thisButton.title</el-button>)}

                   
                </div> -->
                 <!-- <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">详情</el-button> -->
                 <template v-for="thisButton in handleButtonMap" >
                    <el-button :key="thisButton.title" :size="thisButton.size ?thisButton.size : 'size'" :type="thisButton.type ?thisButton.type : 'text'" @click="thisButton.handle(scope.$index, scope.row)">{{thisButton.title}}</el-button>
                 </template>
               
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
    handleButtonMap:{
      type: Array,
      default:()=>[]
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
    //子表配置
    childDataName:{
      type: String,
      default: ''
    },
    childCanSelect:{//子表能否勾选
      type:Boolean,
      defalut:false
    },
    childTableConfig:{
      type: Array,
      default:()=>[]
    },
    // currentRadioChange:{
    //   type:Function,
    // },
    accordionExpand:{
      type:Boolean,
      default:false,
    },
    expandKey:{
      type:String,
      default:'',
    }
  },

  data() {
    return {
      tableConfig:[],
      tableDataEditable: [],
      childTableConfigFilter:[],
      expands: [],
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
    let childTableConfigFilter = [...this.childTableConfig]
    let tableConfig=[...this.config];
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
    for(let i in childTableConfigFilter){
      if(childTableConfigFilter[i].type){
        if(childTableConfigFilter[i].useApi){
            childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>this.mapConfig[childTableConfigFilter[i].type].find(v=>v.key==cellValue)&&this.mapConfig[childTableConfigFilter[i].type].find(v=>v.key==cellValue).value||cellValue
         } else if(childTableConfigFilter[i].useLocalEnum){
           
           
            childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>{
              return Enum[childTableConfigFilter[i].type].find(v=>v.value==cellValue)&&Enum[childTableConfigFilter[i].type].find(v=>v.value==cellValue).name||cellValue}
         } 
         else{
          switch(childTableConfigFilter[i].type){
            case 'time':childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>cellValue?moment(cellValue).format(tableConfig[i].format||'YYYY-MM-DD'):'';break;
            case 'Boolean':childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>cellValue?'是':'否' ;break;
            case 'index':childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>(this.pageSize)*(this.currentPage-1)+index+1;break;
            case 'toFixed':childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>cellValue&&Number(Number(cellValue).toFixed(2));break;

           }
         }  
        } else{
          childTableConfigFilter[i].formatter=(row, column, cellValue, index)=>cellValue!==undefined&&cellValue!==null&&cellValue!==''?cellValue:'' 
       }
    }
    this.tableConfig=tableConfig;
    this.childTableConfigFilter = childTableConfigFilter
 
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

     handleCurrentRadioChange(currentRow, oldCurrentRow){
        if(this.accordionExpand){
          this.expands = [];
          this.expands.push(currentRow[this.expandKey]);
        }
        this.$emit('currentRadioChange', currentRow, oldCurrentRow); 
     },
     handleSelection(val,row){
       this.$emit('childDataSelect',val)
     },
     expandChange(row, expandedRows){
       console.log(row, expandedRows,123365489645)
     },
      // goeditrow(index,type) {
       
      //   let data=_.cloneDeep(this.tableDataEditable);

      //   data[index].editable = !data[index].editable
      //   this.tableDataEditable=data;
      //   if(type!='edit'){
      //     this.$emit('dataChange',index,type,data[index])//触发父组件方法，数据更改
      //   }
      // },

      // handleDelete(index, row) {
      //   this.tableDataEditable.splice(index, 1)
      //   this.$emit('dataChange',index,'delete')
      // },
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

