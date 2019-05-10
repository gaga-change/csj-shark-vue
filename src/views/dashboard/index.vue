<template>
  <div class="dashboard-container">
    <div class="menucontent">
    	<img :src="bgpath" alt="" style="width:100%;background:contain;">
    	<div class="menudetail">
    		<el-row :gutter="20">
	    		<el-col :span="6">
	    			<router-link to="/inwarehousing/planIn" v-if="this.totalmenu.indexOf('planIn')>-1">
	    				<div class="singlecol" >
		    				<img :src="printpath" alt="" class="singleimg">
		    				<p>打印入库计划单</p>
		    			</div>
	    			</router-link>
	    		</el-col>
	    		<el-col :span="6">
	    			<router-link to="/inwarehousing/inrecord">
	    				<div class="singlecol" v-if="this.totalmenu.indexOf('inrecord')>-1">
		    				<img :src="recordpath" alt="" class="singleimg">
		    				<p>到货登记</p>
		    			</div>
	    			</router-link>
	    		</el-col>
	    		<el-col :span="6">
	    			<router-link to="/inwarehousing/arrival" v-if="this.totalmenu.indexOf('arrival')>-1">
	    				<div class="singlecol">
		    				<img :src="salepath" alt="" class="singleimg">
		    				<p>上架</p>
		    			</div>
	    			</router-link>
	    		</el-col>
	    		<el-col :span="6">
	    			<router-link to="/inwarehousing/inboundOrder" v-if="this.totalmenu.indexOf('inboundOrder')>-1">
	    				<div class="singlecol">
		    				<img :src="Inpath" alt="" class="singleimg">
		    				<p>入库单</p>
		    			</div>
	    			</router-link>
	    		</el-col>
	    		<el-col :span="6">
	    			<router-link to="/outwarehousing/outboundPlan" v-if="this.totalmenu.indexOf('outboundPlan')>-1">
	    				<div class="singlecol">
		    				<img :src="outpath" alt="" class="singleimg">
		    				<p>打印出库计划单</p>
		    			</div>
	    			</router-link>
	    		</el-col>
	    		<el-col :span="6">
	    			<div class="singlecol" v-if="this.totalmenu.indexOf('assignment')>-1">
	    				<!-- <router-link to="/inwarehousing/planIn">
	    				</router-link> -->
	    				<img :src="assignmentpath" alt="" class="singleimg" >
	    				<p>波次分配</p>
	    			</div>
	    		</el-col>
	    		<el-col :span="6">
	    			<router-link to="/outwarehousing/pickingtask" v-if="this.totalmenu.indexOf('pickingtask')>-1">
	    				<div class="singlecol">
		    				<img :src="pickpath" alt="" class="singleimg" >
		    				<p>拣货</p>
		    			</div>
	    			</router-link>
	    		</el-col>
	    		<el-col :span="6">
	    			<div class="singlecol" v-if="this.totalmenu.indexOf('confirm')>-1">
	    				<!-- <router-link to="/inwarehousing/planIn">
	    				</router-link> -->
	    				<img :src="confirmpath" alt="" class="singleimg">
	    				<p>复核</p>
	    			</div>
	    		</el-col>
	    	</el-row>
    	</div>
    </div>
    <div class="todolist">
    	<h4 class="textTitle"><i>我的待办</i></h4>
    	<el-row class="tododetail">
    		<el-col>
    		<span><i>待收货:<u>{{receive}}</u>/条</i></span>
    		</el-col>
    	</el-row>
    	<el-row class="tododetail">
    		<el-col>
    			<span class="onsale"><i>待上架:<u>{{put}}</u>/条</i></span>
    		</el-col>
    	</el-row>
    	<el-row class="tododetail">
    		<el-col>
    			<span class="picking"><i>待捡货:<u>{{sort}}</u>/条</i></span>
    		</el-col>
    	</el-row>
    	<el-row class="tododetail">
    		<el-col>
    			<span class="confirm"><i>待复核:<u>{{review}}</u>/条</i></span>
    		</el-col>
    	</el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bgpath from '@/assets/images/bgimg.png'
import printpath from '@/assets/images/print.png'
import recordpath from '@/assets/images/inrecord.png'
import salepath from '@/assets/images/onsale.png'
import Inpath from '@/assets/images/warehousing.png'
import outpath from '@/assets/images/outwarehousing.png'
import assignmentpath from '@/assets/images/assignment.png'
import pickpath from '@/assets/images/pickingtask.png'
import confirmpath from '@/assets/images/confirm.png'
import { todolist } from '@/api/login'

