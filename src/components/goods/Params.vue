<template>
	<div>
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!--卡片视图区域-->
		<el-card>
			<!--警告区域-->
			<el-alert 
				show-icon
				title="注意：只允许为三级分类设置相关参数！" 
				type="warning"
				:closable="false">
			</el-alert>
				
			<!--选择商品分类区域-->	
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					<!--选择商品分类的级联选择框-->
					<el-cascader
				    v-model="selectedCateKeys"
				    :options="catelist"
				    :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
				    @change="handleChange"
				    clearable>
				</el-cascader>
				</el-col>
			</el-row>
			
			<!--tab页签区域-->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!--添加动态参数面板-->
			    <el-tab-pane label="动态参数" name="many">
			    	<el-button type="primary" 
			    		size="mini" 
			    		:disabled="isBtnDisables"
			    		@click="addDialogVisible = true">添加参数</el-button>
			    <!--动态参数表格-->
			    <el-table :data="manyTableData" border stripe>
			    	<!--展开行-->
			    	<el-table-column type="expand">
			    		<template slot-scope="scope">
			    			<!--循环渲染tag标签-->
			    			<el-tag 
			    				v-for="(item,i) in scope.row.attr_vals" 
			    				:key="i" 
			    				closable
			    				@close="handleClose(i,scope.row)">{{item}}</el-tag>
			    		    <!--输入的文本框-->
			    		    <el-input
							  class="input-new-tag"
							  v-if="scope.row.inputVisible"
							  v-model="scope.row.inputValue"
							  ref="saveTagInput"
							  size="small"
							  @keyup.enter.native="handleInputConfirm(scope.row)"
							  @blur="handleInputConfirm(scope.row)"
							>
							</el-input>
							<!--添加的按钮-->
							<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
			    		</template>
			    	</el-table-column>
			    	<!--索引列-->
			    	<el-table-column type="index"></el-table-column>
			    	<el-table-column label="参数名称" prop="attr_name"></el-table-column>
			    	<el-table-column label="操作">
			    		<template slot-scope="scope">
			    			<el-button type="primary" 
			    				icon="el-icon-edit" 
			    				size="mini"
			    				@click="showEditDialog(scope.row.attr_id)">编辑</el-button>
			    			<el-button type="danger" 
			    				icon="el-icon-delete" 
			    				size="mini"
			    				@click="removeParams(scope.row.attr_id)">删除</el-button>
			    		</template>
			    	</el-table-column>
			    </el-table>
			    </el-tab-pane>
			    <!--添加静态属性面板-->
			    <el-tab-pane label="静态属性" name="only">
			    	<!--添加属性按钮-->
			    	<el-button type="primary" 
			    		size="mini" 
			    		:disabled="isBtnDisables"
			    		@click="addDialogVisible = true">添加属性</el-button>
			    <!--静态属性表格-->
			    <el-table :data="onlyTableData" border stripe>
			    	<!--展开行-->
			    	<el-table-column type="expand">
			    		<el-table-column type="expand">
			    		<template slot-scope="scope">
			    			<!--循环渲染tag标签-->
			    			<el-tag 
			    				v-for="(item,i) in scope.row.attr_vals" 
			    				:key="i" 
			    				closable
			    				@close="handleClose(i,scope.row)">{{item}}</el-tag>
			    		    <!--输入的文本框-->
			    		    <el-input
							  class="input-new-tag"
							  v-if="scope.row.inputVisible"
							  v-model="scope.row.inputValue"
							  ref="saveTagInput"
							  size="small"
							  @keyup.enter.native="handleInputConfirm(scope.row)"
							  @blur="handleInputConfirm(scope.row)"
							>
							</el-input>
							<!--添加的按钮-->
							<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
			    		</template>
			    	</el-table-column>
			    	</el-table-column>
			    	<!--索引列-->
			    	<el-table-column type="index"></el-table-column>
			    	<el-table-column label="属性名称" prop="attr_name"></el-table-column>
			    	<el-table-column label="操作">
			    		<template slot-scope="scope">
			    			<el-button type="primary"
			    				 icon="el-icon-edit"
			    				 size="mini"
			    				 @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
			    			<el-button type="danger" 
			    				icon="el-icon-delete" 
			    				size="mini"
			    				@click="removeParams(scope.row.attr_id)">删除</el-button>
			    		</template>
			    	</el-table-column>
			    </el-table>
			    </el-tab-pane>
			</el-tabs>
		</el-card>
		<!--添加参数的对话框-->
		<el-dialog
		  :title="'添加' + titleText"
		  :visible.sync="addDialogVisible"
		  width="50%"
		  @close="addDialogClosed"
		  >
		  <!--添加参数验证对话框-->
		  <el-form :model="addForm" 
		  	:rules="addFormRules" 
		  	ref="addFormRef" 
		  	label-width="100px">
			  <el-form-item :label="titleText" prop="attr_name">
			    <el-input v-model="addForm.attr_name"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addParams">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!--修改参数的对话框-->
		<el-dialog
		  :title="'修改' + titleText"
		  :visible.sync="editDialogVisible"
		  width="50%"
		  @close="editDialogClosed"
		  >
		  <el-form :model="editForm" 
		  	:rules="editFormRules" 
		  	ref="editFormRef" 
		  	label-width="100px">
			  <el-form-item :label="titleText" prop="attr_name">
			    <el-input v-model="editForm.attr_name"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editParams">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		name:"Params",
		data(){
			return {
				//商品分类列表
				catelist:[],
				//级联选择框双向绑定到的数组
				selectedCateKeys:[],
				//被激活的页签的名称
				activeName: 'many',
				//动态参数数据
				manyTableData:[],
				//静态参数的数据
				onlyTableData:[],
				//对话框的显示与隐藏
				addDialogVisible:false,
				//添加参数的表单数据对象
				addForm:{
					attr_name:''
				},
				//添加表单验证规则对象
				addFormRules:{
					attr_name:[
					{required:true,message:'请输入参数名称',trigger:'blur'}
					]
				},
				//控制修改对话框的显示与隐藏
				editDialogVisible:false,
					//修改表单数据对象
				editForm:{
					attr_name:''
				},
				//修改表单验证规则对象
				editFormRules:{
					attr_name:[
					{required:true,message:'请输入参数名称',trigger:'blur'}
					]
				}
			}
		},
		created(){
			this.gteCateList()
		},
		methods:{
			//获取所有得商品分类列表
			async gteCateList(){
				const {data:res} = await this.$http.get('categories')
				if(res.meta.status !== 200){
					return	this.$message.error('获取商品分类失败！')
					}
				this.catelist = res.data
				console.log(this.catelist)
			},
			//级联选择框选中项变化，会触发这个函数
			handleChange(){
				this.getParamsData()
			},
			//tab页签的点击处理函数
			handleTabClick(){
				console.log(this.activeName)
				this.getParamsData()
			},
			//获取参数列表数据
			async getParamsData(){
				//证明选中不是三级分类
				if(this.selectedCateKeys.length !== 3){
					this.selectedCateKeys = []
					this.manyTableData = []
					this.onlyTableData = []
					return
				}
				//证明选中是三级分类
				console.log(this.selectedCateKeys)
				//根据所选分类的id，和当前所处的面板，获取对应的参数
				const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
				
				if(res.meta.status !== 200){
					return	this.$message.error('获取参数列表失败！')
					}
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
					//控制文本框的显示与隐藏
					item.inputVisible = false
					//文本框中的输入值
					item.inpuutValue = ''
				})
				if(this.activeName === 'many'){
					this.manyTableData = res.data
				}else{
					this.onlyTableData = res.data
				}
			},
			//对话框关闭清空事件
			addDialogClosed(){
				this.$refs.addFormRef.resetFields()
			},
			editDialogClosed(){
				this.$refs.editFormRef.resetFields()
			},
			//点击按钮添加参数
			addParams(){
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) return
					const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
					{
						attr_name:this.addForm.attr_name,
						attr_sel:this.activeName
					})
					if(res.meta.status !== 201){
						this.$message.error('添加参数失败！')
				}
					this.$message.error('添加参数成功！')
					this.addDialogVisible = false
					this.getParamsData()
				})
			},
			//点击按钮，展示修改对话框
			async showEditDialog(attr_id){
				//查询当前参数信息
				const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
					{
						attr_sel:this.activeName
					})
				if(res.meta.status !== 200){
						this.$message.error('参数获取失败！')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			//点击按钮，修改参数
			editParams(){
				this.$refs.editFormRef.validate(async valid => {
					if(!valid) return
					const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
					{
						attr_name:this.editForm.attr_name,
						attr_sel:this.activeName
					})
					if(res.meta.status !== 200){
						this.$message.error('修改参数失败！')
				}
					this.$message.success('修改参数成功！')
					this.editDialogVisible = false
					this.getParamsData()
				})
			},
			//根据id删除对应参数项
			async removeParams(attr_id){
				const confirmResult =await this.$confirm('此操作将永久删除该文件, 是否继续?',
				'提示',
				{
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).catch(err => err)
		        //用户取消了操作
		        if(confirmResult !== 'confirm'){
		        	return this.$message.info('已取消删除！')
		        }
		        //删除的业务逻辑
		      const {data:res} =await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
		      
		      if(res.meta.status !== 200){
						this.$message.error('删除参数失败！')
				}
		      this.$message.success('删除参数成功！')
					this.getParamsData()
			},
			//文本框失去焦点，或者按下enter都会触发
			//trim()去除字符串两端的空格
			async handleInputConfirm(row){
				if(row.inputValue.trim().length === 0){
					row.inputValue = ''
					row.inputVisible = false
					return
				}
				//如果没有return，则证明输入的内容需要做进一步处理
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue = ''
				row.inputVisible = false
				//需要发起请求，保存这次操作
				this.savaAttrVals(row)
			},
			//点击按钮，显示文本输入框
			showInput(row){
				row.inputVisible = true
				//让文本框自动获取焦点
				//$nextTick方法的使用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
				   this.$nextTick(_ => {
			          this.$refs.saveTagInput.$refs.input.focus();
			        });
			},
			//将对attr_vals的操作，保存到数据库中
			 async savaAttrVals(row){
			 	const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
						{
						attr_name: row.attr_name ,
						attr_sel: row.attr_sel,
						attr_vals: row.attr_vals.join(' ')
						})
						if(res.meta.status !== 200) {
						return this.$message.error("修改参数项失败!" )
						}
						this.$message.success("修改参数成功!")
			 },
			//删除与对应的参数可选项
			handleClose(i,row){
				row.attr_vals.splice(i,1)
				this.savaAttrVals(row)
			}
		},
		computed:{
			//如果按钮需要被禁用，则返回true，否则返回false
			isBtnDisables(){
				if(this.selectedCateKeys.length !== 3){
					return true
				}
				return false
			},
			//当前选中的三级分类id
			cateId(){
				if(this.selectedCateKeys.length === 3){
					return this.selectedCateKeys[2]
				}
				return null
			},
			//动态计算标题文本
			titleText(){
				if(this.activeName === 'many'){
					return '动态参数'
				}
				return'静态属性'
			}
		}
	}
</script>

<style lang="less" scoped>
.cat_opt{
	margin: 15px 0;
}
.el-tag{
	margin: 10px;
}
.input-new-tag{
	width: 120px;
}
</style>