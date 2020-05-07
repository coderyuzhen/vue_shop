<template>
	<div>
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
			<!--卡片视图-->
			<el-card>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-input placeholder="请输入内容"
							 v-model="queryInfo.query"
							 clearable
					    	@clear="getGoodsList">
					    <el-button slot="append" 
					    	icon="el-icon-search" 
					    	@click="getGoodsList"
					    	></el-button>
					</el-input>
					</el-col>
					<el-col :span="4"></el-col>
					 <el-button type="primary" @click="goAddpage">添加商品</el-button>
				</el-row>
				
				<!--table表格区域-->
				<el-table :data="goodslist" border stripe>
					<el-table-column type="index" label="#"></el-table-column>
					<el-table-column  label="商品名称" prop="goods_name"></el-table-column>
					<el-table-column  label="商品价格" prop="goods_price" width="95px"></el-table-column>
					<el-table-column  label="商品重量" prop="goods_weight" width="65px"></el-table-column>
					<el-table-column  label="创建时间" prop="add_time" width="160px">
						<template slot-scope="scope">
							{{scope.row.add_time | dateFormat}}
						</template>
					</el-table-column>
					<el-table-column  label="操作" width="180px">
						<template slot-scope="scope">
							<el-button type="primary" 
								icon="el-icon-edit" 
								size="mini">编辑</el-button>
							<el-button type="danger" 
								icon="el-icon-delete"
								size="mini"
								@click="removeById(scope.row.goods_id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				
				<!--分页区域-->
			     <el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="queryInfo.pagenum"
				      :page-sizes="[1, 2, 5, 10]"
				      :page-size="queryInfo.pagesize"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="total">
				  </el-pagination>
			</el-card>
	</div>
</template>

<script>
	export default{
		name:"List",
		data(){
			return {
				//查询参数对象
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				//商品列表
				goodslist:[],
				//总数据条数
				total:0
			}
		},
		created(){
			this.getGoodsList()
		},
		methods:{
			//根据分页获取对应的商品信息
			async getGoodsList(){
			const {data:res} =await this.$http.get('goods',{params:this.queryInfo})
			if(res.meta.status !== 200){
					return	this.$message.error('获取商品列表失败！')
			}
			this.goodslist = res.data.goods
			this.total = res.data.total
		},
		//监听页面pagesize变化
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getGoodsList()
			},
			//监听页码值的改变
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getGoodsList()
			},
			//根据id删除商品
			async removeById(id){
				const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
		         confirmButtonText: '确定',
		         cancelButtonText: '取消',
		         type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
        	return this.$message.info('已取消删除')
        }
        
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200){
						this.$message.error('删除失败')
				}
        this.$message.success('删除成功')
        this.getGoodsList()
			},
	    //点击跳转到添加页面
	    goAddpage(){
	    	this.$router.push('/goods/add')
	    }
		}
	}
</script>

<style lang="less" scoped>
</style>