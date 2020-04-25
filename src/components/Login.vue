<template>
	<div class="login_container">
     <div class="login_box">
     	<!--头像区域-->
     	<div class="avatar_box">
     		<img src="../assets/logo.png"/>
     	</div>
     	<!--登陆表单-->
     	<!--用户名-->
     	<el-form  label-width="0px" 
     		ref="loginFormRef" 
     		:rules="loginFormRules" 
     		:model="loginForm" 
     		class="login_form">
		       <el-form-item prop="username">
		       <el-input v-model="loginForm.username"  prefix-icon="el-icon-user"></el-input>
		       </el-form-item>

	       <!--密码-->
		       <el-form-item prop="password">
		       <el-input v-model="loginForm.password"  prefix-icon="el-icon-unlock" type="password"></el-input>
		       </el-form-item>
	       
	       <!--按钮登陆-->
	       <el-form-item class="btns">
		       <el-button type="primary" @click="login">登陆</el-button>
		       <el-button type="info"  @click="resetLoginForm">重置</el-button>
	       </el-form-item>
       
       </el-form>
     </div>
 </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
  	return{
  		//登陆表单的数据绑定的对象
  		loginForm:{
  			username: 'admin',
  			password: '123456'
  		},
  		//这是表单验证规规则对象
  		loginFormRules:{
  			//验证用户名是否合法
  			username: [
  			{ required: true, message: '请输入用户名', trigger: 'blur' },
  			{ min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
  			],
  			//验证密码是否合法
  			password: [
  			{ required: true, message: '请输密码', trigger: 'blur' },
  			{ min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
  			]
  		}
  	}
  },
  methods: {
  	resetLoginForm(){
  		//重置登陆表单
  		this.$refs.loginFormRef.resetFields();
  		
  	},
  	login(){
  		//登陆axios请求
  		this.$refs.loginFormRef.validate(async valid => {
  			if(!valid) return;
  			const {data: res} =await this.$http.post("login",this.loginForm);
  			if(res.meta.status !== 200) return this.$message.error("登陆失败！好可惜");
  			this.$message.success("登陆成功！欢迎");
  			
  			window.sessionStorage.setItem("token",res.data.token);
  			
  			this.$router.push('/home')
  		})
  	}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
 .login_container{
 	background-color: darkcyan;
 	height: 100%;
 }
 .login_box{
 	width: 450px;
 	height: 300px;
 	position: absolute;
 	left: 50%;
 	top: 50%;
 	transform: translate(-50%,-50%);
 	background-color: white;
 	border-radius: 4px;
 	
 	.avatar_box{
 		height: 130px;
 		width: 130px;
 		border: 1px solid #eee;
 		border-radius: 50%;
 		padding: 10px;
 		box-shadow: 0 0 10px #ddd;
 		position: absolute;
 		left: 50%;
 		transform: translate(-50%, -50%);
 		background-color: #fff;
 		img{
 			width: 100%;
 			height: 100%;
 			border-radius: 50%;
 			background-color: #eee;
 		}
 	}
 }
 
 .btns{
 	display: flex;
 	justify-content: flex-end;
 }
 
 .login_form{
 	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
 }
</style>
