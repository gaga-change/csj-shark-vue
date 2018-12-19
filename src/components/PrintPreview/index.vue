<template>
  <el-dialog title="打印预览" :visible.sync="dialogVisible" :style="printCss">
    <!-- 当前只能预览打印同规格的 样式固定 -->
    <div id="printContent">
       <template v-if="contentConfig.printType=='labelPrint'">
        <div v-for="label in printData" :key="label">
          <div style=" width:80px;height:80px" :style="printCss" v-for="n in (label.times|| 0)" :key="n">
            <div v-for="labelConfig in contentConfig" :key="labelConfig" class="labelPrint">
              <span>{{labelConfig.name}}：</span> <span>{{label[labelConfig.prop]}}</span>
            </div>
          </div>
        </div>
      </template>
      <slot name="packListPrint"></slot>
      
    </div>
   
    <span slot="footer" class="dialog-footer">
          <el-button size="mini"   @click="handleClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="letPrint">打印</el-button>
          </span>
  </el-dialog>
</template>
<script>
/**
 * printData 需打印的数据
 * contentConfig 打印的容器
 */
let labelPrint = "<style type='text/css'>.labelPrint{font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;font-weight:600;border:'1px solid #ddd'}</style>"
import { MakePrint } from '@/utils'
export default {
  name:"PrintPreview",
  data(){
    return {
      dialogVisible:false,
      printStyle:{
        labelPrint
      }
    }
  },
  props:{
    dialogVisiblePrint:{
      default:false,
      type:Boolean,
    },
    printData:{
      default: () => []
    },
    contentConfig:{

    },
    printCss:{
      default:()=>{
        return {
          width:'200px',
          height: '333px',
          border:'1px solid #foo'
        }
      },
      type:Object
    }
  },
  computed:{
    // printStyle(){
    //   var thisStyle = `<style type='text/css'>`;
    //   var pritTypeDefaultStyle = ``
    //   if(this.contentConfig.printType=='labelPrint'){
    //     pritTypeDefaultStyle = ''
    //   }
    //   thisStyle += `</style>`
    //   return thisStyle
    // }
  },
  methods:{
    letPrint(){
      let contentAll = document.getElementById('printContent').innerHTML
      
      MakePrint(contentAll,this.printStyle[this.contentConfig.printType])
    }
  }
}
</script>
 <style scoped>
 .labelPrint{font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;font-weight:600;border:'1px solid #ddd'}
</style>

