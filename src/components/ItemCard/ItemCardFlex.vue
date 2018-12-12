<template>
  <div :style="boxStyle">
  <el-card class="box-card" v-loading="loading"  element-loading-text="加载中..." shadow="never" :body-style="bodyStyle" >
   <el-row>
     <el-col  class="card-list"  v-for="item in config"  :key="item.prop||item.title"  :span="item.span||6" >
        <span class="card-title">{{item.title}}</span> : 
        <span v-if="item.useIf=='files'">
            <el-dropdown v-if="item.prop&&cardData[item.prop]&&cardData[item.prop].length>0">
            <span class="el-dropdown-link">
              查看附件<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v,i) in cardData[item.prop]" :key="v.path" >
                <a class="el-dropdown-link"  target="blank"   :href="v.path">{{v.name||`附件${i+1}`}}</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span class="card-text" v-else-if="item.useIf=='link'">
          <router-link  :to="{path:item.linkTo,query:mapFormatter(item.query),params:mapFormatter(item.params)}" style="color:#3399ea">{{item.name?item.name:cardData[item.prop]}}</router-link>
        </span>
        <span class="card-text" v-else-if="item.useIf=='linkDom'">
          <!-- {{
             formatter(item.type,cardData[item.prop],item.useApi,item.useApi, item.userFormatter,item.useLocalEnum,item.format)
          }} -->
          <router-link  :to="{path:item.userFormatter,}" style="color:#3399ea;margin-left:8px">{{item.name}}</router-link>
        </span>
         <span class="card-text" v-else-if="item.useIf=='userFormatter'">
         {{
             formatter(item.type,cardData,item.useApi, item.userFormatter,item.useLocalEnum,item.format)
          }}
        </span>
        <span class="card-text" v-else>
          {{
             formatter(item.type,cardData[item.prop],item.useApi, item.userFormatter,item.useLocalEnum,item.format)
          }}
        </span>

      </el-col>
   </el-row>
  </el-card>   
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment';
import  * as Enum from "@/utils/enum.js";
export default {
   props: {
    config:{
      type: Array,
      required:true
    },
    cardData:{
      type: Object,
      required:false,
      default:{}
    },
    loading:{
      type:Boolean,
      required:false,
      default:false
    },
    boxStyle:{
      type: String,
      required:false,
      default:'marginBottom:12px'
    },
    bodyStyle:{
      type: String,
      required:false,
      default:'padding:12px'
    }
  },

    methods:{
      formatter(type,value,useApi,userFormatter,useLocalEnum,format){
        
        if(value!=undefined){
          if(useApi){
            return this.mapConfig[type].find(v=>v.key==value)&&this.mapConfig[type].find(v=>v.key==value).value||''
          } else if(useLocalEnum){
            return Enum[type].find(v=>v.value==value)&&Enum[type].find(v=>v.value==value).name||''
          }else if(typeof userFormatter=='function'){  
            return userFormatter(this.cardData)
          }  else{
            switch(type){
              case 'time': return moment(value).format(format||'YYYY-MM-DD');
              case 'boolean': return Number(value)?'是':'否';
              default : return value
            }
          }
        } else{
          return ''
        }
      },
      
      mapFormatter(arr=[],data=this.cardData){
        let json={}
        arr.forEach(v=>{
            json[v.key]=data[v.value]
        })

        return json;
      }
    },

    computed: {
     ...mapGetters([
       'mapConfig',
     ])
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .card-list{
    margin-bottom: 12px;
    &:last-child{
      margin-bottom: 0;
    }
  }
   .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

