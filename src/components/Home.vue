<template>
	
	<el-container class="home_container">
		<!--头部区域-->
	  <el-header>
	  	<div id="">
	  		<img src="../assets/基础信息管理-01.png" style="width: 45px; height: 45px;"/>
	  		<span>拼淘购物后台管理系统</span>
	  	</div>
	  	<el-button type="info" @click="logout">退出</el-button>
	  </el-header>
	  <!--主体区域-->
		  <el-container>
		  	<!--侧边栏-->
			    <el-aside :width="isCollapse ? '64px' : '200px'">
			    	<div class="toggle-button" @click="toggleCollapse">|||</div>
			    	<!--侧边栏菜单区-->
					<el-menu
				      background-color="#545c64"
				      text-color="#fff"
				      active-text-color="#008B8B"
				      unique-opened
				      :collapse="isCollapse"
				      :collapse-transition="false"
				      :router="true"
				      :default-active="this.$router.history.current.path"
				      >
				      <!--一级菜单-->
				      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
				      	<!--一级菜单模板区域-->
				        <template slot="title">
				        <!--图标-->
				          <i :class="iconsObj[item.id]"></i>
				          <!--文本-->
				          <span>{{item.authName}}</span>
				        </template>
				        <!--二级菜单-->
			             <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
			             	 <template slot="title">
				        <!--图标-->
				          <i class="el-icon-s-grid"></i>
				          <!--文本-->
				          <span>{{subItem.authName}}</span>
				        </template>
			             </el-menu-item>
				      </el-submenu>
				    </el-menu>
			    </el-aside>
			<!--右侧主体区-->
			    <el-main>
			    	<router-view></router-view>
			    </el-main>
		  </el-container>
    </el-container>
</template>

<script>
	export default{
		name:'Home',
		data() {
			return {
				menulist: [],
				iconsObj:{
					'125':'el-icon-user-solid',
					'103':'el-icon-set-up',
					'101':'el-icon-shopping-bag-1',
					'102':'el-icon-tickets',
					'145':'el-icon-s-data'
				},
				isCollapse:false
			}
		},
		created(){
			this.getMenuList()
		},
		methods:{
			logout(){
				window.sessionStorage.clear();
				this.$router.push("/login");
			},
			//获取所有的菜单
			 async getMenuList() {
			 	const {data: res} = await this.$http.get('menus')
			 	if(res.meta.status !==200) return this.$message.error(res.meta.msg)
			 	this.menulist = res.data
			 	console.log(res)
			 },
			 //点击按钮菜单折叠与展开
			 toggleCollapse(){
			 	this.isCollapse = !this.isCollapse
			 }
		}
	}
</script>

<style lang="less" scoped>
	.el-header{
		background-color: darkslategrey;
		display: flex;
		justify-content: space-between;
		padding-left: 0px;
		align-items: center;
		color: white;
		font-size: 22px;
	    >div{
	    	display: flex;
	    	align-items: center;
	    	span{
	    		margin-left: 15px;
	    	}
	    }
	}
	.el-aside{
		background-color: #2F4F4F;
		.el-menu{
			border-right: none;
		}
	}
	.el-main{
		background-color: #EEEEEE;
	}
	.home_container{
		height: 100%;
	}
	.toggle-button{
		background-color: #4a5064;
		font-size: 10px;
		line-height: 24px;
		color: white;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>