let count = 0
 export default {
    name:'dashboard',
    data(){
    	return{
    		bgpath,
    		printpath,
    		recordpath,
    		salepath,
    		Inpath,
    		outpath,
    		assignmentpath,
    		pickpath,
    		confirmpath,
    		receive:null,
    		put:null,
    		sort:null,
    		review:null
    	}
    },
    computed: {
	    ...mapGetters([
	      'totalmenu'
	    ])
	},
    created(){
    	this.totallist()
    },
    methods: {
    	totallist(){
    		todolist().then(res=>{
    			if(res.success){
    				if(res.data){
    					this.receive=res.data.receive?res.data.receive:0
	    				this.put=res.data.put?res.data.put:0
	    				this.sort=res.data.sort?res.data.sort:0
	    				this.review=res.data.review?res.data.review:0
    				}
    			}else{
    				this.$message({type:'error',message:'获取代办失败'})
    			}
    		}).catch(err =>{
    			this.$message({type:'error',message:'获取代办失败'})
    		})
    	}
    }
 }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@media screen and (max-width: 1921px) {
    .dashboard-container {
      font-size:30px;
    }
  }
  @media screen and (max-width: 1681px) {
    .dashboard-container {
      font-size:26.25px;
    }
  }
  @media screen and (max-width: 1601px) {
    .dashboard-container {
      font-size:25px;
    }
  }
  @media screen and (max-width: 1441px) {
    .dashboard-container {
      font-size:22.5px;
    }
  }
  @media screen and (max-width: 1367px) {
    .dashboard-container {
      font-size:21.34px;
    }
  }
  @media screen and (max-width: 1281px) {
    .dashboard-container {
      font-size:20px;
    }
  }
  @media screen and (max-width: 1025px) {
    .dashboard-container {
      font-size:16px;
    }
  }
.dashboard-container{
	padding:10px;
	position:relative;
	.menucontent{
		margin-right:8.4em;
		padding-bottom:1em;
		height:26.67em;
		background:#fff;
		box-shadow:0 .1em .3em .1em #F2F2F2;
	}
	.menudetail{
		padding-left:1.8em;
	}
	.singlecol{
		margin-top:1.2em;
		text-align:center;
		width:8.2em;
		height:7.5em;
		box-shadow:0 .1em .3em .1em #F2F2F2;
		border-bottom:2px solid #3486FD;
		cursor:pointer;
		&:hover{
			box-shadow:0 .1em .3em .1em #c4c4c4;
		}
		.singleimg{
			margin-top:2.2em;
			width:2.33em;
			height:2.33em;
		}
		p{
			font-size:0.6em;
			font-weight:bold;
		}
	}
	.todolist{
		position:absolute;
		right:0.67em;
		top:0.33em;
		width:7.33em;
		height:26.67em;
		background:#fff;
		box-shadow:0 .1em .3em .1em #F2F2F2;
		padding-left:0.33em;
		.textTitle{
			margin:0.3em 0 1em;
			padding-left:0.33em;
			position:relative;
			height:0.5em;
			i{
				font-style:normal;
				font-size:0.5em;
				line-height:0.5em;
			}
		}
    	.textTitle:before{
    		content:'';
    		background:#5769d9;
    		width:0.2em;
    		height:0.5em;
    		position:absolute;
    		left:0;
    		top:0.45em;
    		border-radius:0.6em;
    	}
    	.tododetail{
    		margin-top:0.5em;
    	}
    	span{
    		display:block;
    		height:1em;
    		position:relative;
    		padding-left:1.3em;
    		i{
    			font-style:normal;
    			font-size:0.5em;
    			line-height:1em;
    			u{
					color:#227CFF;
					text-decoration:none;
				}
    		}
    		&:before{
    			content:'';
    			position:absolute;
    			top:0.2em;
    			left:0;
    			width:1em;
    			height:1em;
    			background:url(/static/images/deliverylist.png) center center no-repeat;
    			background-size:1em 1em;
    		}
    	}
    	.onsale{
    		&:before{
    			background-image:url(/static/images/salelist.png);
    		}
    	}
    	.picking{
    		&:before{
    			background-image:url(/static/images/pickingtasklist.png);
    		}
    	}
    	.confirm{
    		&:before{
    			background-image:url(/static/images/confirmlist.png);
    		}
    	}
	}
	
}
</style>
