<template>
  <div class="deliverInfo">
    <div class="title">
      <slot name="title">包裹信息</slot>
    </div>
    <div class="content">
      
        <div class="item" v-for="item in detailData" :key="item.eventTime">
          <span class="fontBold ymd" >{{formatTime(item.eventTime,'YYYY-MM-DD')}}</span>
          <span class="fontBold week">{{formatTime(item.eventTime,'week')}}</span>
          <span class="time">{{formatTime(item.eventTime,'time')}}</span>
          <span class="des">{{item.remarkInfo}}</span>
        </div>
      
      
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data(){
    return {
      chineseWeek:['周日','周一','周二','周三','周四','周五','周六']
    }
  },
  props:{
    detailData:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    formatTime(val,type){
      switch(type){
        case 'YYYY-MM-DD': return moment(val).format(type);
        case 'week': return this.chineseWeek[moment(val).weekday()];
        case 'time': return moment(val).format('HH:MM:SS');
        default: return moment(val).format('YYYY-MM-DD HH:MM')
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .deliverInfo{
    border:1px solid #e2e2e2;
    width:100%;
    // min-width: 480px;
    overflow: auto;
    font-size: 14px;
    .title{
      height:26px;
      line-height: 26px;
      font-size: 18px;
      padding:0 50px;
      border-bottom: 1px solid #e2e2e2;
      text-align: left;
      background: #f2f2f2;
    }
    .content{
      margin: 50px; 
      // background: #f3f3f3;
      
      .item{
        min-height: 30px;
        border-left: 1px solid #d9d9d9;
        text-align: left;
        
        &::before{
          content: '';
          border: 3px solid #ddd;
          // background-color: #d9d9d9;
          display: inline-block;
          width: 5px;
          height: 5px;
          position: absolute;
          border-radius: 5px;
          margin-left: -4px;
          margin-right: 10px;
          // &::last-child{
          //   background-color: #fe4300;
          //   border-color: #f8e9e4;
          // }
        }
        &:last-child::before{
            background-color: #f00;
            border-color: #f4c;
            margin-left:-2px;
        }
        &:last-child{
          border-left:0;
        }
        span{
          display: inline-block;
        }
        .ymd{
          width:78px;
          margin-left: 12px; 
          margin-right: 8px;
        }
        .week{
          width: 32px;
        }
        .time{
          margin: 0 25px 0 8px;
          width: 48px;
        }
      }
    }
    .fontBlod{
      font-weight: 700;
    }
  }
</style>

